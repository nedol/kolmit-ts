<script>
  import { langs } from '$lib/js/stores.js';
  import { llang } from '$lib/js/stores.js';
  import { Speak } from '/src/routes/speech/tts/VoiceRSS';
  import Tts from '/src/routes/speech/tts/Tts.svelte';
  import Stt from '/src/routes/speech/stt/Stt.svelte';
  let stt, tts;
  import { onMount, onDestroy, getContext } from 'svelte';
  import BottomAppBar, {
    Section,
    AutoAdjust,
  } from '@smui-extra/bottom-app-bar';
  import IconButton, { Icon } from '@smui/icon-button';
  import Button, { Label } from '@smui/button';
  import {
    mdiAccountConvertOutline,
    mdiPagePreviousOutline,
    mdiArrowRight,
    mdiArrowLeft,
    mdiShareVariant,
    mdiShuffle,
    mdiVolumeHigh,
    mdiPlay,
    mdiMicrophone,
    mdiMicrophoneOutline,
  } from '@mdi/js';

  import {
    lesson,
    dc_oper,
    dc_user,
    msg_user,
    msg_oper,
    call_but_status,
  } from '$lib/js/stores.js';

  let dc = $dc_oper || $dc_user;

  $: if ($dc_oper && $dc_oper.dc) {
    $dc_oper.dc.onmessage = (event) => {
      console.log(event.data);
    };
  }

  $: if ($dc_user && $dc_user.dc) {
    $dc_user.dc.onmessage = (event) => {
      console.log(event.data);
    };
  }

  import { dicts } from '$lib/js/stores.js';
  let dict = $dicts;

  import pkg from 'lodash';
  const { find, findKey, mapValues } = pkg;

  let display_audio = 'none';
  let isListening = false;
  let stt_text = '';

  let bottomAppBar;
  let visibility = ['visible', 'hidden', 'hidden'];
  let visibility_cnt = 1;
  let showSpeakerButton = false;

  let share_mode = false;

  let variant = 'outlined';

  export let data;

  // $: if($lesson.data) {
  // 	console.log($lesson);
  // 	data = $lesson.data;
  // }

  export let onChangeClick;
  // import pair_data from './pair_data.json';
  let hint_visible;

  let style_button = `
		z-index:2;
		font-size: 1.5em;
		left: 3px;
		color: grey;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		width: 50px`;

  $: if (data) {
    hint_visible = false;
  }

  let containerWidth, containerHeight;

  onMount(() => {
    // // Получаем ширину родительского окна при загрузке компонента
    // const parentWidth = window.innerWidth; // Может потребоваться window.innerWidth - некоторое смещение, если у вас есть другие элементы на странице
    // // Устанавливаем ширину контейнера равной ширине родительского окна
    // containerWidth = parentWidth + 'px';
    // // Получаем высоту родительского окна при загрузке компонента
    // const parentHeight = window.innerHeight; // Может потребоваться window.innerHeight - некоторое смещение, если у вас есть другие элементы на странице
    // // Устанавливаем высоту контейнера равной высоте родительского окна
    // containerHeight = parentHeight + 'px';
  });

  function handleBackClick() {
    lesson_display = true; // При клике на "Back" показываем компонент Lesson
  }

  function onClickQ(ev) {
    hint_visible = true;
    showSpeakerButton = true;
  }

  async function speak() {
    Speak(data.user2['a_shfl']);
  }

  function SttResult(text) {
    stt_text = text;
  }

  function StopListening() {
    isListening = false;
  }

  function onClickMicrophone() {
    if (isListening) {
      stt.MediaRecorderStop();
      isListening = false;
      return;
    }

    ////для тестов !!! УБРАть if!!!
    // if (false)
    stt.startAudioMonitoring();

    const text = data.user1[$llang].replace(/[^\w\s]/gi, ''); //.split(' ');

    isListening = true;
  }

  function SendRepeat() {
    variant = 'unelevated';
    setTimeout(() => {
      variant = 'outlined';
    }, 1000);

    if (dc)
      dc.SendData(
        {
          command: 'repeat',
        },
        () => {
          console.log();
        }
      );
  }

  onDestroy(() => {
    data = '';
  });
