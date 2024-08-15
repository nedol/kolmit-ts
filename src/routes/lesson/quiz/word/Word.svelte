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
  let userContent = [];
  let div_input = [];
  let result = '&nbsp;';
  let resultElement;
  let hintIndex = 0;
  let errorIndex = 0;
  let showCheckMark = false;
  let showNextButton = false;
  let resultElementWidth = [];
  let showSpeakerButton = false;
  let focus_pos = 0;

  // defineWordsArray();

  let counter = 0;
  let isVisible = false;

  let names = data.name.split(',');

  // Создаем массив промисов для каждого запроса

  fetch(
    `./lesson?words=theme&theme=${data.theme}&name=${data.name}&owner=${abonent}&level=${data.level}`
  )
    .then((response) => response.json())
    .then((data) => {
      words = data.data;
      if (!words[0]) return;

      hints = [...words];
      shuffle(hints);
      currentWord = words[currentWordIndex];
      makeExample();
    })
    .catch((error) => {
      console.log(error);
      return [];
    });

  $: if ($langs) {
    makeExample();
  }

  let topAppBar;
  let sentence_span;

  function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (
      (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
    );
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  function replaceWordWithInput(text, targetWord) {
    const threshold = 0.8; // 90% порог

    return text.replace(
      /<<([^>]*)>>/g,
      `<span  value="$1" class="sentence_span" style="position: relative;width:20px;  left: 0px;" onclick=OnClickInput></span>`
    );
  }

  async function makeExample() {
    if (!currentWord) return;

    if (currentWord.example[$langs]) {
      example = currentWord['example'][$langs];
    } else if (currentWord.example[$llang]) {
      example = await Translate(currentWord['example'][$llang], $llang, $langs);
    }

    if (example.includes('<<') && example.includes('>>')) {
      example = example?.replace(
        /<<([^<>]+)>>/gu,
        '<span style="color:green" onclick=OnClickInput><b>$1</b></span>'
      );
    } else if (example.includes('"')) {
      example = example?.replace(
        /"([^"]+)"/gu,
        '<span style="color:green" onclick=OnClickInput><b>$1</b></span>'
      );
    }

    const regex = /(<<\w+>>)\s+(<<\w+>>)/;
    const match = currentWord?.original.match(regex);
    let original = currentWord.original;
    if (match) {
      original = `${match[0]} ${match[1]}`;
    } else original = `${currentWord.original}`;

    resultElement = replaceWordWithInput(
      currentWord?.example[$llang],
      `${original}`
    );

    function extractWords(text) {
      // Регулярное выражение для поиска слов в угловых скобках
      const regex = /<<(.*?)>>/g;
      // Массив для хранения найденных слов
      let result = [];
      let match;

      // Поиск всех совпадений и добавление их в массив
      while ((match = regex.exec(text)) !== null) {
        result.push(match[1]);
      }

      return result;
    }

    setTimeout(() => {
      const wAr = extractWords(currentWord?.example[$llang]);
      const spanElements = document.querySelectorAll('.sentence_span');
      spanElements.forEach((spanElement, i) => {
        div_input[i].style.display = '';
        spanElement.appendChild(div_input[i]); // Используем cloneNode, чтобы не удалить div_input из DOM
        // spanElement.style.width = "50px";
        resultElementWidth[i] = getTextWidth(wAr[i], '20px Arial');
      });
    }, 0);

    // word = currentWord['original'].replace(/(de|het)\s*/gi, '');
    // let filteredExample = currentWord['example'].replace(
    //    new RegExp(`\\b(de |het )?(?=\\b${word}\\b)`, 'gi'), '');
    // resultElement = filteredExample.split(new RegExp(word, 'i'));
    // console.log(resultElement)

    // Устанавливаем фокус в конец строки
    // setFocus();
  }

  function getTextWidth(text, font) {
    // Создаем элемент canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Устанавливаем шрифт
    context.font = font;

    // Измеряем длину текста
    const metrics = context.measureText(text);
    return metrics.width + 5;
  }

  function OnClickHint(word) {
    div_input.forEach((di) => {
      di.style.color = '';
    });
    const span_cnt = countWordOccurrences(resultElement, '<span');
    function extractSpans(htmlString) {
      // Создаем новый DOMParser
      const parser = new DOMParser();
      // Парсим HTML-строку в документ
      const doc = parser.parseFromString(htmlString, 'text/html');
      // Находим все элементы <span> в документе
      const spans = doc.querySelectorAll('span');
      // Преобразуем NodeList в массив
      return Array.from(spans);
    }

    const arSpan = extractSpans(resultElement);
    const words = word.split(' ');

    arSpan.forEach((el, i) => {
      if (word.includes(el.attributes.value.textContent)) {
        userContent[i] = el.attributes.value.textContent;
      } else {
        userContent[i] = words[i];
      }
    });
  }

  onMount(async () => {});

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
    makeExample();
    userContent[0] = '&nbsp;';
    userContent[1] = '&nbsp;';
    result = '&nbsp;';
  }

  function jumpNext10() {
    const nextIndex = (parseInt(currentWordIndex / 10) + 1) * 10;
    currentWordIndex = nextIndex;
    currentWord = words[currentWordIndex];
    makeExample();
    userContent[0] = '&nbsp;';
    userContent[1] = '&nbsp;';
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
      range.selectNodeContents(div_input[0]);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }, 100);
  }

  function checkInput() {
    if (userContent.length < 1 || !userContent[0]) return;

    if (errorIndex > 0) {
      errorIndex = 0;
      // userContent = [];
    }

    const targetWords = currentWord.original
      .replace(/[.\/#!?$%\^&\*;:{}=`~()]/g, '')
      .trim()
      .split(' ');

    let correctCount = 0;
    result = '';

    userContent.forEach((userInput, i) => {
      // userContent[i] = '';
      if (!userInput) userInput = userContent[0];
      userInput = userInput
        .replace(/&nbsp;/g, '')
        .replace(/<\/?![^>]+(>|$)/g, '')
        .trim();

      if (targetWords[i] && userInput)
        if (
          userInput
            ?.toLowerCase()
            .includes(targetWords[i].toLowerCase().replace('_', ' '))
        ) {
          // result[i] = `<span class="correct">${targetWords[i]}</span>`;
          if (div_input[i]) div_input[i].style.color = 'green';
          correctCount++;
        } else {
          if (div_input[i]) div_input[i].style.color = 'red';

          errorIndex++;
        }
    });

    // console.log(targetWords.length)

    if (errorIndex < 1) {
      showCheckMark = true; // Показываем галочку
      showNextButton = true;
      speak(currentWord.example[$llang]);

      if (hintIndex != 0 || errorIndex != 0) {
        // Перемещаем текущее слово в конец своей "десятки" в words
        words.splice(currentWordIndex, 1);
        words.splice(parseInt(currentWordIndex / 10) * 10 + 9, 0, currentWord);
        const currentWordClone = { ...currentWord };

        if (currentWordIndex + 20 < words.length) {
          words.splice(currentWordIndex + 20, 0, currentWordClone);
        } else {
          words.push(currentWordClone);
        }

        words = words;
        currentWordIndex--;
        errorIndex = 0;
      }

      // if (countWordOccurrences(resultElement, '<span') < 2)
      //   userContent[0] = currentWord.original.replace('_',' ');
      // else userContent = targetWords;

      // highlightWords(userContent.join(' '));
    } else {
      showCheckMark = false;
      focus_pos = 0;
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
        userContent[0] = '';
      }
      userContent[0] += currentWord.original[hintIndex];
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

    userContent[0] = '&nbsp;';
    userContent[1] = '&nbsp;';
    hintIndex = 0;
    result = '&nbsp;';
    showCheckMark = false;
    showNextButton = false;
    showSpeakerButton = false;
  }

  function onPrev() {
    if (currentWordIndex <= 0) return;
    currentWord = words[--currentWordIndex];
    makeExample();

    userContent[0] = '&nbsp;';
    userContent[1] = '&nbsp;';
    hintIndex = 0;
    result = '';
    showCheckMark = false;
    showNextButton = false;
    showSpeakerButton = false;
  }

  function onSpeach() {
    speak(!showNextButton ? currentWord.original : currentWord.example[$llang]);
    hintIndex++;
  }

  function speak(text) {
    text = text.replace(/<<|>>/g, '');
    text = text.replace(/_/g, ' ');
    // Speak(text);
    tts.Speak($llang, text);

    // setFocus();
  }

  function countWordOccurrences(sentence, word) {
    // Приводим предложение и слово к нижнему регистру для нечувствительности к регистру
    const lowerSentence = sentence.toLowerCase();
    const lowerWord = word.toLowerCase();

    // Разбиваем предложение на массив слов
    const words = lowerSentence.split(/\s+/);

    // Считаем количество вхождений слова
    let count = 0;
    words.forEach(function (w) {
      if (w === lowerWord) {
        count++;
      }
    });

    return count;
  }

  function OnClickInput(el) {
    // div_input[0].innerHTML = "    "
    div_input[0].focus();
    // setFocus()
  }

  onDestroy(() => {
    // Очищаем интервал при размонтировании компонента

    console.log('Компонент размонтирован');
  });
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
        on:click={OnClickInput}
        on:input={onChangeUserContent}
        bind:this={div_input[0]}
        bind:innerHTML={userContent[0]}
        style="display:none;width: {resultElementWidth[0]}px"
      >
        {@html result}
      </div>
      <div
        class="input"
        contenteditable="true"
        on:input={onChangeUserContent}
        bind:this={div_input[1]}
        bind:innerHTML={userContent[1]}
        style="display:none;width: {resultElementWidth[1]}px"
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
              {@html hint?.original.replace('_', ' ') + '&nbsp;' + '&nbsp;'}
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
    font-size: larger;
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
    position: relative;
    /* top:3px; */
    height: 18px;
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
