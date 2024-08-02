<script>
// @ts-nocheck

  import { onMount, onDestroy, getContext } from 'svelte';
  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar';

  import { llang } from '$lib/js/stores.js';
  // import words from './80.json';
  import { Translate } from '../../../translate/Transloc';
  // translate.engine = 'google';
  // translate.from = $llang;

  import { langs } from '$lib/js/stores.js';

  import CircularProgress from '@smui/circular-progress';

  import { Speak } from '/src/routes/speech/tts/VoiceRSS';

  import TTS from '../../../speech/tts/Tts.svelte';
  let tts;

  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from '@smui/icon-button';
  import {
    mdiPagePreviousOutline,
    mdiChevronDownCircleOutline,
    mdiHelp,
    mdiVolumeHigh,
  } from '@mdi/js';

  import { dicts } from '$lib/js/stores.js';

  let dict = $dicts;

  import { lesson } from '$lib/js/stores.js';

  export let data;

  const abonent = getContext('abonent');

  let words = [],
    word,
    example;
  let shuffleWords;
  let hints;
  let currentWordIndex = 0;
  let currentWord;
  let hl_words = data.highlight ? data.highlight.split(',') : [];

  let arrayOfArrays;
  let userContent = '';
  let div_input;
  let result = '';
  let resultElement;
  let hintIndex = 0;
  let errorIndex = 0;
  let showCheckMark = false;
  let showNextButton = false;
  let resultElementWidth = 100;
  let showSpeakerButton = false;
  let focus_pos = 0;

  // defineWordsArray();

  let counter = 0;
  let isVisible = false;

  let names = data.name.split(',');

  for (let n in names) {
    // Создаем массив промисов для каждого запроса
    const fetchPromises = names.map((name) => {
      return fetch(
        `./lesson?words=theme&theme=${data.theme}&name=${name}&owner=${abonent}&level=${data.level}`
      )
        .then((response) => response.json())
        .then((data) => data.data)
        .catch((error) => {
          console.log(error);
          return [];
        });
    });
    // Ждем завершения всех запросов
    Promise.all(fetchPromises)
      .then((allData) => {
        // allData - это массив результатов каждого запроса
        words = [].concat(...allData); // Объединяем массивы в один
        // console.log(words);
        hints = [...words];
        shuffle(hints);
        currentWord = words[currentWordIndex];
        makeExample();
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

  $: if($langs){
    makeExample()
  }

  function highlightWords() {
    const woord = hl_words[hl_words.length - 1]?.trim();
    const regex = new RegExp(
      `\\b[${woord.charAt(0).toUpperCase()}${woord.charAt(0).toLowerCase()}]${woord.slice(1)}\\b`,
      'g'
    );

    userContent = userContent.replace(/[.\/#!?$%\^&\*;:{}=_`~()]/g, '').trim();

    userContent = userContent.replace(
      regex,
      `<span class="highlight" style="color: green;background-color: transparent">${woord}</span>`
    );

    // Object.keys(words).forEach((i) => {
    //   const woord = words[i].original;
    //   const regex = new RegExp(
    //     `\\b[${woord.charAt(0).toUpperCase()}${woord.charAt(0).toLowerCase()}]${woord.slice(1)}\\b`,
    //     'g'
    //   );

    //   userContent = userContent.replace(
    //     regex,
    //     `<span class="highlight" style="color: green;background-color: transparent">${woord}</span>`
    //   );
    // });
  }

  let topAppBar;
  let sentence_span;

  $: if (div_input) div_input.focus();

  function replaceWordWithInput(sentence, word) {
    // Вычисляем количество совпадающих символов
    const lastDotIndex = sentence?.lastIndexOf('.');
    // if (lastDotIndex !== -1) {
    //   sentence =
    //     sentence.slice(0, lastDotIndex) + sentence.slice(lastDotIndex + 1);
    // }

    word = word.replace(/[.\/#!?$%\^&\*;:{}=_`~()]/g, '').trim();
    // word = word.replace(/\b(the |a |an |het |de )\b/gi, '');
    // const wordLength = word.length;
    // const matches = sentence.split(word).length - 1;

    // const matchPercentage = (matches / wordLength) * 100;

    // Если процент совпадения больше или равен 90%, заменяем слово на <input>
    if (true) {
      //matches >= 1) {
      const regex = new RegExp('(^|\\s)' + word + '(?=[\\s.,!?]|$)', 'i');
      return sentence?.replace(
        regex,
        `$1<span class="sentence_span" style="position: relative; width: 120px; left: 0px;"></span> `
      );
    } else {
      return sentence;
    }
  }

  async function makeExample(){

      if(currentWord?.example[$langs]) {
        example = currentWord['example'][$langs];
      } else if(currentWord?.example[$llang]){
        example = await Translate(
          currentWord['example'][$llang],
          $llang,
          $langs
        );
      }

      example = example?.replace(
        /<<([^<>]+)>>/gu,
        '<span style="color:green"><b>$1</b></span>'
      );

      resultElement = replaceWordWithInput(
        currentWord?.example[$llang],
        `<<${currentWord?.original}>>`
      );

      setTimeout(() => {
        const spanElement = document.querySelector('.sentence_span');
        if (spanElement) spanElement.appendChild(div_input);
        resultElementWidth = getTextWidth(currentWord?.original, '20px Arial');
      }, 0);

      // word = currentWord['original'].replace(/(de|het)\s*/gi, '');
      // let filteredExample = currentWord['example'].replace(
      //    new RegExp(`\\b(de |het )?(?=\\b${word}\\b)`, 'gi'), '');
      // resultElement = filteredExample.split(new RegExp(word, 'i'));
      // console.log(resultElement)

    // Устанавливаем фокус в конец строки
    setFocus();
  }

  function getTextWidth(text, font) {
    // Создаем элемент canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Устанавливаем шрифт
    context.font = font;

    // Измеряем длину текста
    const metrics = context.measureText(text);
    return metrics.width + 10;
  }

  onMount(async () => {});

  onDestroy(() => {
    // Очищаем интервал при размонтировании компонента

    console.log('Компонент размонтирован');
  });

  function handleBackClick() {
    $lesson.data = { quiz: '' }; // При клике на "Back" показываем компонент Lesson
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function onShuffleWords(ev) {
    shuffle(words);
    currentWordIndex = 0;
    currentWord = words[currentWordIndex];
    makeExample()
  }

  function jumpNext10() {
    const nextIndex = (parseInt(currentWordIndex / 10) + 1) * 10;
    currentWordIndex = nextIndex;
    currentWord = words[currentWordIndex];
    makeExample()
    userContent = '';
    hintIndex = 0;
    result = '';
    showCheckMark = false;
    showSpeakerButton = false;
  }

  function defineWordsArray() {
    const originalArray = words;

    // Определение длины массива
    const arrayLength = originalArray.length;

    // Определение количества подмассивов
    const chunkSize = 10;
    const numberOfChunks = Math.ceil(arrayLength / chunkSize);

    // Разбиваем массив на подмассивы по 10 элементов
    arrayOfArrays = [];

    for (let i = 0; i < numberOfChunks; i++) {
      const start = i * chunkSize;
      const end = (i + 1) * chunkSize;
      const chunk = originalArray.slice(start, end);
      arrayOfArrays.push(chunk);
    }

    // console.log(arrayOfArrays);
  }

  function setFocus() {
    setTimeout(() => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(div_input);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  }

  function checkInput() {
    if (errorIndex > 0) {
      errorIndex = 0;
      userContent = '';
    }

    const targetWord = words[currentWordIndex].original
      .replace(/[.\/#!?$%\^&\*;:{}=_`~()]/g, '')
      .trim();
    userContent = userContent
      .replace(/&nbsp;/g, '')
      .replace(/<\/?![^>]+(>|$)/g, '');
    const trimmedUserContent = userContent.trim();
    focus_pos = 0;

    if (trimmedUserContent.toLowerCase() === targetWord.toLowerCase()) {
      showCheckMark = true; // Показываем галочку
      showNextButton = true;
      speak(currentWord.example[$llang]);

      if (hintIndex != 0 || errorIndex != 0) {
        // Перемещаем текущее слово в конец своей "десятки" в words
        words.splice(currentWordIndex, 1);
        words.splice(parseInt(currentWordIndex / 10) * 10 + 9, 0, currentWord);
        // Создаем клон текущего слова
        const currentWordClone = { ...currentWord };
        // Проверяем, достаточно ли элементов в массиве words для добавления в следующую "двадцатку"
        if (currentWordIndex + 20 < words.length) {
          // Вычисляем индекс конечного элемента в следующей "двадцатке"
          const nextTwentyIndex = currentWordIndex + 20;
          // Вставляем клон currentWord в конец следующей "двадцатки"
          words.splice(nextTwentyIndex, 0, currentWordClone);
        } else {
          // Если условие не выполняется, вставляем клон currentWord в конец массива words
          words.push(currentWordClone);
        }

        words = words;
        currentWordIndex = currentWordIndex - 1;
        errorIndex = 0;
      }

      userContent = currentWord.original.replace(
        /[.\/#!$%\^&\*;:{}=_`~()]/g,
        ''
      );
      highlightWords(userContent);
      // nextWord();
    } else {
      showCheckMark = false;
      result = '';
      let i = 0;

      while (i < targetWord.length || i < trimmedUserContent.length) {
        if (!trimmedUserContent[i]) {
          // Недостающие символы выделяются пустым span с красной окантовкой
          // result += `<span class="empty_block" onchage="onChangeUserContent" style="display: inline-block; background-color:rgba(255, 240, 251, 0.9);border:1px solid rgba(255, 240, 251, 0.9); width:15px">&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
        } else if (trimmedUserContent[i] === targetWord[i]) {
          // Совпадающие символы
          result += `<span class="correct">${targetWord[i]}</span>`;
          focus_pos = i + 1;
        } else {
          console.log();
          // Несовпадающие символы
          result += `<span style="color:red;">${trimmedUserContent[i]}</span>`;
          // resultElementWidth = getTextWidth(
          //   trimmedUserContent,
          //   '20px Arial'
          // );
          errorIndex++;
        }

        i++;
      }

      userContent = result;
      // Устанавливаем фокус в конец строки в div_input
      setFocus();
    }
  }

  function onChangeUserContent(ev) {
    let ar = document.getElementsByClassName('empty_block');
    if (ar.length > 0) {
      // console.log(ar.length);
      ar[0].remove();
    }
  }

  function showHint() {
    // wordsString = shuffleWords(wordsString);
    currentWord.original = currentWord.original.replace(
      /[.,\/#!?$%\^&\*;:{}=_`~()]/g,
      ''
    );
    if (hintIndex < currentWord?.original.length) {
      if (hintIndex === 0) {
        userContent = '';
      }
      userContent += currentWord.original[hintIndex];
      hintIndex++;

      result = ''; // Очистим результат при каждой новой подсказке
      showSpeakerButton = true; // Устанавливаем видимость кнопки
      setFocus();
    }
  }

  function nextWord() {
    currentWordIndex = currentWordIndex + 1;
    if (currentWordIndex >= words.length) currentWordIndex = 0;
    currentWord = words[currentWordIndex];
    makeExample();

    userContent = '';
    hintIndex = 0;
    result = '';
    showCheckMark = false;
    showNextButton = false;
    showSpeakerButton = false;
  }

  function onPrev() {
    if (currentWordIndex <= 0) return;
    currentWord = words[--currentWordIndex];
    result = '';
    userContent = '';
  }

  function onSpeach() {
    speak(!showNextButton?currentWord.original:currentWord.example[$llang]);
    hintIndex++;
  }

  function speak(text) {
    text = text.replace(/<<|>>/g, "")
    Speak(text);
    // tts.Speak(text);

    setFocus();
  }

  function OnClickHint(word) {
    word = word.replace(/[.\/#!?$%\^&\*;:{}=_`~()]/g, '');
    resultElementWidth = getTextWidth(word, '20px Arial');
    userContent = word;
    hl_words.push(word);
    errorIndex = 0;
  }
</script>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>

<TTS bind:this={tts}></TTS>

{#if !words[0]}
  <div style="text-align:center">
    <span
      class="material-symbols-outlined"
      style="font-size: 20px; color: blue; scale:1.5;"
    >
      <CircularProgress style="height: 50px; width: 50px;" indeterminate />
    </span>
  </div>
{/if}

{#if words}
  <main>
    <div class="top-app-bar-container flexor">
      <TopAppBar bind:this={topAppBar} variant="fixed">
        <Row>
          <Section>
            <button class="hint-button" on:click={showHint}>
              <span class="material-symbols-outlined"> ? </span>
              <!-- <IconButton class="material-icons" on:click={showHint}>
					<Icon tag="svg" viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiHelp} />
					</Icon>
				</IconButton> -->
            </button></Section
          >
          <Section
            ><button on:click={onPrev} class="prev-button">-1</button></Section
          >
          <Section>
            <button on:click={onShuffleWords} class="shuffle-button">
              <i
                class="material-symbols-outlined"
                style="font-size: 15px;  scale:1.5">shuffle</i
              >
            </button></Section
          >
          <Section><div>{currentWordIndex + 1}/{words.length}</div></Section>

          <Section align="end">
            {#if showNextButton}
              <button on:click={nextWord} class="next-button"
                >{dict['Дальше'][$langs]}</button
              >
            {:else}
              <button on:click={checkInput} class="check-button"
                >{dict['Проверить'][$langs]}</button
              >
            {/if}</Section
          >
        </Row>
      </TopAppBar>
    </div>

    {#await Translate('Write translation', 'en', $langs) then data}
      <div class="title">{data}:</div>
    {/await}

    <div class="word">
      {#await Translate(example, 'en', $langs) then data}
        {@html data}
      {/await}
    </div>

    <div class="input-container">
      {#if resultElement}
        {@html resultElement}
      {/if}
      <div
        class="input"
        contenteditable="true"
        on:input={onChangeUserContent}
        bind:this={div_input}
        bind:innerHTML={userContent}
        style="width: {resultElementWidth}px"
      >
        {@html result}
      </div>
    </div>

    {#if true || showSpeakerButton}
      <div class="speaker-button">
        <IconButton on:click={onSpeach}>
          <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiVolumeHigh} />
          </Icon>
        </IconButton>
      </div>
      <!-- <button on:click={onSpeach} class="speaker-button">
					<span class="material-symbols-outlined" style="font-size: 15px; color: blue; scale:1.5">
						volume_up
					</span>
				</button> -->
    {/if}

    <!-- <br /> -->
    <!-- {#if hintIndex != 0} -->
    <div class="words_div accordion-container">
      {#if hints?.length > 0}
        <Content
          style="line-height: 2.0; overflow-y:auto; height:50vh !important"
        >
          {#each hints as hint, i}
            <span
              class="hint_button"
              on:click={() => {
                OnClickHint(hint.original);
              }}
            >
              {@html hint?.original + '&nbsp;' + '&nbsp;'}
            </span>
          {/each}
          <div style="height:50px"></div>
        </Content>
      {/if}
    </div>
  </main>
{/if}

<style>
  main {
    display: inline-grid;
    /* background-color: #fff; */
    transition: transform 0.3s ease-in-out;
    /* width: 98%; */
    margin: 0 auto;
    position: relative;
    /* transform-style: preserve-3d; */
    transition: transform 0.5s;
    height: 80vh;
    margin-top: 30px;
  }

  .flexor {
    position: relative;
    /* top: 30px; */
  }
  .title {
    color: grey;
    position: relative;
    text-align: center;
    margin-top: 60px;
  }

  .hint_button {
    display: inline-block;
    border: solid 0.1em #9f3f3f;
    border-radius: 5px;
    text-align: center;
    width: auto;
    padding-left: 8px;
    margin: 5px;
    background-color: transparent;
  }

  /* Стилизуйте компонент по вашему усмотрению */
  .word {
    font-size:larger;
    flex-direction: column;
    align-items: center;
    margin: 2px;
    text-align: center;
  }

  .example {
    color: #2196f3;
  }

  h1 {
    margin-bottom: 20px;
  }

  .hidden {
    opacity: 0;
    pointer-events: none;
  }

  p {
    position: relative;
    transition: opacity 0.5s ease;
    text-align: center;
    font-size: xx-large;
    margin: 0;
  }

  .speaker-button {
    position: relative;
    /* flex: auto; */
    top: 0px;
    right: 10px;
    transform: translate(50%, 0%);
    font-size: large;
    z-index: 1;
  }

  .input-container {
    display: inline-block;
    font-size: larger;
    position: relative;
    color: #2196f3;
    width: 95vw;
    margin: 0 auto;
    text-align: center;
  }

  .words_div {
    position: relative;
    text-align: center;
    overflow-y: auto;
  }

  .input {
    height: 23px;
    display: inline-table;
    outline: none;
    border: none;
    background: rgba(0, 0, 0, 0.12);
    text-align: center;
  }

  .input:focus {
    outline: none;
  }

  .next10-button,
  .shuffle-button,
  .prev-button,
  .check-button,
  .next-button {
    /* margin-top: 10px; */
    padding: 8px 10px;
    font-size: 16px;
    font-weight: 500;
    border-color: #2196f3;
    border-radius: 5px;
    cursor: pointer;
    color: #2196f3;
  }

  .material-symbols-outlined {
    font-size: 15px;
    scale: 1.5;
    font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 24;
  }

  .hint-button {
    color: white;
    background-color: #2196f3;
    border-radius: 3px;
    padding: 8px 20px;
  }
</style>
