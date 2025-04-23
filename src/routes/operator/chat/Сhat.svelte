<script lang="ts">
  import { onDestroy, getContext,afterUpdate, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { Transloc } from '../../translate/Transloc';
  import { showBottomAppBar, langs, llang, signal} from '$lib/stores';
  import IconButton, { Icon } from '@smui/icon-button';
  import emojiRegex from 'emoji-regex';
  import Badge from '@smui-extra/badge';
  import Tts from '../../speech/tts/Tts.svelte';
  import Stt from '../../speech/stt/Stt.svelte';

  import {
      mdiMicrophoneOutline ,
      mdiMicrophone,
      mdiTranslate,
      mdiTranslateOff,
      mdiMicrophoneMessage,
      mdiSendOutline,
      mdiPlay
  } from '@mdi/js';

  let blink_arrow = writable(false);
  let blink_mic = writable(false);

  export let prompt_type="basic", quiz = {quiz:''}, context:string[] = [];

  let stt: Stt | null = null; // Если `Stt` — это класс или компонент Svelte

  let tts: Tts | null = null; // Если `Tts` — это класс или компонент Svelte

  let isListening = false;
  let display_audio = 'none';
  let stt_text = '';
  let isSTT = false;

  let words = 'undefined'

  type Message = {
    role: 'user' | 'assistant' | 'system';
    text: string;
    tr: string;
    cor: string | '';
    id: string;
    isTranslate: boolean;
    replies?: string[]; // <- добавляем replies
  };

  type Messages = Message[];

  let userInput = '';

  $:if(userInput){
    $blink_arrow = true;
    $blink_mic = false
  }else{
    $blink_arrow = false;
  }
  
  let elInput:HTMLInputElement ;
  let messages = writable<Messages>([]);
  let loading = writable(false);
  let to: NodeJS.Timeout;

  let isTranslate = false;
  let isTip = false;

  let translatedMessages = new Map(); // Кэш переведённых сообщений

  let messagesContainer: HTMLElement | null = null;

  let isReply = false;
  let isShowReply = false;

  let dataAr:{}

  let operator = getContext('operator');
  let level = getContext('level');
  let lastMessage:string; // переменная для последнего сообщения

  // Время последнего сообщения (можно сохранять в localStorage для сохранения между перезагрузками)
  let lastMessageTime = parseInt(localStorage.getItem('lastMessageTime') ?? '0') || Date.now();


  let reminderTimeout: NodeJS.Timeout | null = null;

  let selectedReplyId: string | null = null; // ID сообщения, для которого показаны ответы

  let isReminderSent = false; // Флаг для отслеживания отправки напоминания

  interface FormattedSentence {
    gr: string;
    placeholder: string;
    value: string;
    word:string;
    class:string;
  }

  let formattedSentence: FormattedSentence[] = [];


  onMount(async() => {
    // Отправляем reminder при входе в компонент
    sendMessage(`Begin een gesprek in het Nederlands.`);
    $showBottomAppBar = false;
    // Запускаем таймер для проверки неактивности
    startReminderTimer();

    messages.update(msgs =>  
      [...msgs, 
        { id: crypto.randomUUID(), 
          role: "system", 
          text: Array.isArray(context)?context.join(" "):'',
          tr:'',
          cor: '',
          isTranslate:false}
      ]);

      $blink_mic = true;

  });

  // Автопрокрутка вниз при обновлении сообщений
  afterUpdate(() => {
  // Проверяем, было ли изменено поле ввода
  if (elInput) {
    elInput.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});


  // Отправка сообщения
  async function sendMessage(msg:string ='') {

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
      isTranslate:false 
    }]);

    if (messagesContainer) {
        setTimeout(() => {
          messagesContainer?.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);
      }

    const userMessage = msg?msg:userInput;
    userInput = '';
    loading.set(true);

    // Вызываем AI
    await callChat();

    resetReminderTimer(); // Сбрасываем таймер при активности пользователя
  }

  // Вызов ChatGPT
  async function callChat() {
   
    if (to) clearTimeout(to);

    // Ограничиваем историю сообщений до 5 реплик с каждой стороны
    let conversationHistory = $messages
      .slice(-20) // Берем последние 10 сообщений (5 от пользователя и 5 от AI)
      .map(msg => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.text,
        tip: msg.role ==='user'? isTip:'',
        translated: msg.role ==='user'? isTranslate:'',
        stt: msg.role ==='user'?stt_text:''
      }));

      const params = {
        func:"chat",
        user_id: operator.operator,
        type: quiz?.quiz,
        name:quiz?.name,
        owner: operator.abonent,
        prompt: `chat.${prompt_type}.${$llang}`,
        conversationHistory,
        context: context,
        words:words,
        langs: $langs,
        llang: $llang || 'nl',
        level: level,
        lvl:operator.level,       
      };

      console.log('SendMessage',params);

      isTranslate = false;
      isTip = false; 

      $signal.SendMessage(params,async (res) => {    
        console.log('handleData',res)
        handleData(res);       
      });  

      async function handleData(data){
        try{

          if(data.response.tokens_limit){
              const msg= await Transloc("Вы достигли суточного лимита сообщений.",'ru',$langs,'chat')
              messages.update( msgs =>  
              [...msgs, 
                { 
                  id: crypto.randomUUID(), 
                  role: "assistant", 
                  text: `<alert>${msg}</alert>`, 
                  tr: '', 
                  cor: '',
                  isTranslate:false
                }
              ]);

              if (messagesContainer) {
                setTimeout(() => {
                  messagesContainer.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end" });
                }, 100);
              }
              return;
            }

            function splitText(text, llang, langs) {
              // Регулярные выражения для поиска содержимого между тегами <nl>, <ru> и <user>
              const nlRegex = new RegExp(`<${$llang}>([\\s\\S]*?)<\/${$llang}>`);
              const ruRegex = new RegExp(`<${$langs}>([\\s\\S]*?)<\/${$langs}>`);
              const userRegex = /<user>([\s\S]*?)<\/user>/;

              // Поиск содержимого <nl>
              const nlMatch = nlRegex.exec(text);
              const nlContent = nlMatch ? nlMatch[1].trim() : null;

              // Поиск содержимого <ru>
              const ruMatch = ruRegex.exec(text);
              const ruContent = ruMatch ? ruMatch[1].trim() : null;

              // Поиск содержимого <user>
              const uMatch = userRegex.exec(text);
              const uContent = uMatch ? uMatch[1].trim() : null;

              // Функция для извлечения данных из блока (nl, ru или user)
              const extractData = (content) => {
                  if (!content) return null;

                  const corRegex = /<cor>([\s\S]*?)<\/cor>/g;
                  const msgRegex = /<msg>([\s\S]*?)<\/msg>/g;
                  const replyRegex = /<reply>([\s\S]*?)<\/reply>/g;
                  const levelRegex = /<level>([\s\S]*?)<\/level>/g;
                  const wordsRegex = /<words>([\s\S]*?)<\/words>/g;

                  const corMatch = corRegex.exec(content);
                  const msgMatch = msgRegex.exec(content);
                  const levelMatch = levelRegex.exec(content);
                  const wordsMatch = wordsRegex.exec(content);

                  const replies = [];
                  let replyMatch;
                  while ((replyMatch = replyRegex.exec(content)) !== null) {
                      replies.push(replyMatch[1].trim());
                  }

                  return {
                      level: levelMatch ? levelMatch[1].trim() : null,
                      cor: corMatch ? corMatch[1].trim() : null,
                      msg: msgMatch ? msgMatch[1].trim() : null,
                      replies: replies,
                      words: wordsMatch?wordsMatch[1].trim() : null
                  };
              };

              return {
                  [$llang]: nlContent ? extractData(nlContent) : null,
                  [$langs]: ruContent ? extractData(ruContent) : null,
                  user: uContent ? extractData(uContent) : null,
              };
            }

            stt_text = ''

            dataAr =  splitText(data.response);

            // Добавляем cor в список
            if(dataAr[$llang]?.cor)
              messages.update(msgs =>  
              [...msgs, 
                { id: crypto.randomUUID(), 
                  role: "user", 
                  text:'',
                  tr:dataAr[$langs]?.cor,
                  cor: dataAr[$llang]?.cor,
                  isTranslate:false}
              ]);
        
            // Добавляем ответ AI в список
            if(dataAr[$llang]?.msg){
              messages.update(msgs =>  
                [...msgs, 
                  {
                    id: crypto.randomUUID(), 
                    role: "assistant", 
                    text: dataAr[$llang]?.msg, 
                    tr: dataAr[$langs]?.msg, 
                    cor: '', 
                    isTranslate: false,
                    replies: dataAr[$llang]?.replies || [],
                    repliesTranslated: dataAr[$langs]?.replies || [],
                  }
                ]);

              
              if(dataAr[$llang]?.words)
                  words = dataAr[$llang]?.words
            
            }else{
              loading.set(false);
              throw new Error("Нет ответа.");
            }

            setTimeout(() => {
              messagesContainer?.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" });
            }, 500);
            
            // Обновляем время последнего сообщения
            lastMessageTime = Date.now();
            localStorage.setItem('lastMessageTime', lastMessageTime.toString()); // Сохраняем время
            // resetReminderTimer();


            async function removeEmojis(input: string ) {
              const regex = emojiRegex();
              return input.replace(regex, '');
            }

            async function extractAIContent(input: string ) {
              const aiRegex = /<ai>([\s\S]*?)<\/ai>/;
              const match = input.match(aiRegex);
              return match ? match[1].trim() : null;
            }

            if(dataAr[$llang]){

              tts?.Speak_server($llang, dataAr[$llang].msg , '', '');
              isReply = dataAr[$llang].replies.length>0?true:false;
            }

            $blink_mic = true;

        } catch (error) {
          console.error("Произошла ошибка при обращении к серверу:", error);
          messages.update((msgs) => [...msgs, { id: crypto.randomUUID(), role: "assistant", text: "Ошибка при обработке запроса. Попробуйте снова.", tr:"", isTranslate:false }]);
         
        } finally {
          loading.set(false);
        }      
      }
  }

  function StopListening() {
    isListening = false;
  }

  function SttResult(text:string) {
    userInput = text[$llang];
    stt_text = text[$llang];
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

    $blink_mic = false;

    stt.startAudioMonitoring($llang, $langs);

    isListening = true;
  }

  async function toggleTranslation(message:Message) {
    if (!message.tr) 
      message.tr = await Transloc(message.text, $llang, $langs, '');

    if(message.role!=='user')  
      translatedMessages.set(message.text, message.tr);

    message.isTranslate = !message.isTranslate;
    $messages = $messages; // Принудительное обновление  

    
    setTimeout(() => {
      messagesContainer?.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  } 


  const SpeakText = async (text:string) => {

    const output = text.replace(/<[^>]*>/g, '');

    if (text) {
      tts.Speak_server($llang, output, '', '');
    }

}


function toggleReply(messageId: string) {
  if (selectedReplyId === messageId) {
    selectedReplyId = null;
  } else {
    selectedReplyId = messageId;
  }

  setTimeout(() => {
    messagesContainer?.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 100);
}


  function startReminderTimer() {

    reminderTimeout = setTimeout(() => {
      loading.set(false)
      const currentTime = Date.now();
      if (currentTime - lastMessageTime >= 1 * 60 * 1000) { // 5 минут неактивности
        sendMessage(`Blijf praten.`); // Отправляем напоминание
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
    isTip = true;
  }


  // Функция авторазмера
  function autoResize(event) {
    const textarea = event.target;
    textarea.style.height = 'auto'; // сброс
    textarea.style.height = textarea.scrollHeight + 'px'; // установка
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
    <div class="message {message.role} {message.role === 'user'}"
      bind:this={lastMessage} >
      <!--strong>{message.role === 'user' ? 'Вы' : 'AI'}:</strong--> 
      {#if message.cor}
        {#if message.isTranslate} 
          {#if translatedMessages.has(message.cor)}
            <cor> {@html translatedMessages.get(message.cor)}</cor>
            {:else}
            {#if dataAr[$langs] && dataAr[$langs].cor}
              <cor>{@html dataAr[$langs].cor}</cor>
            {:else}
              {#await Transloc(message.cor, $llang, $langs, 'chat') then data}
                <cor> {@html data}</cor>
              {/await}
            {/if}
          {/if}
        {:else}
          <cor> {@html message.cor}</cor>
        {/if}
      {/if}
      
      {#if message.isTranslate && translatedMessages.has(message.text)}
        {@html translatedMessages.get(message.text)}
      {:else}
        {@html message.text}
      {/if}
  
      {#if message.role === 'assistant' }
          {#if selectedReplyId === message.id}
            <div class="reply_container">
              {#each message.replies as reply, i}
                {#if !message.isTranslate}
                  <reply  on:click={() => SetInput(reply)}>
                    {#if message.repliesTranslated?.[i]}
                      {message.repliesTranslated[i]}
                    {:else}
                      {#await Transloc(reply, $llang, $langs, 'chat') then data}
                        {data}
                      {/await}
                    {/if}
                  </reply>
                {:else}
                  <reply on:click={() => SetInput(reply)}>{reply}</reply>
                {/if}
              {/each}            
            </div>
          {/if}
        {/if}
        
        <div style="display:flex;justify-content: space-between;">  

          
          {#if ((message.role === 'system'  && message.text.length>0) || message.role === 'assistant') && quiz.quiz!=='dialog'   }  
            <div on:click={() => SpeakText(message.text)} >
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24" style="scale:1">
                  <path fill="#007bff" d={mdiPlay} />
                </Icon>
              </IconButton>
            </div>
          {/if}

          {#if isReply && message.role === 'assistant' && quiz.quiz!=='dialog'}        
            <div on:click={() => toggleReply(message.id)} >
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24" style="scale:1">
                  <path fill="green" d={mdiMicrophoneMessage} />
                </Icon>
              </IconButton>
            </div>
          {/if}    
    
          {#if message.role === 'assistant' || (message.role === 'user' && message.cor)}
            <div on:click={() => toggleTranslation(message )}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24">
                  {#if message.isTranslate}
                    <path fill={message.role === 'user'?'red':"currentColor"} d={mdiTranslate} />
                  {:else}
                    <path fill={message.role === 'user'?'red':"currentColor"} d={ mdiTranslateOff} />
                  {/if}
                </Icon>
              </IconButton>
            </div>
          {/if}
      
        </div>    
     
    </div>
  {/each}


  </div>

  <div class="input-container" >
    <div class:blink={$blink_mic} style="margin-right:10px; ">
      <IconButton 
        class="material-icons"
        aria-label="Back"
        on:click={onClickMicrophone}
      >
        <Icon tag="svg" viewBox="0 0 24 24" >
          {#if isListening}
            <path fill="currentColor" d={mdiMicrophone} />
          {:else}
            <path fill="currentColor" d={mdiMicrophoneOutline} />
          {/if}
        </Icon>
        
        <Badge
          position="middle"
          align="bottom-end - bottom-middle"
          aria-label="unread count"
          style="position:absolute;top:2px;right:-1px;color:black;background-color:lightgrey;scale:.8;letter-spacing: 1.5px;">{$llang}</Badge>

      </IconButton>
    </div>
    {#if $loading}
      {#await Transloc('AI печатает...', 'ru', $langs, 'chat') then data}
      <textarea disabled
       rows="1"
        bind:value={userInput}
        bind:this = {elInput}
        on:input={autoResize}
        placeholder={data}
        on:keydown={(e) => {onKeydown(e.key)}}
        aria-label="Введите сообщение"
        style="
        width: 100%;
        padding: 10px;
        font-size: 16px;
        line-height: 1.4;
        border: 1px solid #ccc;
        resize: none;
        overflow: hidden;
        box-sizing: border-box;
      "
      />
      {/await}
    {:else}
    {#await Transloc('Введите сообщение...', 'ru', $langs, 'chat') then data}
      <textarea
        rows="1"
        bind:value={userInput}
        bind:this = {elInput}
        on:input={autoResize}
        placeholder={data}
        on:keydown={(e) => {onKeydown(e.key)}}
        aria-label="Введите сообщение"
        style="
        width: 100%;
        padding: 10px;
        font-size: 16px;
        line-height: 1.4;
        border: 1px solid #ccc;
        resize: none;
        overflow: hidden;
        box-sizing: border-box;
      "

      />
    {/await}
    {/if}
    <button class:blink={$blink_arrow}  on:click={()=>{sendMessage()}} disabled={$loading} aria-label="Отправить сообщение" >
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
    margin: 2px;
    padding:2px;
    color:red;
    border:1px solid;
    border-radius: 5px;
    font-size: small;
    font-weight: bold;
  }

  :global(reply){
    display: block;
    color:green;
    font-size:small;
    font-weight: bold;
  }

  :global(alert) {
    display: block;
    color:red;
    font-size:small;
    font-weight: bold;
  }

  textarea::placeholder {
      direction: ltr;
    }


  .chat-container {
    display: flex;
    position: absolute;
    top: 50px;
    width: 100%;
    flex-direction: column;
    /* height: 100vh; */
    /* height: calc(100vh - 42px); */
    bottom: 0px;
  }

  .input-container {
    display: flex;
    flex-shrink: 0; /* Фиксируем контейнер ввода внизу */
    left:10px;
    bottom: 5px;
    padding: 10px;
    background: #fff;
    border-top: 1px solid #ccc;
    margin-top: auto;
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

  .message.system {
    position: relative;
    max-width: 85%;
    top:74vh;
    align-self: flex-start;
    text-align: center;
    background: #c8cfd5;
    color: #007bff;
    font-size: medium;
    font-weight: bold;
  }

  .message.user {
    position: relative;
    max-width: 85%;
    top:74vh;
    align-self: flex-end;
    text-align: end;
    background: #ecf7c5;
  }

  .message.assistant {
    position: relative;
    max-width: 85%;
    top:74vh;
    align-self: flex-start;
    text-align: start;
    background: #d0d1ff;
    color: #007bff;
    font-size: medium;
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

  .blink{
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 100% {
      opacity: .2;
      visibility: hidden;

    }
    50% {
      opacity: 1;
      visibility: visible;
    }
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
