<script>
  // @ts-nocheck

  import { onMount, onDestroy, getContext } from 'svelte';
  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar';
  import Badge from '@smui-extra/badge';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from '@smui/icon-button';
  import {
    mdiArrowRight,
    mdiArrowLeft,
    mdiShuffle,
    mdiPagePreviousOutline,
    mdiChevronDownCircleOutline,
    mdiHelp,
    mdiTextBoxCheckOutline,
    mdiPlay,
    mdiEarHearing,
    mdiTranslateVariant,
    mdiTranslate,
    mdiTranslateOff
  } from '@mdi/js';

  // import words from './80.json';
  import { Translate } from '../../../translate/Transloc';
  // translate.engine = 'google';
  // translate.from = $llang;

  import {
    llang,
    langs,
    dicts,
    lesson,
    showBottomAppBar,
    dc,

  } from '$lib/js/stores.js';

  import langs_list from '$lib/dict/learn_langs_list.json';

  let lang_menu = false;

  let isPlayAuto = false;
  let playAutoColor = 'currentColor';

  $: if (isPlayAuto) {
    playAutoColor = 'green';
  } else {
    playAutoColor = 'currentColor';
  }

  import ISO6391 from 'iso-google-locales';

  import CircularProgress from '@smui/circular-progress';

  import TTS from '../../../speech/tts/Tts.svelte';
  let tts;

  let dict = $dicts;

  export let data;

  const abonent = getContext('abonent');

  let words = [],
    word,
    example,
    example_lang = $langs;
  let translate = true;
  let shuffleWords;
  let hints;
  let currentWordIndex = 0;
  let currentWord;
  let hl_words = data.highlight ? data.highlight.split(',') : [];
  let _llang = $llang;
  let value = $llang;
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
  let speak_text = '';

  // defineWordsArray();

  let counter = 0;
  let isVisible = false;

  let names = data.name?.split(',');

  // Создаем массив промисов для каждого запроса

  fetch(
    `./lesson?words=theme&theme=${data.theme}&name=${data.name}&owner=${abonent}&level=${data.level}`
  )
    .then((response) => response.json())
    .then((data) => {
      words = data.data.data;
      if (!words[0]) return;

      currentWord = words[currentWordIndex];
      makeExample();
    })
    .catch((error) => {
      console.log(error);
      return [];
    });

  $: if ($langs) {
    example_lang = $langs;
    makeExample();
  }

  let topAppBar;
  let sentence_span;

  export function extractWords(text) {
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

  function makeExample() {
    
    if (!currentWord) return;

    return new Promise(async (resolve, reject) => {

      if (currentWord?.example[example_lang]) {
        example = await currentWord.example[example_lang];
      } else if (currentWord.example[$llang]) {
        example = await Translate(currentWord.example[$llang], $llang, $langs);
      }

      //currentWord.example[$langs] = example;

      const regex = /(<<\w+>>)\s+(<<\w+>>)/;
      const match = currentWord?.example[$llang]
        ? currentWord?.example[$llang].match(regex)
        : '';
      let original = '';
      if (match) {
        original = `${match[0]} ${match[1]}`;
      }
      // else original = `${currentWord.original}`;

      resultElement = replaceWordWithInput(
        (speak_text = currentWord?.example[$llang]
          ? currentWord?.example[$llang]
          : (currentWord.example[$llang] = await Translate(
              currentWord.example['ru'],
              'ru',
              $llang
            ))),
        `${original}`
      );

      if (example.includes('<<') && example.includes('>>')) {
        example = example?.replace(
          /<<([^<>]+)>>/gu,
          !data.level.includes('C1')
            ? '<span style="color:green" onclick=OnClickInput><b>$1</b></span>'
            : '$1'
        );
      } else if (example.includes('"')) {
        example = example?.replace(
          /"([^"]+)"/gu,
          !data.level.includes('C1')
            ? '<span style="color:green" onclick=OnClickInput><b>$1</b></span>'
            : '$1'
        );
      }

      setTimeout(() => {
        const wAr = extractWords(currentWord?.example[$llang]);
        const spanElements = document.querySelectorAll('.sentence_span');
        spanElements.forEach((spanElement, i) => {
          if (div_input) div_input[i].style.display = '';
          spanElement.appendChild(div_input[i]); // Используем cloneNode, чтобы не удалить div_input из DOM
          // spanElement.style.width = "50px";
          resultElementWidth[i] = getTextWidth(wAr[i], '20px Arial');
        });
      }, 0);

      function getSubArray(arr, index) {
        const totalElements = 10;
        const halfRange = Math.floor(totalElements / 2);

        let startIndex = index - halfRange;
        let endIndex = index + halfRange;

        // Корректировка начала массива, если оно меньше 0
        if (startIndex < 0) {
          endIndex += Math.abs(startIndex);
          startIndex = 0;
        }

        // Корректировка конца массива, если он больше длины массива
        if (endIndex >= arr.length) {
          startIndex -= endIndex - arr.length + 1;
          endIndex = arr.length - 1;
        }

        // Убедиться, что начало не ушло ниже нуля после корректировки конца
        startIndex = Math.max(startIndex, 0);

        return arr.slice(startIndex, endIndex + 1); // Включить элемент с endIndex
      }

      hints = getSubArray([...words], currentWordIndex);
      shuffle(hints);

      resolve();

      // Устанавливаем фокус в конец строки
      // setFocus();
    });
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
    // word=word.split(' '); 
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
    const words = arSpan.length > 1 ? arSpan.map((span)=>{
      return span.getAttribute('value');
    }): [word];

    div_input[0].style.width = '';
    div_input[1].style.width = '';


    userContent.forEach((uc, i) => {
      if (word.includes(words[i])) {
        userContent[i] = words[i];
      } else {
        userContent[i] =  '';
      }
    });

    checkInput();
  }

  onMount(async () => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      //  $showBottomAppBar = false;//test
    }, 3000);
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
    if (userContent.length < 1 || !userContent[0].replace(/&nbsp;/g, ''))
      return;

    let thisErrorIndex = 0;

    const targetWords = extractWords(currentWord.example[$llang]);

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
          userInput?.toLowerCase() ===
          targetWords[i].toLowerCase().replace('_', ' ')
        ) {
          // result[i] = `<span class="correct">${targetWords[i]}</span>`;
          if (div_input[i]) div_input[i].style.color = 'green';
          correctCount++;
        } else {
          if (div_input[i]) div_input[i].style.color = 'red';
          thisErrorIndex++;
          errorIndex++;
        }
    });

    const addClone = function () {
      const currentWordClone = JSON.parse(JSON.stringify(currentWord));

      if (currentWordIndex + 10 < words.length) {
        words.splice(currentWordIndex + 10, 0, currentWordClone);
      } else {
        if (currentWordIndex + words.length / 2 < words.length)
          words.splice(
            currentWordIndex + words.length / 2,
            0,
            currentWordClone
          );
        else words.push(currentWordClone);
      }

      words = words;
    };

    // console.log(targetWords.length)

    if (hintIndex > 0 || (errorIndex > 0 && thisErrorIndex < 1)) {
      addClone();
    }

    if (thisErrorIndex < 1) {
      showCheckMark = true; // Показываем галочку
      showNextButton = true;
      speak(speak_text);
      currentWordIndex = currentWordIndex + 1;
      hintIndex = 0;
      errorIndex = 0;
    }

    showCheckMark = false;
    focus_pos = 0;
    setFocus();
  }

  function onChangeUserContent(ev) {
    let ar = document.getElementsByClassName('empty_block');
    if (ar.length > 0) {
      // console.log(ar.length);
      ar[0].remove();
    }
  }

  function showHint() {
    const words = extractWords(currentWord.example[$llang]).join(' ');

    let i = 0,
      w = 0;

    if (hintIndex == 0) {
      userContent[0] = '&nbsp;';
      userContent[1] = '&nbsp;';
      div_input[0].style.color = '#2196f3';
      div_input[1].style.color = '#2196f3';
      // div_input[0].style.width = getTextWidth(words, '20px Arial') + 'px';
      // div_input[1].style.width = getTextWidth(words, '20px Arial') + 'px';
    }

    for (let char of words) {
      // word = word.replace(/[.,\/#!?$%\^&\*;:{}=_`~()]/g, '');

      if (char == ' ' && div_input[1].style.display !== 'none') {
        w++;
        //  div_input[1].style.display = 'inline-table'
        if (userContent[w] === '&nbsp;') userContent[w] = '';
        continue;
      }

      if (i === hintIndex) {
        userContent[w] += char;

        result = ''; // Очистим результат при каждой новой подсказке
        showSpeakerButton = true; // Устанавливаем видимость кнопки
        setFocus();

        hintIndex++;
        break;
      }

      i++;
    }
  }

  function showHintAuto() {
    const words = extractWords(currentWord.example[$llang]).join(' ');

    if (hintIndex == 0) {
      userContent[0] = '&nbsp;';
      userContent[1] = '&nbsp;';

      div_input[0].style.color = '#2196f3';
      div_input[1].style.color = '#2196f3';
      div_input[0].style.width = getTextWidth(words, '20px Arial') + 'px';
      div_input[1].style.width = getTextWidth(words, '20px Arial') + 'px';
    }

    const splited = words.split(' ');

    if (div_input[1] && div_input[1].style.display === '')
      [userContent[0], userContent[1]] = splited;
    else userContent[0] = words;
  }

  async function nextWord() {
    if (currentWordIndex >= words.length) currentWordIndex = 0;
    example_lang = $langs;
    currentWord = words[currentWordIndex];
    await makeExample();

    hints = hints;

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
    speak(
      !showNextButton
        ? extractWords(currentWord.example[$llang]).join()
        : currentWord.example[$llang]
    );

    if (!showNextButton) hintIndex++;
  }

  function speak(text) {
    text = text.replace(/<<|>>/g, '');
    text = text.replace(/_/g, ' ');
    // Speak(text);
    tts.Speak_server($llang, text, data.name);

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

  function setLang(ev) {
    let lang = ev.currentTarget.outerText;
    let code = ISO6391.getCode(lang);
    if (code !== 'English') {
      $llang = code;
    }
    // console.log($langs);
    lang_menu = false;
    userContent[0] = '&nbsp;';
    userContent[1] = '&nbsp;';
    makeExample();
  }

  function PlayAutoContent() {
    isPlayAuto = !isPlayAuto;
    if (!isPlayAuto) return;

    async function onEndSpeak() {
      if (!isPlayAuto) return;

      if (active === currentWord.example[$langs].replace(/<<|>>/g, '')) {
        active = currentWord.example[$llang].replace(/<<|>>/g, '');
        tts.Speak_server($llang, active, data.name, onEndSpeak);
      } else if (active === currentWord.example[$llang].replace(/<<|>>/g, '')) {
        currentWordIndex++;
        await nextWord();
        setTimeout(() => {
          showHintAuto();
        }, 100);

        active = currentWord.example[$langs].replace(/<<|>>/g, '');
        tts.Speak_server($langs, active, data.name, onEndSpeak);
      }
    }

    div_input[0].style.color = '#2196f3';
    div_input[1].style.color = '#2196f3';
    setTimeout(() => {
      showHintAuto();
    }, 100);
    let active = currentWord.example[$langs].replace(/<<|>>/g, ''); //currentWord.example[$langs];
    tts.Speak_server($langs, active, data.name,onEndSpeak);
  }

  function OnClickLBL(){
    return
    if(currentWord?.example[`lbl.${$langs}`]){
      example_lang =`lbl.${$langs}`;
      makeExample()

    }
  }

  function ToggleTranslate(){
    translate = !translate
  }

  onDestroy(() => {
    // Очищаем интервал при размонтировании компонента
    $llang = _llang;
    $lesson.data = { quiz: '' };
  });
</script>

<!-- <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/> -->

<TTS bind:this={tts}></TTS>

{#if words?.length < 1}
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

    <div class="top-app-bar-container flexor">
      <TopAppBar bind:this={topAppBar} variant="fixed">
        <Row>
          <Section align="start">
            {#if currentWordIndex > 0}
              <Icon
                tag="svg"
                on:click={onPrev}
                viewBox="0 0 24 24"
                style="margin:10px 5px 10px 5px; scale:.5; width:50px"
              >
                <path fill="white" d={mdiArrowLeft} />
              </Icon>
            {/if}
          </Section>
          <Section align="start">
            <button class="hint-button" on:click={showHint}>
              <span class="material-symbols-outlined">?</span>
            </button>
          </Section>
          <Section>
            {#if !$dc}
              <IconButton on:click={PlayAutoContent}>
                <Icon tag="svg" viewBox="0 0 24 24">
                  <path fill={playAutoColor} d={mdiEarHearing} />
                </Icon>
              </IconButton>
            {/if}
          </Section>

          <Section align="end">
            <div class="counter">
              <p>
                <span class="mdc-typography--overline" style="position:relative"
                  >{currentWordIndex}
                  <Badge
                    position="middle"
                    align="bottom-end - bottom-middle"
                    aria-label="unread count"
                    style="margin-right:-10px;scale:.8">{words.length}</Badge
                  >
                </span>
              </p>
            </div>
          </Section>
          <Section align="end">
            {#if true || words.length <= 20}
              <Icon
                tag="svg"
                on:click={onShuffleWords}
                viewBox="0 0 24 24"
                style="margin-top:0px; scale:.5; width:50px"
              >
                <path fill="white" d={mdiShuffle} />
              </Icon>
            {:else}
              <div on:click={jumpNext10}>+10</div>
            {/if}
          </Section>
          <Section align="end">
            <Icon
              tag="svg"
              viewBox="0 0 24 24"
              style="margin:10px 5px 10px 5px; scale:1.2; width:20px"
              on:click={ToggleTranslate}
            >
            {#if translate}
              <path fill="white" d={mdiTranslateOff}/>
            {:else}
              <path fill="grey" d={mdiTranslate}/>
            {/if}
            </Icon>
          </Section>

          <Section align="end">
            {#if showNextButton}
              <Icon
                tag="svg"
                on:click={nextWord}
                viewBox="0 0 24 24"
                style="margin:10px 5px 10px 5px; scale:.5; width:50px"
              >
                <path fill="green" d={mdiArrowRight} />
              </Icon>
            {:else}
              <Icon
                tag="svg"
                on:click={checkInput}
                viewBox="0 0 24 24"
                style="visibility:hidden;margin-top:0px; scale:.5; width:50px"
              >
                <path fill="white" d={mdiTextBoxCheckOutline} />
              </Icon>
            {/if}
          </Section>
        </Row>
      </TopAppBar>
    </div>

    <div class="div_word">
    <span
      style="display:block;position:relative;top: 0px;color: lightgray;font-style: italic;font-size:smaller;font-family: serif;"
      >{data.name}</span
    >

    {#await Translate('Заполнить пропуски', 'ru', $langs) then data}
      <div class="title">{data}:</div>
    {/await}

    {#if translate}
    <div class="word" >

        {#if example}
        <!-- {@debug example} -->
        {#if currentWord?.example[`lbl.${$langs}`] && 
          currentWord?.example[`lbl.${$langs}`] !== currentWord?.example[$langs]}
        <Icon tag="svg" on:click={OnClickLBL} viewBox="0 0 24 24" 
          style="position: absolute;
              left: 0;
              margin-top:-40px; 
              scale:.5; 
              width:50px">
        <path fill="lightgrey" d={mdiTranslateVariant} /></Icon>
        {/if}
      
            {@html example} 
          {:else}
            {#await Translate(example, 'ru', $langs) then data}
              {@html data}
            {/await}
          {/if}
   
    </div>
    {/if}

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
      <div class="speaker-button" on:click={onSpeach}>
        <IconButton>
          <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiPlay} />
          </Icon>
        </IconButton>
      </div>
    </div>

    <!-- <br /> -->
    <!-- {#if hintIndex != 0} -->
    <div class="words_div accordion-container">
      {#if hints?.length > 0}
        <Content style="line-height: 2.0; overflow-y:auto;">
          {#each hints as hint, i}
            {#if hint?.example[$llang]}
              <span
                class="hint_button"
                on:click={() => {
                  OnClickHint(extractWords(hint?.example[$llang]).join(' '), i);
                }}
              >
                {@html extractWords(hint?.example[$llang]).join(' ') +
                  '&nbsp;' +
                  '&nbsp;'}
              </span>
            {:else}
              {#await Translate(hint?.example['ru'], 'ru', $llang) then data}
                <span
                  class="hint_button"
                  on:click={() => {
                    OnClickHint(extractWords(data).join(' '));
                  }}
                >
                  {@html extractWords(data).join(' ') + '&nbsp;' + '&nbsp;'}
                </span>
              {/await}
            {/if}
          {/each}
          <div style="height:80px"></div>
        </Content>
      {/if}
    </div>
     <div style="height:300px"/>
    </div>
{/if}

<style>
    .top-app-bar-container{
      position: relative;
      top:0px; 
      height: 60px;
    /* transform: scale(1.2) translate(-4%,0%);
    transform-origin: center ;  */
    }
  .div_word {
    position: relative;
    display: inline-grid;
    /* background-color: #fff; */
    transition: transform 0.3s ease-in-out;
    /* width: 98%; */
    margin: 0 auto;
    /* transform-style: preserve-3d; */
    transition: transform 0.5s;
    /* height: 80vh; */
    /* top: 10px; */
  }
  .title {
    font-size: medium;
    color: coral;
    position: relative;
    text-align: center;
    margin-top: 10px;
  }

  .hint_button {
    display: inline-block;
    border: solid 0.1em #80777791;
    border-radius: 5px;
    text-align: center;
    width: auto;
    padding-left: 8px;
    margin: 5px;
    color: #2196e6;
    background-color: transparent;
  }

  /* Стилизуйте компонент по вашему усмотению */
  .word {
    font-size: 0.8em;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    text-align: center;
    line-height: 17px;
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
    display: inline-flex;
    position: relative;
    float: right;
    margin-right: 10px;
    font-size: large;
    border-radius: 25px;
    transform: translate(50%, 0%);
    font-size: large;
    z-index: 2 !important;
  }

  .input-container {
    display: inline-block;
    font-size: large;
    position: relative;
    color: #2196f3;
    width: 95vw;
    margin: 10px auto;
    text-align: center;
  }

  .words_div {
    position: relative;
    text-align: center;
    overflow-y: hidden;
    height: 70vh;
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
    border: 0px;
    color: white;
    background-color: #2196f3;
    border-radius: 3px;
    padding: 8px 10px;
  }
  .counter {
    /* position: absolute; */
    background-color: #f0f0f0;
    padding: 0px;
    border-radius: 25px;
    width: 30px;
    height: 30px;
    top: -10px;
    left: -6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .counter p {
    margin: 0;
    font-size: 15px;
    color: #333;
  }

  .counter span {
    font-weight: 700;
    font-size: 15px;
    color: #ff5733; /* цвет счетчика */
  }

  .lang_span {
    visibility: hidden;
    font-size: large;
  }

  .lang_list {
    position: absolute;
    top: 50px;
    height: 80vh;
    overflow: hidden;
    justify-content: center; /* Выравниваем содержимое по центру вертикально */
    align-items: center; /* Выравниваем содержимое по центру горизонтально */
    background-color: white;
    /* opacity: 50%; */
  }

  @media screen and (min-width: 768px) {
		/* Ваши стили для более крупных экранов здесь */


	}
</style>
