<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import Speak from './Speak.svelte';
  //  import { Speak } from '/src/routes/speech/tts/VoiceRSS';
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

  import { NumberString } from './Listen.numbers';

  import TTS from '../../../speech/tts/Tts.svelte';
  let tts;

  import { lesson , dc, dc_state ,langs, llang , dicts } from '$lib/js/stores.js';

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

  $: if ($dc_state) {
    switch ($dc_state) {
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

  $: if ($dc_state) {
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

  onMount(async () => {});

  async function SendToPartner() {
    if (share_mode && $dc) {
      await $dc.SendData(
        {
          lesson: { quiz: 'dialog.client' },
        },
        () => {
          console.log();
        }
      );
    }
  }

  // Пример использования
  // console.log(numberToEnglishString(42)); // Вывод: "forty-two"

  function convertToWords(num) {
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    const ten = Math.floor(num / 10);
    const rest = num % 10;
    return rest === 0 ? tens[ten] : ones[rest] + 'en' + tens[ten];
  }

  function convertGroup(num, unit) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    let result = '';

    if (hundred > 0) {
      result += ones[hundred] + 'honderd';
      if (rest > 0) result += 'en';
    }

    if (rest > 0) {
      result += convertToWords(rest);
    }

    if (unit) {
      result += unit;
    }

    return result;

    if (number === 0) return 'nul';

    let unitIndex = 0;

    while (number > 0) {
      const group = number % 1000;
      if (group > 0) {
        const groupResult = convertGroup(
          group,
          unitIndex === 1 ? 'duizend' : ''
        );
        result = groupResult + (result ? 'en' : '') + result;
      }
      number = Math.floor(number / 1000);
      unitIndex++;
    }

    return result.trim();
  }

  function Generate() {
    if (name === 'Tijd') {
      generateTime();
    } else if (name === 'Nummers') {
      generateNumber();
    } else if (name === 'Alphabet') {
      generateAlphabet();
    }
  }

  function generateAlphabet() {
    throw new Error('Function not implemented.');
  }

  function generateNumber() {
    buttonName = 'Повторить';
    isFirst = true;

    if (cnt % 10 === 0) {
      digit *= 10;
    }
    // Генерация случайного числа (вы можете использовать свой способ генерации)
    const random = Math.floor(Math.random() * digit) + digit / 10;
    if (random === generatedValue) return generateNumber();
    generatedValue = random;
    cnt++;
    // Очистка предыдущего ответа и статуса
    result = '';
    isCorrect = null;
    // Озвучивание сгенерированного числа
    speak(NumberString($llang, generatedValue));

    div_input.focus();
  }

  function generateTime() {
    isFirst = true;
    let hours = Math.floor(Math.random() * 24) + 1;
    if (hours >= 13) hours = parseInt(hours - 12);
    const minutes = Math.floor(Math.random() * 12) * 5; // генерация с шагом 15 минут

    generatedValue = DateTime.local()
      .set({ hours, minutes })
      .toLocaleString(DateTime.TIME_24_SIMPLE);
    generatedValueObj = { hours, minutes }; //
    // generatedValue = generatedValue.toLocaleString(DateTime.TIME_24_SIMPLE);
    // generatedValue = generatedValue.format('hh:mm');
    speak(formatTime($llang, generatedValueObj));
    div_input.focus();
    cnt++;
  }

  function formatTime(lang, time) {
    const hours = time.hours;
    const minutes = time.minutes;

    switch (lang) {
      case 'nl':
        if (minutes === 0) {
          return `${hours} uur`;
        } else if (minutes < 15) {
          return `${minutes} over ${hours}`;
        } else if (minutes === 15) {
          return `kwart over ${hours}`;
        } else if (minutes > 15 && minutes < 30) {
          return `${30 - minutes} voor half ${hours + 1}`;
        } else if (minutes === 30) {
          return `half ${hours === 1 ? 'twee' : hours + 1}`;
        } else if (minutes > 30 && minutes < 45) {
          return `${minutes - 30} over half ${hours + 1}`;
        } else if (minutes === 45) {
          return `kwart voor ${hours === 1 ? 'tien' : hours + 1}`;
        } else if (minutes > 45) {
          return `${60 - minutes} voor  ${hours + 1}`;
        } else {
          return `${minutes} minuten over ${hours}`;
        }
        break;

      case 'en':
        if (minutes === 0) {
          return `${hours} o'clock`;
        } else if (minutes < 15) {
          return `${minutes} past ${hours}`;
        } else if (minutes === 15) {
          return `quarter past ${hours}`;
        } else if (minutes < 30) {
          return `${30 - minutes} minutes past ${hours}`;
        } else if (minutes === 30) {
          return `half past ${hours}`;
        } else if (minutes < 45) {
          return `${minutes - 30} minutes to ${hours + 1}`;
        } else if (minutes === 45) {
          return `quarter to ${hours + 1}`;
        } else {
          return `${60 - minutes} minutes to ${hours + 1}`;
        }
        break;

      case 'fr':
        if (minutes === 0) {
          return `${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes < 15) {
          return `${minutes} minute${minutes > 1 ? 's' : ''} après ${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes === 15) {
          return `quart après ${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes < 30) {
          return `${30 - minutes} minute${30 - minutes > 1 ? 's' : ''} avant la demi de ${hours + 1} heure`;
        } else if (minutes === 30) {
          return `demie après ${hours} heure`;
        } else if (minutes < 45) {
          return `${minutes - 30} minute${minutes - 30 > 1 ? 's' : ''} après la demi de ${hours + 1} heure`;
        } else if (minutes === 45) {
          return `quart avant ${hours + 1} heure`;
        } else {
          return `${60 - minutes} minute${60 - minutes > 1 ? 's' : ''} avant ${hours + 1} heure`;
        }
        break;

      case 'de':
        if (minutes === 0) {
          return `${hours} Uhr`;
        } else if (minutes < 15) {
          return `${minutes} nach ${hours}`;
        } else if (minutes === 15) {
          return `Viertel nach ${hours}`;
        } else if (minutes > 15 && minutes < 30) {
          return `${30 - minutes} vor halb ${hours + 1}`;
        } else if (minutes === 30) {
          return `halb ${hours + 1}`;
        } else if (minutes > 30 && minutes < 45) {
          return `${minutes - 30} nach halb ${hours + 1}`;
        } else if (minutes === 45) {
          return `Viertel vor ${hours + 1}`;
        } else if (minutes > 45) {
          return `${60 - minutes} vor ${hours + 1}`;
        } else {
          return `${minutes} Minuten nach ${hours}`;
        }

      case 'es':
        if (minutes === 0) {
          return `${hours === 1 ? 'La una' : hours} en punto`;
        } else if (minutes === 15) {
          return `Son las ${hours} y cuarto`;
        } else if (minutes === 30) {
          return `Son las ${hours} y media`;
        } else if (minutes === 45) {
          return `Son las ${hours + 1} menos cuarto`;
        } else if (minutes < 30) {
          return `Son las ${hours} y ${minutes} minutos`;
        } else {
          return `Son las ${hours + 1} menos ${60 - minutes} minutos`;
        }
        break;

      case 'it':
        if (minutes === 0) {
          return `${hours} ${hours === 1 ? 'ora' : 'ore'}`;
        } else if (minutes < 15) {
          return `${minutes} minuti dopo l'ora ${hours}`;
        } else if (minutes === 15) {
          return `un quarto dopo l'ora ${hours}`;
        } else if (minutes < 30) {
          return `${30 - minutes} minuti prima della mezz'ora ${hours + 1}`;
        } else if (minutes === 30) {
          return `mezz'ora ${hours + 1}`;
        } else if (minutes < 45) {
          return `${minutes - 30} minuti dopo la mezz'ora ${hours + 1}`;
        } else if (minutes === 45) {
          return `un quarto prima dell'ora ${hours + 1}`;
        } else {
          return `${60 - minutes} minuti prima dell'ora ${hours + 1}`;
        }
        break;
    }
  }

  function checkInput() {
    userContent = userContent
      .replace(/&nbsp;/g, '')
      .replace(/<\/?[^>]+(>|$)/g, '');
    const trimmedUserContent = userContent.trim();
    isCorrect = trimmedUserContent === generatedValue.toString();

    if (isCorrect) {
      inputStyle = isCorrect ? 'color: green;' : 'color: red; ';
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

      while (i < generatedValue.length || i < trimmedUserContent.length) {
        if (!trimmedUserContent[i]) {
          // Недостающие символы выделяются пустым span с красной окантовкой
          result += `<span class="empty_block" onchage="onChangeUserContent" style="display: inline-block; background-color:rgba(255, 240, 251, 0.9);border:1px solid rgba(255, 240, 251, 0.9); width:15px">&nbsp;</span>`;
        } else if (trimmedUserContent[i] === generatedValue[i]) {
          // Совпадающие символы
          result += `<span class="correct">${generatedValue[i]}</span>`;
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
    tts.Speak_server($llang, text);
  }

  function repeat() {
    // Реализуйте функцию озвучивания числа, используя доступные средства или библиотеки
    // Например, можно использовать Text-to-Speech API или библиотеку для озвучивания

    speak(formatTime($llang, generatedValueObj));

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

      $dc?.SendData({ lesson: data }, () => {
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
    userContent = generatedValue.toString();

    setTimeout(() => {
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
    // voice = '';
  });
</script>

<!-- <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/> -->

<TTS bind:this={tts}></TTS>
<!-- <RV bind:this={voice}></RV> -->

{#if share_button}
  <IconButton class="material-icons" on:click={onShare} style={style_button}>
    <Icon tag="svg" viewBox="0 0 24 24">
      <path fill="currentColor" d={mdiShareVariant} /></Icon
    >
  </IconButton>
{/if}
<main>
  {#if data.quiz == 'listen'}
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
      {#if name === 'Nummers'}
        <div
          class="input"
          contenteditable="true"
          style={inputStyle}
          bind:this={div_input}
          bind:innerHTML={userContent}
        >
          {@html result}
        </div>
      {:else if name === 'Tijd'}
        <div
          contenteditable="true"
          id="userTime"
          class="input"
          placeholder="hh:mm"
          on:input={handleUserInput}
          bind:this={div_input}
          bind:innerHTML={userContent}
        />
      {:else if name === 'Alphabet'}
        <div
          contenteditable="true"
          id="userTime"
          class="input"
          on:input={handleUserInput}
          bind:this={div_input}
          bind:innerHTML={userContent}
        />
      {/if}
      {#if isFirst}
        <button on:click={showHint} class="hint-button">
          <span class="material-symbols-outlined"> question_mark </span>
        </button>
      {/if}

      <!-- <input type="text" id="userAnswer" bind:value={userAnswer} style={inputStyle} /> -->
    </div>
  {:else if data.quiz == 'dialog.client'}
    <Speak {data} />
  {/if}
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
    width: 120px;
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
