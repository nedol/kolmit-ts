<script lang="ts">
  import { onMount } from 'svelte';
  // import { startAudioMonitoring } from '/src/routes/speech/stt/Stt.js';

  import {
    langs,
    llang,
    dc_oper,
    dc_user,
    msg_oper,
    msg_user,
  } from '$lib/js/stores.js';

  $llang = 'nl';

  import {
    mdiPagePreviousOutline,
    mdiArrowRight,
    mdiArrowLeft,
    mdiShareVariant,
    mdiMicrophone,
    mdiMicrophoneOutline,
    mdiAccountConvertOutline,
    mdiVolumeHigh,
    mdiPlay,
  } from '@mdi/js';

  import IconButton, { Icon } from '@smui/icon-button';
  import Stt from '../speech/stt/Stt.svelte';

  let userInput = {};
  let messages = [];
  let isListening = false;
  let display_audio = true;
  let stt: Stt;

  $: if ($msg_oper || $msg_user) {
    const msg = $msg_oper || $msg_user;
    if (msg.func === 'chat') {
      console.log(msg.text[$llang]);
      messages.unshift({ text: msg.text, isQuestion: 'answer' });
      messages = messages;
    }
  }

  // Function to call ChatGPT
  async function callChat() {
    try {
      if (!userInput[$llang]) return;

      userInput[$llang] = userInput[$llang].slice(0, 500);

      // messages = [{ text: userInput, isQuestion: 'question' }, ...messages];
      messages.unshift({ text: userInput, isQuestion: 'question' });
      messages = messages;

      // const response = await fetch(`/chat`, {
      // 	method: 'POST',
      // 	body: JSON.stringify({ question: userInput }),
      // 	headers: { 'Content-Type': 'application/json' }
      // });

      // userInput = '';

      // if (!response.ok) {
      // 	throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      // const data = await response.json();
      // const resp = data.response.answer;
      // console.log('resp', resp);
      // Переворачиваем массив для обработки с конца
      // const reversedArray = resp.slice().reverse();

      // Извлекаем значение 'correct' из каждого объекта в перевернутом массиве
      // const correctValues = resp.map((item) => {
      // 	if (item.reply) return JSON.parse(item.reply).correct;
      // });

      // let answer = resp ? resp.correct : 'no answer';

      // messages = [{ text: {['nl']:'response'}, isQuestion: 'answer' }, ...messages];
    } catch (error) {
      console.error('Произошла ошибка при обращении к серверу:', error);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      callChat();
      SendDC();
    }
  }

  onMount(() => {
    // stt.sendLoadModel();
  });

  function micClicked() {
    if (!isListening) {
      isListening = true;
      stt.startAudioMonitoring($langs, $llang); // Здесь должен быть ваш код для активации микрофона
    } else {
      stt.MediaRecorderStop();
      isListening = false;
    }
  }

  function StopListening() {
    isListening = false;
  }

  function SttResult(data: {}) {
    if(data[$llang])
    userInput = data;
    // callChat();
    isListening = false;
    // SendDC(data);
  }

  function SendDC(text: string) {
    const dc = $dc_user || $dc_oper;
    if (dc)
      dc.SendData(
        {
          func: 'chat',
          lang: text ? text : $llang,
          text: userInput,
        },
        () => {
          console.log();
        }
      );
  }
</script>

<div class="chat-container" style="overflow-y: auto;">
  {#each messages as { text, isQuestion }, index (index)}
    <div class="userMessage {isQuestion}" key={index}>
      {text[$llang]}
      <div class="original">{text[$langs]}</div>
    </div>
  {/each}
</div>
<br />

<!-- <div
  class="margins"
  style="text-align: center; display: flex; align-items: center; justify-content: space-between;"
> -->
<div class="input-container">
  <IconButton on:click={micClicked}>
    <Icon tag="svg" viewBox="0 0 24 24">
      {#if isListening}
        <path fill="currentColor" d={mdiMicrophone} />
      {:else}
        <path fill="currentColor" d={mdiMicrophoneOutline} />
      {/if}
    </Icon>
  </IconButton>
  <Stt bind:this={stt} bind:display_audio {SttResult} {StopListening}></Stt>
  <button
    on:click={() => {
      userInput[$llang] = userInput[$llang].slice(0, 500);
      messages.unshift({ text: userInput, isQuestion: 'question' });
      messages = messages;
      SendDC(userInput[$llang]);
    }}>Отправить</button
  >
</div>
<!-- </div> -->

<!-- <div class="input-container">

  <div class="mic-button">
    <IconButton on:click={micClicked}>
      <Icon tag="svg" viewBox="0 0 24 24">
        {#if isListening}
          <path fill="currentColor" d={mdiMicrophone} />
        {:else}
          <path fill="currentColor" d={mdiMicrophoneOutline} />
        {/if}
      </Icon>
    </IconButton>
  </div>
</div> -->

<div class="textarea-container">
  <textarea
    id="myTextarea"
    maxlength="500"
    bind:value={userInput[$langs]}
    on:keydown={handleKeyDown}
    placeholder="Задайте вопрос..."
  ></textarea>
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column-reverse;
    position: relative;
    width: 100%;
    height: 70vh;
    background-color: #f4f4f8;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding-bottom: 6px; /* Оставляем место для поля ввода и кнопки */
  }

  .userMessage {
    margin: 5px;
    padding: 5px;
    border-radius: 5px;
  }

  .userMessage.question {
    width: 80%;
    background-color: #cce5ff;
    float: left;
  }

  .userMessage.answer {
    width: 80%;
    background-color: #e0e0e0;
    /* margin-left: 60px; */
    float: right;
  }

  .input-container {
    display: flex;
    position: relative;
    bottom: 0vh;
    padding: 0 10px; /* Добавляем отступы */
  }

  .original {
    font-size: x-small;
    color: rgb(40, 72, 113);
  }

  button {
    position: relative;
    bottom: 0px; /* Кнопка выше нижней границы на 30px */
  }

  .textarea-container {
    position: relative;
    display: inline-block;
    width: 96vw;
    margin-left: 2vw;
    bottom: -3px;
  }

  .textarea-container textarea {
    height: 10vh;
    position: relative;
    bottom: 0;
    width: 98%;
  }

  .mic-button {
    position: absolute;
    top: 50%;
    right: 10px; /* Отступ от правого края контейнера */
    transform: translateY(-50%); /* Центрирование по вертикали */
    background: transparent;
    border: none;
    font-size: 20px; /* Размер иконки */
    cursor: pointer;
  }

  /* Стилизация textarea и кнопки по желанию */
</style>
