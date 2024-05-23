<script lang="ts">
  import { onMount } from 'svelte';
  import { Speak } from '/src/routes/speech/tts/VoiceRSS';
  import {Transloc} from '/src/routes/translate/Transloc'

  import {
    langs,
    llang,
    dc_oper,
    dc_user,
    msg_oper,
    msg_user,
  } from '$lib/js/stores.js';

  $llang = 'nl';

  $: dc = $dc_oper || $dc_user;

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

  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';
  import Stt from '../speech/stt/Stt.svelte';

  let userInput = {};
  let messages = [];
  let isListening = false;
  let display_audio = 'none';
  let stt: Stt;
  let variant = 'outlined';

  $: if ($msg_oper || $msg_user) {
    const msg = $msg_oper || $msg_user;
    if (msg.func === 'chat') {
      // console.log(msg.text[$llang]);
      messages.unshift({ text: msg.text, isQuestion: 'answer' });
      messages = messages;
    }
  }

  // Function to call ChatGPT
  async function callChat(text) {
    try {

      let question = { text: text, lang: $langs, llang: $llang };

      const response = await fetch(`/src/routes/chat`, {
        method: 'POST',
        body: JSON.stringify({ question }),
        headers: { 'Content-Type': 'application/json' },
      });

      // userInput = '';

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      messages.unshift({ text: data.res, isQuestion: 'answer' });
      messages = messages;
    } catch (error) {
      console.error('Произошла ошибка при обращении к серверу:', error);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      callChat();
      SendDC('');
    }
  }

  onMount(() => {
    SendDC('Test');
  });

  async function speak(text) {
    Speak(text);
  }

  function micClicked() {
    if (!isListening) {
      isListening = true;
      if (dc) {
        stt.startAudioMonitoring($langs, $llang); // Здесь должен быть ваш код для активации микрофона
      } else {
        stt.startAudioMonitoring($llang, $langs);
      } // Здесь должен быть ваш код для активации микрофона
    } else {
      stt.MediaRecorderStop();
      isListening = false;
    }
  }

  function StopListening() {
    isListening = false;
    display_audio = false;
  }

  function SttResult(data: {}) {
    if (data[$llang]) userInput = data;
    userInput[$llang] = userInput[$llang].slice(0, 500);
    messages.unshift({ text: userInput, isQuestion: 'question' });
    messages = messages;
    isListening = false;
    // SendDC(data);
  }

  function SendDC(text: string) {
    const dc = $dc_user || $dc_oper;
    if (dc) {
      dc.SendData(
        {
          func: 'chat',
          lang: $llang,
          text: text ? text : 'test',
        },
        () => {
          console.log();
        }
      );
    } else {
      callChat(text || 'Расскажи о себе ');
    }
  }



  function SendRepeat() {
    variant = 'unelevated';
    setTimeout(() => {
      variant = 'outlined';
    }, 1000);

    if (dc) {
      dc.SendData(
        {
          command: 'repeat',
        },
        () => {
          console.log();
        }
      );
    }
  }
</script>

<div class="chat-container" style="overflow-y: auto;">
  {#each messages as { text, isQuestion }, index (index)}
    <div style="display:inline-flex">
      <div class="userMessage {isQuestion}" key={index}>
        {text[$llang]}
         {#await Transloc(text[$llang], $llang, $langs) then data}
        <div class="original">{data}</div>
        {/await}
      </div>
      <div class="speaker-button">
        <IconButton on:click={speak(text[$llang])}>
          <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiPlay} />
          </Icon>
        </IconButton>
      </div>
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
  {#await Transloc('Отправить', 'ru', $langs) then data}
    <Button
      on:click={() => {
        SendDC(userInput[$llang]);
      }}><Label>{data}</Label></Button
    >
  {/await}

  {#if dc}
    <div class="repeat_but">
      {#await Transloc('Повторить', 'ru', $langs) then data}
        <Button on:click={() => SendRepeat()} {variant}>
          <Label>{data}</Label>
        </Button>
      {/await}
    </div>
  {/if}
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

<!-- <div class="textarea-container">
  <textarea
    id="myTextarea"
    maxlength="500"
    bind:value={userInput[$langs]}
    on:keydown={handleKeyDown}
    placeholder="Задайте вопрос..."
  ></textarea>
</div> -->

<style>
  .chat-container {
    display: flex;
    flex-direction: column-reverse;
    position: absolute;
    width: 100dvw;
    height: 70vh;
    background-color: #f4f4f8;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    /* padding-bottom: 6px;  */
  }

  .userMessage {
    margin: 5px;
    padding: 5px;
    border-radius: 5px;
    user-select: text;
    -webkit-user-select: text; /* для совместимости с Safari */
    -moz-user-select: text; /* для совместимости с Firefox */
    -ms-user-select: text; /* для совместимости с IE10+ */
  }

  .userMessage.question {
    width: 88%;
    background-color: #cce5ff;
    float: left;
  }

  .userMessage.answer {
    width: 88%;
    background-color: #e0e0e0;
    /* margin-left: 60px; */
    float: right;
  }

  .input-container {
    display: flex;
    position: fixed;
    flex-direction: row;
    justify-content: space-between;
    bottom: 60px;
    padding: 0 10px; /* Добавляем отступы */
    width: 95vw;
  }

  .speaker-button {
    position: relative;
    top: 5px;
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
