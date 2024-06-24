<script lang="ts">
  import { onMount, onDestroy, getContext } from 'svelte';

  // import Speak from './Speak.svelte';
  import moment from 'moment';
  moment.locale('nl-be');
  import { DateTime } from 'luxon';
  // import 'moment/locale/nl';
  import IconButton, { Icon } from '@smui/icon-button';
  import {
    mdiPagePreviousOutline,
    mdiArrowRight,
    mdiArrowLeft,
    mdiShareVariant,
    mdiShuffle,
  } from '@mdi/js';

  import TTS from '../../../speech/tts/Tts.svelte';
  let tts;

  // import RV from '/src/routes/speech/tts/RV.svelte';
  // let rv;

  //  import { Speak } from '/src/routes/speech/tts/VoiceRSS';

  import { lesson } from '$lib/js/stores.js';
  import { dc_user } from '$lib/js/stores.js';
  import { dc_oper } from '$lib/js/stores.js';
  import { dc_oper_state } from '$lib/js/stores.js';
  import { dc_user_state } from '$lib/js/stores.js';
  import { langs, llang } from '$lib/js/stores.js';

  import { dicts } from '$lib/js/stores.js';

  const operator = getContext('operator');

  let dict = $dicts;

  let share_mode = false;
  let share_button = false;

  let style_button_non_shared = `position: relative;
		padding: 10px;
		font-size: 1.5em;
		background-color: white;
		color: grey;
		border: none;
		border-radius: 5px;
		cursor: pointer;`;
  let style_button_shared = `position: relative;
		padding: 10px;
		font-size: 1.5em;
		background-color: #2196f3;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;`;

  let style_button = style_button_non_shared;

  export let data;

  $: if (data) {
    if (data.html) {
      style_button = style_button_shared;
      share_mode = true;
    }
  }

  if (data.func) {
    onChangeClick();
  }

  $: if ($dc_oper_state) {
    switch ($dc_oper_state) {
      case 'open':
        share_button = true;
        break;
      case 'closed':
        share_button = false;
        share_mode = false;
        style_button = style_button_non_shared;
        break;
    }
  }

  $: if ($dc_user_state) {
    share_button = true;
  }

  let name = data.name;
  let generatedValue, generatedValueObj;
  let userTime = '';
  let userContent;
  let buttonName = 'Старт';
  let isFirst = false;
  let inputStyle;
  let result = '';
  let isCorrect = null;
  let bottomAppBar;
  let change_button = false;
  let cur_html = 0;
  let q, a;
  let cnt = 0;
  let digit = 10;
  let div_input;
  let listen_data;
  let currentWord,
    currentWordIndex = 0;

  onMount(async () => {});

  $: if (listen_data) currentWord = listen_data[currentWordIndex];

  fetch(`./lesson?listen=${data.name}&owner=${operator.abonent}&lang=${$llang}`)
    .then((response) => response.json())
    .then((res) => {
      listen_data = res.data.data;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });

  async function SendToPartner() {
    if (share_mode && ($dc_user || $dc_oper)) {
      let dc = $dc_user || $dc_oper;
      await dc.SendData(
        {
          lesson: { quiz: 'dialog.client' },
        },
        () => {
          console.log();
        }
      );
    }
  }

  function Generate() {
    buttonName = 'Повторить';
    isFirst = true;
    result = '';
    isCorrect = null;
    div_input.focus();
    speak(currentWord.original);
  }

  function checkInput() {
    userContent = userContent
      .replace(/&nbsp;/g, '')
      .replace(/<\/?[^>]+(>|$)/g, '');
    const trimmedUserContent = userContent.trim();
    isCorrect =
      trimmedUserContent.toLowerCase() === currentWord.example.toLowerCase();

    if (isCorrect) {
      inputStyle = isCorrect ? 'color: green;' : 'color: red; ';
      // if (listen_data[currentWordIndex + 1]) currentWordIndex++;
      // else currentWordIndex = 0;
      setTimeout(() => {
        userContent = '';
        Generate();
      }, 1000);

      // nextWord();
    } else {
      let i = 0;
      inputStyle = '';
      userContent = '';
      result = '';

      while (i < currentWord.example.length || i < trimmedUserContent.length) {
        if (!trimmedUserContent[i]) {
          // Недостающие символы выделяются пустым span с красной окантовкой
          result += `<span class="empty_block" onchage="onChangeUserContent" style="display: inline-block; background-color:rgba(255, 240, 251, 0.9);border:1px solid rgba(255, 240, 251, 0.9); width:15px">&nbsp;</span>`;
        } else if (trimmedUserContent[i] === currentWord.example[i]) {
          // Совпадающие символы
          result += `<span class="correct">${currentWord.example[i]}</span>`;
        } else {
          // Несовпадающие символы
          result += `<span style="color:red;  ">${trimmedUserContent[i]}</span>`;
        }

        i++;
      }

      userContent = result;
      // Устанавливаем фокус в конец строки в div_input
      div_input.focus();

      repeat();
    }
  }

  function checkAnswer() {
    // Проверка правильности ответа
    const parsedAnswer = parseInt(userAnswer, 10);
    isCorrect = !isNaN(parsedAnswer) && parsedAnswer === generatedValue;

    // Определение стиля для input в зависимости от правильности ответа
    inputStyle = isCorrect ? 'color: green;' : 'color: red; ';

    setTimeout(() => {
      generateNumber();
    }, 1500);
  }

  async function speak(text) {
    tts.Speak(text);
  }

  function repeat() {
    // Реализуйте функцию озвучивания числа, используя доступные средства или библиотеки
    // Например, можно использовать Text-to-Speech API или библиотеку для озвучивания

    speak(currentWord.original);

    div_input.focus();
  }

  function handleBackClick() {
    $lesson.data = { quiz: '' };
    // $lesson.visible = true;
  }

  function onChangeClick() {
    data = { question: q, answer: a, quiz: data.quiz };
    if (data.html) data.html = data.html[cur_html];
    data.quiz = data.quiz === 'dialog.client' ? 'dialog' : 'dialog.client';
    let client_quiz =
      data.quiz === 'dialog.client' ? 'dialog' : 'dialog.client';
    let dc = $dc_user || $dc_oper;
    if (dc)
      dc.SendData({ lesson: data }, () => {
        console.log();
      });
  }

  function handleUserInput(event) {
    const inputValue = event.target.innerHTML;

    // Проверяем, является ли введенное значение числом
    if (!isNaN(inputValue)) {
      // Добавляем разделитель ":" после двух символов
      if (inputValue.length === 2 && event.data !== ':') {
        event.target.innerHTML = inputValue + ':';
      }

      // Ограничиваем ввод дополнительными символами
      if (inputValue.length > 4) {
        event.target.innerHTML = inputValue.slice(0, 4);
      }

      userContent = event.target.innerHTML;

      // Устанавливаем фокус в конец строки
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(div_input);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  function showHint() {
    // wordsString = shuffleWords(wordsString);
    userContent = currentWord.example;

    setTimeout(() => {
      if (listen_data[currentWordIndex + 1]) currentWordIndex++;
      else currentWordIndex = 0;
      checkInput();
    }, 1000);

    // if (hintIndex < currentWord.original.length) {
    // 	if (hintIndex === 0) {
    // 		userContent = '';
    // 	}
    // 	userContent += currentWord.original[hintIndex];
    // 	hintIndex++;

    // 	result = ''; // Очистим результат при каждой новой подсказке
    // 	// setFocus();
    // }
  }

  function onShare() {
    // Обработчик нажатия на кнопку "share"
    share_mode = !share_mode;
    style_button = share_mode ? style_button_shared : style_button_non_shared;
  }

  onDestroy(() => {
    // easyspeech.Cancel();
    // rv = '';
  });
</script>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>

<TTS bind:this={tts}></TTS>
<!-- <RV bind:this={rv}></RV> -->

{#if share_button}
  <IconButton class="material-icons" on:click={onShare} style={style_button}>
    <Icon tag="svg" viewBox="0 0 24 24">
      <path fill="currentColor" d={mdiShareVariant} /></Icon
    >
  </IconButton>
{/if}
<main>
  <div>
    <p>{dict['Послушай и напиши'][$langs]}:</p>

    {#if !isFirst}
      <button on:click={Generate}>{dict['Старт'][$langs]}</button>
    {:else}
      <button on:click={repeat}>{dict['Повторить'][$langs]}</button>
      <button on:click={checkInput}>{dict['Проверить'][$langs]}</button>
    {/if}
  </div>

  <div>
    <!-- <label for="userAnswer">Your Answer:</label> -->

    <div
      contenteditable="true"
      class="input"
      style={inputStyle}
      on:input={handleUserInput}
      bind:this={div_input}
      bind:innerHTML={userContent}
    />

    {#if isFirst}
      <button on:click={showHint} class="hint-button">
        <span class="material-symbols-outlined"> question_mark </span>
      </button>
    {/if}

    <!-- <input type="text" id="userAnswer" bind:value={userAnswer} style={inputStyle} /> -->
  </div>
</main>

<style>
  main {
    text-align: center;
    margin-top: 40px;
  }
  .hint-button {
    display: inline-block;
    position: relative;
    top: 4px;
    height: 44px;
    color: white;
    background-color: #2196f3;
    border-radius: 3px;
  }

  button {
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
  }

  #userTime {
    width: 80px;
    font-size: x-large;
    text-align: center;
    border: 1px solid grey;
    background-color: rgb(220, 228, 228);
  }

  .input {
    display: inline-block;
    padding: 8px;
    width: 50vw;
    font-size: 24px;
    margin-top: 10px; /* Добавим отступ сверху для выравнивания */
    margin-left: auto;
    margin-right: auto;
  }

  label {
    display: block;
    font-size: 18px;
    margin-top: 10px; /* Добавим отступ сверху для выравнивания */
  }

  main > div {
    margin-bottom: 20px; /* Добавим отступ снизу для разделения блоков */
  }

  .share-button {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 10px;
    font-size: 1.5em;
    background-color: #2196f3;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
