<script lang="ts">
  import { onDestroy, afterUpdate, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { Translate } from '../../translate/Transloc';
  import { langs, llang } from '$lib/stores';
  import IconButton, { Icon } from '@smui/icon-button';
  import emojiRegex from 'emoji-regex';

  import Tts from '../../speech/tts/Tts.svelte';
  import Stt from '../../speech/stt/Stt.svelte';

  import {
      mdiMicrophoneOutline ,
      mdiMicrophone,
      mdiTranslate,
      mdiTranslateOff
  } from '@mdi/js';

  let stt: Stt | null = null; // Если `Stt` — это класс или компонент Svelte

  let tts: Tts | null = null; // Если `Tts` — это класс или компонент Svelte

  let isListening = false;
  let display_audio = 'none';
  let stt_text = '';
  let isSTT = false;

  type Message = { role: 'user' | 'assistant' | 'system'; text: string; tr: string; id: string; isTranslated: boolean; };
  type Messages = Message[];

  let userInput = '';
  let messages = writable<Messages>([]);
  let loading = writable(false);
  let to: NodeJS.Timeout;

  let isTranslated = false;
  let translatedMessages = new Map(); // Кэш переведённых сообщений

  let messagesContainer: HTMLElement | null = null;



  // Время последнего сообщения (можно сохранять в localStorage для сохранения между перезагрузками)
  let lastMessageTime = parseInt(localStorage.getItem('lastMessageTime') ?? '0') || Date.now();


  let reminderTimeout: NodeJS.Timeout | null = null;


  let isReminderSent = false; // Флаг для отслеживания отправки напоминания

  onMount(async() => {
    // Отправляем reminder при входе в компонент
    sendMessage(`Begin een gesprek in het Nederlands.`,'greeting');

    // Запускаем таймер для проверки неактивности
    startReminderTimer();
  });

  // Автопрокрутка вниз при обновлении сообщений
  afterUpdate(() => {
    if (messagesContainer) {
      // Прокручиваем вниз (к последнему сообщению)
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });



  // Отправка сообщения
  async function sendMessage(msg:string ='', type:string = 'basic') {
    if (!userInput.trim() && !msg.trim()) return;


    // Добавляем сообщение пользователя в список
    if(!msg)
      messages.update((msgs) => [...msgs, { id: crypto.randomUUID(), role: 'user', text: userInput, tr:"", isTranslated:false }]);

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
    console.log('callChat')
    try {
      if (to) clearTimeout(to);

      // Ограничиваем историю сообщений до 5 реплик с каждой стороны
      let conversationHistory = $messages
        .slice(-6) // Берем последние 6 сообщений (5 от пользователя и 5 от AI)
        .map(msg => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.text
        }));

      const params = {
        prompt: prompt_type,
        conversationHistory,
        lang: $langs,
        llang: $llang,
        level: "B1.1"
      };

      console.log('callChat fetch',params)

      const response = await fetch(`./operator/chat`, {
        method: "POST",
        body: JSON.stringify({ params }),
        headers: { "Content-Type": "application/json" },
      });

      console.log('callChat response',response)

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      function splitText(text) {
        // Создаем регулярные выражения динамически
        const nlRegex = new RegExp(`<${$llang}>([\\s\\S]*?)<\/${$llang}>`);
        const ruRegex = new RegExp(`<${$langs}>([\\s\\S]*?)<\/${$langs}>`);

        // Поиск содержимого <nl>
        const nlMatch = text.match(nlRegex);
        const nlContent = nlMatch ? nlMatch[1].trim() : null;

        // Поиск содержимого <ru>
        const ruMatch = text.match(ruRegex);
        const ruContent = ruMatch ? ruMatch[1].trim() : null;

        return { [$llang]: nlContent, [$langs]: ruContent };

      };  

      const dataAr =  splitText(data.res);
      
      console.log('splitText')

      // Добавляем ответ AI в список
      messages.update(msgs =>  [...msgs, { id: crypto.randomUUID(), role: "assistant", text: dataAr[$llang], tr: dataAr[$langs] , isTranslated:false}]);

      console.log('messages.update');

      // Обновляем время последнего сообщения
      lastMessageTime = Date.now();
      localStorage.setItem('lastMessageTime', lastMessageTime.toString()); // Сохраняем время
      // resetReminderTimer();

      console.log('localStorage.setItem');

      async function removeEmojis(input: string ) {
        const regex = emojiRegex();
        return await input.replace(regex, '');
      }

      async function extractAIContent(input: string ) {
        const aiRegex = /<ai>([\s\S]*?)<\/ai>/;
        const match = input.match(aiRegex);
        return match ? match[1].trim() : null;
    }

    function removeCorTags(input: string ) {
        // Регулярное выражение для поиска тегов <cor> и их содержимого
        const corRegex = /<cor>[\s\S]*?<\/cor>/g;
        return input.replace(corRegex, '');
    }

    console.log('Before Speak_server');

    if(dataAr[$llang])
      tts?.Speak_server($llang, await removeCorTags(dataAr[$llang]), '', '');
      
    console.log('tts');

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
    sendMessage();
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
    {#each $messages as message (message.id)}
    <div class="message {message.role} {message.role === 'user' && index === 0 ? 'first-message' : ''}">
      <!--strong>{message.role === 'user' ? 'Вы' : 'AI'}:</strong--> 
      {#if message.isTranslated && translatedMessages.has(message.text)}
        {@html translatedMessages.get(message.text)}
      {:else}
        {@html message.text}
      {/if}
  
      {#if message.role !== 'user' }
        <div style="margin: 2px; float: inline-end;" on:click={() => toggleTranslation(message)}>
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
        placeholder={data}
        on:keydown={(e) => e.key === 'Enter' && sendMessage()}
        aria-label="Введите сообщение"
      />
    {/await}
    <button on:click={()=>{sendMessage()}} disabled={$loading} aria-label="Отправить сообщение">
      {#await Translate('Отправить', 'ru', $langs, 'chat') then data}
        {data}
      {/await}
    </button>
  </div>
</div>

<style>
  :global(cor){
    color:red;
    font-size: small;
    font-weight: bold;
  }
  .chat-container {
    display: flex;
    flex-direction: column;
    position: relative;
    height: calc(100vh - 104px);
    max-width: 98vw;
    margin: auto;
    border: 1px solid #ccc;
    border-radius: 10px;
    background: #f9f9f9;  
    top: 10px;
  }

  .input-container {
    display: flex;
    position: absolute;
    width: 95vw;
    bottom: 5px;
    padding: 10px;
    background: #fff;
    border-top: 1px solid #ccc;
  }

  .messages {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex-grow: 1;
    padding: 20px;
    padding-bottom: 60px;
    position: absolute;
    bottom: 0px;
  }

  .message { 
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    word-wrap: break-word;
  }

  .message.user {
    position: relative;
    width: 85%;
    left:20px;
    align-self: flex-end;
    background: #c8f7c5;
  }

  .message.assistant {
    position: relative;
    width: 85%;
    right:20px;
    align-self: flex-start;
    background: #d0d1ff;
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
    font-style: italic;
    color: gray;
    bottom: 0px; /* Помещаем под последнее сообщение */
    left: 10px;
    width: calc(100% - 20px); 
  }
</style>
