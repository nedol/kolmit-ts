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

  let stt, tts;

  let isListening = false;
  let display_audio = 'none';
  let stt_text = '';
  let isSTT = false;

  type Message = { role: 'user' | 'ai'; text: string };
  type Messages = Message[];

  let userInput = '';
  let messages = writable<Messages>([]);
  let loading = writable(false);
  let to: NodeJS.Timeout;

  let isTranslated = false;
  let translatedMessages = new Map(); // Кэш переведённых сообщений

  let messagesContainer;


  // Время последнего сообщения (можно сохранять в localStorage для сохранения между перезагрузками)
  let lastMessageTime = localStorage.getItem('lastMessageTime')
  ? parseInt(localStorage.getItem('lastMessageTime'))
  : Date.now();

  let reminderTimeout;

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
      messages.update((msgs) => [...msgs, { role: 'user', text: userInput }]);
    const userMessage = msg?msg:userInput;
    userInput = '';
    loading.set(true);

    const prompt_type = {quiz:'chat',type:type,lang:$llang};

    // Вызываем AI
    await callChat(prompt_type,userMessage);
  }

  // Вызов ChatGPT
  async function callChat(prompt_type: {}, text: string) {
  try {
    if (to) clearTimeout(to);

    // Ограничиваем историю сообщений до 5 реплик с каждой стороны
    let conversationHistory = $messages
      .slice(-10) // Берем последние 10 сообщений (5 от пользователя и 5 от AI)
      .map(msg => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.text
      }));

    const params = {
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

    // Добавляем ответ AI в список
    messages.update((msgs) => [...msgs, { role: "ai", text: data.res }]);

    // Обновляем время последнего сообщения
    lastMessageTime = Date.now();
    localStorage.setItem('lastMessageTime', lastMessageTime.toString()); // Сохраняем время
    resetReminderTimer();

    async function removeEmojis(input) {
      const regex = emojiRegex();
      return await input.replace(regex, '');
    }

    tts.Speak_server($llang, await removeEmojis(data.res), '', '');
    console.log('tts');

  } catch (error) {
    console.error("Произошла ошибка при обращении к серверу:", error);
    messages.update((msgs) => [...msgs, { role: "ai", text: "Ошибка при обработке запроса. Попробуйте снова." }]);
  } finally {
    loading.set(false);
  }
}
  function StopListening() {
    isListening = false;
  }

  function SttResult(text) {
    userInput = text[$llang];
    sendMessage();
  }

  function onClickMicrophone() {
    if (isListening) {
      stt_text = ''
      stt.MediaRecorderStop();
      isListening = false;
      return;
    }

    stt_text = ''

    stt.startAudioMonitoring($llang, $langs);

    isListening = true;
  }

  async function toggleTranslation(message) {
    if (!translatedMessages.has(message.text)) {
      const tr = await Translate(message.text, $llang, $langs, '');
      translatedMessages.set(message.text, tr);
    }
    message.isTranslated = !message.isTranslated;
    $messages = $messages; // Принудительное обновление
  }

  function startReminderTimer() {
    reminderTimeout = setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - lastMessageTime >= 5 * 60 * 1000) { // 5 минут в миллисекундах
        sendMessage(`Blijf praten.`,'basic');
      }
    }, 5 * 60 * 1000); // Проверка через 5 минут
  }

  function resetReminderTimer() {
    if (reminderTimeout) {
      clearTimeout(reminderTimeout);
    }
    startReminderTimer();
  }

    // Очистка таймера при размонтировании
  onDestroy(() => {
    if (to) clearTimeout(to);
    if (reminderTimeout) clearTimeout(reminderTimeout);
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
    {#each $messages as message, index (message.text)}
    <div class="message {message.role} {message.role === 'user' && index === 0 ? 'first-message' : ''}">
      <!--strong>{message.role === 'user' ? 'Вы' : 'AI'}:</strong--> 
      {#if message.isTranslated && translatedMessages.has(message.text)}
        {translatedMessages.get(message.text)}
      {:else}
        {message.text}
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
    right:0;
    flex-grow: 1;
    padding: 10px;
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
    max-width: 85%;
    align-self: flex-end;
    background: #c8f7c5;
  }

  .message.ai {
    max-width: 85%;
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
