<script lang="ts">
  import { onDestroy, getContext,afterUpdate, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { Translate } from '../../translate/Transloc';
  import { langs, llang, operatorst } from '$lib/stores';
  import IconButton, { Icon } from '@smui/icon-button';
  import emojiRegex from 'emoji-regex';

  import Tts from '../../speech/tts/Tts.svelte';
  import Stt from '../../speech/stt/Stt.svelte';

  import {
    showBottomAppBar
  } from '$lib/stores.ts';

  import {
      mdiMicrophoneOutline ,
      mdiMicrophone,
      mdiTranslate,
      mdiTranslateOff,
      mdiMicrophoneMessage,
      mdiSendOutline
  } from '@mdi/js';

  let stt: Stt | null = null; // Если `Stt` — это класс или компонент Svelte

  let tts: Tts | null = null; // Если `Tts` — это класс или компонент Svelte

  let isListening = false;
  let display_audio = 'none';
  let stt_text = '';
  let isSTT = false;

  type Message = { role: 'user' | 'assistant' | 'system'; text: string; tr: string; cor:string; id: string; isTranslated: boolean; };
  type Messages = Message[];

  let userInput = '';
  let elInput:HTMLInputElement ;
  let messages = writable<Messages>([]);
  let loading = writable(false);
  let to: NodeJS.Timeout;

  let isTranslated = false;
  let translatedMessages = new Map(); // Кэш переведённых сообщений

  let messagesContainer: HTMLElement | null = null;

  let isReply = true;
  let isShowReply = false;

  let dataAr:{}

  let operator = getContext('operator');
  let lastMessage:string; // переменная для последнего сообщения

  // Время последнего сообщения (можно сохранять в localStorage для сохранения между перезагрузками)
  let lastMessageTime = parseInt(localStorage.getItem('lastMessageTime') ?? '0') || Date.now();


  let reminderTimeout: NodeJS.Timeout | null = null;

  let selectedReplyId: string | null = null; // ID сообщения, для которого показаны ответы

  let isReminderSent = false; // Флаг для отслеживания отправки напоминания

  onMount(async() => {
    // Отправляем reminder при входе в компонент
    sendMessage(`Begin een gesprek in het Nederlands.`,'greeting');
    $showBottomAppBar = false;
    // Запускаем таймер для проверки неактивности
    startReminderTimer();
  });

  // Автопрокрутка вниз при обновлении сообщений
  afterUpdate(() => {
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    if(elInput){
      elInput.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  });


  // Отправка сообщения
  async function sendMessage(msg:string ='', type:string = 'basic') {
    if (!userInput.trim() && !msg.trim()) return;


    // Добавляем сообщение пользователя в список
    if(!msg)
      messages.update((msgs) => [...msgs, 
    { 
      id: crypto.randomUUID(), 
      role: 'user', 
      text: userInput, 
      tr:"", 
      cor:"",
      isTranslated:false 
    }]);

    const userMessage = msg?msg:userInput;
    userInput = '';
    loading.set(true);

    const prompt_type = {quiz:'chat',type:type,lang:$llang};

    // Вызываем AI
    await callChat(prompt_type,userMessage);

    resetReminderTimer(); // Сбрасываем таймер при активности пользователя
  }

  // Вызов ChatGPT
  async function callChat(prompt_type: {}, text: string) {
    try {
      if (to) clearTimeout(to);

      // Ограничиваем историю сообщений до 5 реплик с каждой стороны
      let conversationHistory = $messages
        .slice(-2) // Берем последние 6 сообщений (5 от пользователя и 5 от AI)
        .map(msg => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.text
        }));

      const params = {
        user_id: operator.operator,
        prompt: prompt_type,
        conversationHistory,
        lang: $langs,
        llang: $llang,
        level: "B1.1"
      };

      const response = await fetch(`./operator/chat`, {
        method: "POST",
        body: JSON.stringify({ params }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if(data.res.tokens_limit){
        const msg= await Translate("Вы достигли суточного лимита сообщений.",'ru',$langs,'chat')
        messages.update( msgs =>  
        [...msgs, 
          { 
            id: crypto.randomUUID(), 
            role: "assistant", 
            text: `<alert>${msg}</alert>`, 
            tr: '', 
            cor: '',
            isTranslated:false
          }
        ]);
        return;
      }

      function splitText(text) {
        // Регулярные выражения для поиска содержимого между тегами <nl> и <ru>
        const nlRegex = /<nl>([\s\S]*?)<\/nl>/;
        const ruRegex = /<ru>([\s\S]*?)<\/ru>/;

        // Поиск содержимого <nl>
        const nlMatch = text.match(nlRegex);
        const nlContent = nlMatch ? nlMatch[1].trim() : null;

        // Поиск содержимого <ru>
        const ruMatch = text.match(ruRegex);
        const ruContent = ruMatch ? ruMatch[1].trim() : null;

        // Функция для извлечения данных из блока (nl или ru)
        const extractData = (content) => {
            const corRegex = /<cor>([\s\S]*?)<\/cor>/;
            const msgRegex = /<msg>([\s\S]*?)<\/msg>/;
            const replyRegex = /<reply>([\s\S]*?)<\/reply>/g;

            const corMatch = content.match(corRegex);
            const msgMatch = content.match(msgRegex);
            const replyMatches = content.match(replyRegex);

            return {
                cor: corMatch ? corMatch[1].trim() : null,
                msg: msgMatch ? msgMatch[1].trim() : null,
                replies: replyMatches ? replyMatches.map(match => match.replace(/<\/?reply>/g, '').trim()) : [],
            };
        };

        return {
            nl: nlContent ? extractData(nlContent) : null,
            ru: ruContent ? extractData(ruContent) : null,
        };
     }


      dataAr =  splitText(data.res);
    
      // Добавляем ответ AI в список
      messages.update(msgs =>  
      [...msgs, 
        { id: crypto.randomUUID(), 
          role: "assistant", 
          text: dataAr[$llang]?.msg, 
          tr: dataAr[$langs]?.msg , 
          cor: dataAr[$llang]?.cor,
          isTranslated:false}
      ]);

      // Обновляем время последнего сообщения
      lastMessageTime = Date.now();
      localStorage.setItem('lastMessageTime', lastMessageTime.toString()); // Сохраняем время
      // resetReminderTimer();

      async function removeEmojis(input: string ) {
        const regex = emojiRegex();
        return await input.replace(regex, '');
      }

      async function extractAIContent(input: string ) {
        const aiRegex = /<ai>([\s\S]*?)<\/ai>/;
        const match = input.match(aiRegex);
        return match ? match[1].trim() : null;
      }

      if(dataAr[$llang]){

        tts?.Speak_server($llang, dataAr[$llang].msg , '', '');
        isReply = dataAr[$llang].replies?true:false;
      }

    } catch (error) {
      console.error("Произошла ошибка при обращении к серверу:", error);
      messages.update((msgs) => [...msgs, { id: crypto.randomUUID(), role: "assistant", text: "Ошибка при обработке запроса. Попробуйте снова.", tr:"", isTranslated:false }]);
    } finally {
      loading.set(false);
    }
  }
  function StopListening() {
    isListening = false;
  }

  function SttResult(text:string) {
    userInput = text[$llang];
    // sendMessage();
  }

  function onClickMicrophone() {
    if (isListening) {
      stt_text = ''
      stt?.MediaRecorderStop();
      isListening = false;
      return;
    }

    stt_text = ''

    stt.startAudioMonitoring($llang, $langs);

    isListening = true;
  }

  async function toggleTranslation(message:Message) {
    if (!message.tr) 
      message.tr = await Translate(message.text, $llang, $langs, '');

    translatedMessages.set(message.text, message.tr);

    message.isTranslated = !message.isTranslated;
    $messages = $messages; // Принудительное обновление  
  } 

  function toggleReply(messageId: string) {
    if (selectedReplyId === messageId) {
      selectedReplyId = null; // Скрыть ответы, если они уже показаны для этого сообщения
    } else {
      selectedReplyId = messageId; // Показать ответы для выбранного сообщения
    }

    elInput.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  function startReminderTimer() {

    reminderTimeout = setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - lastMessageTime >= 1 * 60 * 1000) { // 5 минут неактивности
        sendMessage(`Blijf praten.`, 'basic'); // Отправляем напоминание
        stopReminderTimer(); // Останавливаем таймер после отправки
      }
    }, 1 * 60 * 1000); // Проверка через 5 минут
  }

    // Функция для остановки таймера
    function stopReminderTimer() {
    if (reminderTimeout) {
      clearTimeout(reminderTimeout);
      reminderTimeout = null; // Сбрасываем таймер
    }
  }

  // Функция для сброса таймера при активности пользователя
  function resetReminderTimer() {
    // stopReminderTimer(); // Останавливаем текущий таймер
    lastMessageTime = Date.now(); // Обновляем время последнего сообщения
    localStorage.setItem('lastMessageTime', lastMessageTime.toString()); // Сохраняем в localStorage
    // startReminderTimer(); // Запускаем таймер заново
  }

  function onKeydown(key){

    elInput.scrollIntoView({ behavior: "smooth", block: "end" });
    key === 'Enter' && sendMessage();
  }

  function SetInput(text:string){
    userInput = text;
    elInput.scrollIntoView({ behavior: "smooth", block: "end" });
  }

    // Очистка таймера при размонтировании
  onDestroy(() => {
    if (to) clearTimeout(to);
    stopReminderTimer();
  });
</script>

<Tts bind:this={tts}></Tts>
<div class="chat-container">
  <Stt 
    {SttResult}
    {StopListening}
    bind:display_audio
    bind:this={stt}></Stt>

   
  <div class="messages" bind:this={messagesContainer}>
    
    {#each $messages as message, index (message.id)}
    <div class="message {message.role} {message.role === 'user' && index === 0 ? 'first-message' : ''}"
      bind:this={lastMessage} >
      <!--strong>{message.role === 'user' ? 'Вы' : 'AI'}:</strong--> 
      {#if message.cor}
        {#if message.isTranslated && translatedMessages.has(message.cor)}
            <cor> {@html translatedMessages.get(message.cor)}</cor>
        {:else}
          <cor> {@html message.cor}</cor>
        {/if}
      {/if}
      
      {#if message.isTranslated && translatedMessages.has(message.text)}
        {@html translatedMessages.get(message.text)}
      {:else}
        {@html message.text}
      {/if}
  
      {#if message.role !== 'user' }
        {#if selectedReplyId === message.id}
          <div class="reply_container">
            {#each dataAr[$llang].replies as reply,i}
              {#if message.isTranslated} 
                <reply on:click={()=>{SetInput(dataAr[$llang]?.replies[i]) }}>{reply}</reply>
              {:else}
              {#if dataAr[$langs]?.replies[i]}
                <reply on:click={()=>{SetInput(reply)}}>{dataAr[$langs].replies[i]}</reply>
              {:else}
                {#await Translate(reply,$llang, $langs,'chat') then data}
                  <reply on:click={()=>{SetInput(reply)}}>{data}</reply>
                {/await}
                {/if} 
              {/if}
            {/each}
          </div>
        {/if}
        <div style="display:flex;justify-content: space-between;">
          {#if isReply}
              <div on:click={() => toggleReply(message.id)} >
                <IconButton>
                  <Icon tag="svg" viewBox="0 0 24 24" style="scale:1">
                    <path fill="green" d={mdiMicrophoneMessage} />
                  </Icon>
                </IconButton>
              </div>
            {/if}
            <div 
              on:click={() => toggleTranslation(message)}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24">
                  {#if message.isTranslated}
                    <path fill="currentColor" d={mdiTranslate} />
                  {:else}
                    <path fill="currentColor" d={mdiTranslateOff} />
                  {/if}
                </Icon>
              </IconButton>
            </div>
        </div>
      {/if}
    </div>
  {/each}

    {#if $loading}
      {#await Translate('AI печатает...', 'ru', $langs, 'chat') then data}
        <div class="loading" aria-live="polite">{data}</div>
      {/await}
    {/if}
  </div>

  <div class="input-container">
    <div>
      <IconButton
        class="material-icons"
        aria-label="Back"
        on:click={onClickMicrophone}
      >
        <Icon tag="svg" viewBox="0 0 24 24">
          {#if isListening}
            <path fill="currentColor" d={mdiMicrophone} />
          {:else}
            <path fill="currentColor" d={mdiMicrophoneOutline} />
          {/if}
        </Icon>
      </IconButton>
    </div>

    {#await Translate('Введите сообщение...', 'ru', $langs, 'chat') then data}
      <input
        bind:value={userInput}
        bind:this = {elInput}
        placeholder={data}
        on:keydown={(e) => {onKeydown(e.key)}}
        aria-label="Введите сообщение"
      />
    {/await}
    <button on:click={()=>{sendMessage()}} disabled={$loading} aria-label="Отправить сообщение">
       <IconButton
        class="material-icons">
        <Icon tag="svg" viewBox="0 0 24 24">
          <path fill="white" d={mdiSendOutline} />
        </Icon>
    </IconButton>
    </button>
  </div>
</div>

<style>
  :global(cor){
    display:block;
    margin: 10px;
    color:red;
    font-size: medium;
    font-weight: bold;
  }

  :global(reply){
    display: block;
    color:green;
    font-size:medium;
    font-weight: bold;
  }

  :global(alert) {
    display: block;
    color:red;
    font-size:medium;
    font-weight: bold;
  }


  .chat-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 78px);
  }

  .input-container {
    display: flex;
    flex-shrink: 0; /* Фиксируем контейнер ввода внизу */
    bottom: 5px;
    padding: 10px;
    background: #fff;
    border-top: 1px solid #ccc;
    margin-top: 7px;
  }

  .messages {
    flex: 1;
    display: flex;
    flex-direction: column; /* Сообщения идут сверху вниз */
    /* justify-content: flex-end;  */
    align-items: flex-start;
    overflow-y: auto;
    padding: 10px;
    background-color: #f1f1f1;
  }


  .message { 
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    word-wrap: break-word;
  }

  .message.user {
    position: relative;
    max-width: 85%;
    top:74vh;
    align-self: flex-end;
    text-align: end;
    background: #c8f7c5;
  }

  .message.assistant {
    position: relative;
    max-width: 85%;
    top:74vh;
    align-self: flex-start;
    text-align: start;
    background: #d0d1ff;
    color: #007bff;
    font-size: large;
    font-weight: bold;
  }

  /* Убедитесь, что только первое сообщение пользователя выравнивается по правому краю */
  .message.first-message {
    align-self: flex-end;
  }

  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .reply_container{
    display: block;
    margin: 10px;
  }

  button {
    padding: 8px 12px;
    border: none;
    background: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .loading {
    position: relative;
    top:74vh;
    font-style: italic;
    color: gray;
    bottom: 0px; /* Помещаем под последнее сообщение */
    left: 10px;
    width: calc(100% - 20px); 
  }
</style>