</script>

<!-- <EasySpeech bind:this={easyspeech}></EasySpeech> -->
<Tts bind:this={tts}></Tts>

<div class="container">
  <div style="position: absolute;right:0; font-size:small; z-index:2">
    <Button on:click={() => SendRepeat()} {variant}>
      <Label>{dict['Repeat'][$langs]}</Label>
    </Button>
  </div>

  <div class="card">
    <div class="title">{dict['Проконтролируй вопрос'][$langs]}:</div>

    <div class="user1">
      {#if data.user1}
        <div>{@html data.user1[$llang]}</div>
      {/if}
    </div>

    <div class="title">{dict['Переведи и ответь'][$langs]}:</div>

    <div class="user2">
      {#if data.user2}
        <div>{@html data.user2[$langs]}</div>
      {/if}
    </div>

    <div class="tip">
      {#if data.user2['a_shfl'] && hint_visible}
        <div>{@html data.user2['a_shfl']}</div>
      {/if}
    </div>

    <div style="text-align: center">
      <span style="color: darkgreen;">
        {@html stt_text}
      </span>
    </div>
    {#if showSpeakerButton}
      <div class="speaker-button">
        <IconButton on:click={speak}>
          <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiPlay} />
          </Icon>
        </IconButton>
      </div>
    {/if}

    <div class="margins" style="text-align: center;">
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

      <Stt bind:this={stt} {SttResult} {StopListening} bind:display_audio></Stt>
    </div>

    {#if data.html}
      <div class="html_data">{@html data.html}</div>
    {/if}

    <BottomAppBar bind:this={bottomAppBar}>
      <Section></Section>
      <Section></Section>
      <Section>
        <div style={style_button} on:click={onChangeClick}>
          <IconButton>
            <Icon tag="svg" viewBox="0 0 24 24">
              <path fill="currentColor" d={mdiAccountConvertOutline} />
            </Icon>
          </IconButton>
        </div>
      </Section>
      <Section>
        <div>
          <button on:click={onClickQ} class="toggleButton">
            <span class="material-symbols-outlined"> ? </span>
          </button>
        </div>
      </Section>

      <Section></Section>
    </BottomAppBar>
  </div>
</div>

<style>
  .container {
    /* top: -15vh; */
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    margin: 0;
    padding: 2px;

    /* border: 1px solid #ccc; */
    /* border-radius: 5px; */
  }

  .card {
    transition: transform 0.3s ease-in-out;
    width: 100%;
    /* border: grey solid 1px; */
    border-radius: 5px;
    margin: 0 auto;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s;
    height: calc(100vh - 24vh);
  }

  .title {
    color: grey;
    position: relative;
    text-align: center;
    margin: 5px;
    font-size: 0.8em;
  }

  .user1 {
    color: #2196f3;
    font-size: 1em;
    margin-bottom: 10px;
    text-align: center;
  }

  .user2 {
    color: #555;
    font-size: 1em;
    text-align: center;
    margin-bottom: 10px;
  }
  .tip {
    text-align: center;
    font-size: 1em;
    margin-bottom: 10px;
    margin-left: 20px;
    color: #2196f3;
  }

  .toggleButton {
    background-color: #2196f3;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    float: right;
  }

  .html_data {
    position: relative;
    overflow-y: auto;
    height: 44vh;
    margin-top: 20px;
  }

  .margins {
    display: flex;
    justify-content: space-between; /* Распределяет пространство между элементами равномерно */
    align-items: center; /* Центрирует элементы по вертикали */
    text-align: left; /* Сбрасываем выравнивание текста по умолчанию */
  }

  /* Если вы хотите добавить пространство между элементами, вы можете использовать margin */
  .margins > * {
    margin-right: 10px; /* Пример: 10px пространства между элементами */
  }

  .speaker-button {
    position: absolute;
    right: 0;
    /* transform: translate(0%, -10%); */
    font-size: large;
    border-radius: 25px;
    top: 116px;
  }
</style>
