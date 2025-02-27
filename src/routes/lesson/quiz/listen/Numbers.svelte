<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import Speak from './Speak.svelte';

  import {Translate} from "../../../translate/Transloc"

  import moment from 'moment';
  moment.locale('nl-be');
  // import 'moment/locale/nl';
  import IconButton, { Icon } from '@smui/icon-button';
  import {
    mdiPagePreviousOutline,
    mdiArrowRight,
    mdiArrowLeft,
    mdiShareVariant,
    mdiShuffle,
  } from '@mdi/js';

  import { NumberString, numberToDutchString } from './Listen.numbers';

  import TTS from '../../../speech/tts/Tts.svelte';
  let tts;

  import { dicts, lesson, dc_state, dc, langs, llang } from '$lib/stores.ts';

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
    if (share_mode && dc) {
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

  function Generate() {
    generateNumber();
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
    speak(numberToDutchString(generatedValue));

    div_input.focus();
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
    //Speak(text);
    tts.Speak_server($llang, text);
  }

  function repeat() {
    // Реализуйте функцию озвучивания числа, используя доступные средства или библиотеки
    // Например, можно использовать Text-to-Speech API или библиотеку для озвучивания

    speak(numberToDutchString(generatedValue));

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

    if ($dc)
      $dc.SendData({ lesson: data }, () => {
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
     <p>{#await Translate('Послушай и напиши','ru', $langs) then data} {data}: {/await}</p>
  
     <div class="button-group">
     {#if !isFirst}
      <button on:click={Generate} class="btn start-btn">{#await Translate('Старт','ru', $langs) then data} {data} {/await}</button>
     {:else}
      <button on:click={repeat} class="btn repeat-btn">{#await Translate('Повторить','ru', $langs) then data} {data} {/await}</button>
      <button on:click={checkInput} class="btn check-btn">{#await Translate('Проверить','ru', $langs) then data} {data} {/await}</button>
     {/if}
    </div>
  </div>
  
    <div class="input-group">
     {#if name === 'Nummers'}
      <div
       class="input-field"
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
       class="input-field"
       placeholder="hh:mm"
       on:input={handleUserInput}
       bind:this={div_input}
       bind:innerHTML={userContent}
      />
     {:else if name === 'Alphabet'}
      <div
       contenteditable="true"
       id="userTime"
       class="input-field"
       on:input={handleUserInput}
       bind:this={div_input}
       bind:innerHTML={userContent}
      />
     {/if}
     {#if isFirst}
      <button on:click={showHint} class="btn hint-btn">
       <span class="material-symbols-outlined"> ? </span>
      </button>
     {/if}
    </div>
   {:else if data.quiz == 'dialog.client'}
    <Speak {data} />
   {/if}
  </main>
  
  <style>
   /* Основной контейнер */
   main {
    text-align: center;
    margin: 40px auto;
    font-family: Arial, sans-serif;
    color: #333;
    width: 60%; /* Устанавливаем ширину 50% */
    box-sizing: border-box; /* Учитываем padding в общей ширине */
   }
  
   /* Блок с инструкциями */
   p {
    font-size: 18px;
    margin-bottom: 15px;
   }
  
   /* Кнопки */
   .btn {
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
   }

   .button-group {
    display: flex; /* Располагаем элементы в ряд */
    justify-content: center; /* Центрируем кнопки по горизонтали */
    gap: 10px; /* Добавляем расстояние между кнопками */
    margin-top: 20px; /* Отступ сверху */
  }

  .btn {
    flex: none; /* Убираем возможность растягиваться */
  }

  
   .btn:hover {
    background-color: #1e88e5;
    transform: scale(1.05);
   }
  
   .start-btn {
    background-color: #4caf50;
    color: white;
   }
  
   .repeat-btn {
    background-color: #ff9800;
    color: white;
   }
  
   .check-btn {
    background-color: #9c27b0;
    color: white;
   }
  
   .hint-btn {
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-weight: 700 26px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
   }
  
   .hint-btn:hover {
    transform: scale(1.1);
    background-color: #7b1fa2;
    
   }
  
   /* Группа поля ввода и кнопки */
   .input-group {
    display: flex;
    align-items: center; /* Центрирование по вертикали */
    justify-content: center; /* Центрирование группы по горизонтали */
    gap: 10px; /* Расстояние между input и кнопкой */
    margin-top: 20px;
   }
  
   /* Поле ввода */
   .input-field {
    flex: 1; /* Поле ввода занимает доступное пространство */
    width:90%;
    padding: 10px;
    font-size: 18px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   }
  
   .input-field:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 8px rgba(33, 150, 243, 0.5);
   }
  
   #userTime {
    width: 100px;
    font-size: x-large;
   }
  
   /* Адаптивность */
   @media (max-width: 768px) {
    .button-group {
      flex-direction: column; /* Выравниваем кнопки вертикально */
      gap: 15px; /* Увеличиваем расстояние между кнопками */
    }
  }

  </style>
  
  
 