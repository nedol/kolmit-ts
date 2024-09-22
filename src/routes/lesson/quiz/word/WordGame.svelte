<script>
  // @ts-nocheck

  import { onMount, onDestroy, getContext } from 'svelte';
  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar';
  import Badge from '@smui-extra/badge';
  import Select, { Option } from '@smui/select';

  // import words from './80.json';
  import { Translate } from '../../../translate/Transloc';
  // translate.engine = 'google';
  // translate.from = $llang;

  import { langs } from '$lib/js/stores.js';

  import langs_list from '$lib/dict/learn_langs_list.json';

  let lang_menu = false;

  import ISO6391 from 'iso-google-locales';

  import CircularProgress from '@smui/circular-progress';

  import TTS from '../../../speech/tts/Tts.svelte';
  let tts;

  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from '@smui/icon-button';
  import {
    mdiShareVariant,
    mdiPagePreviousOutline,
    mdiChevronDownCircleOutline,
    mdiHelp,
    mdiVolumeHigh,
  } from '@mdi/js';

  import {
    lesson,
    llang,
    view,
    dicts,
    dc_oper,
    dc_user,
    dc_oper_state,
    dc_user_state,
    msg_user,
    msg_oper,
    call_but_status,
    showBottomAppBar,
    OnCheckQU
  } from '$lib/js/stores.js';

  let dict = $dicts;

  export let data;

  const abonent = getContext('abonent');

  let words = [],
    word,
    example = '&nbsp;';
  let shuffleWords;
  let hints = {};
  let currentWordIndex = 0;
  let currentWord;
  let doneWords = 0;
  let doneWords_2 = 0;
  let arrayOfArrays;
  let userContent = [];
  let div_input = [];
  let result = '&nbsp;';
  let resultElement;
  let hintIndex = 0;
  let showHints = {};
  let errorIndex = 0;
  let _llang = $llang;
  let value = $llang;
  let showNextButton = false;
  let showCheckButton = false;
  let resultElementWidth = [];
  let showSpeakerButton = false;
  let focus_pos = 0;
  let level = data.level;
  let share_button = false;
  let share_button_class = 'button_shared_false';
  let share_mode = false;
  let isFlipped = false;
  let hint_example = '';
  let label = {};
  label[true] = 'Ожидай вопрос';
  label[false] = 'Выбери слово';

  $: switch ($call_but_status) {
    case 'talk':
      break;
    default:
      share_mode = false;

      break;
  }

  // defineWordsArray();

  let counter = 0;
  let isVisible = false;

  let names = data.name?.split(',');

  // Создаем массив промисов для каждого запроса

  if (data.theme && data.name && level)
    fetch(
      `./lesson?words=theme&theme=${data.theme}&name=${data.name}&owner=${abonent}&level=${level}`
    )
      .then((response) => response.json())
      .then((data) => {
        words = data.data.data || [];
        if (!words[0]) return;

        hints[false] = JSON.parse(JSON.stringify(words));
        hints[true] = JSON.parse(JSON.stringify(words));

        showHints[isFlipped] = true;

        if ($call_but_status !== 'active') {
          onShare();
      
        }

        //   shuffle(hints);
      })
      .catch((error) => {
        console.log(error);
        return [];
      });

  $: if ($langs) {
    makeExample();
  }

  $: if ($llang) {
    makeExample();
  }

  $: if ($msg_user?.lesson?.quiz === 'word') {
    if ($msg_user.lesson.words_data) {
      words = $msg_user.lesson.words_data;
      hints[false] = JSON.parse(JSON.stringify(words));
      hints[true] = JSON.parse(JSON.stringify(words));
      isFlipped = !$msg_user.lesson.isFlipped;
      level = $msg_user.lesson.level;
      share_mode = true;
      showHints[isFlipped] = false;

       $OnCheckQU(null, 'word', $msg_user.lesson.name);
     
    } else if (
      ($msg_user.lesson.word_correct || $msg_user.lesson.word_correct == 0) &&
      hints
    ) {
      hints[isFlipped][$msg_user.lesson.word_correct].disabled = 'disabled';
      hint_example = '';
      doneWords_2 = $msg_user.lesson.done_words;
    } else if (
      ($msg_user.lesson.word_error || $msg_user.lesson.word_error == 0) &&
      hints
    ) {
      // hints[isFlipped][$msg_user.lesson.word_correct].disabled = 'disabled';
      hint_example = '';
    } else if (
      $msg_user.lesson.word_index ||
      $msg_user.lesson.word_index == 0
    ) {
      currentWord = words[$msg_user.lesson.word_index];
      currentWordIndex = $msg_user.lesson.word_index;
      showHints[isFlipped] = true;
      label[true] = 'Заполни пропуски';
      label[false] = 'Твой ход. Выбери слово';
      level = $msg_user.lesson.level;
      makeExample();
    } else if ($msg_user?.lesson.word_flip) {
      isFlipped = $msg_user.lesson.word_flip;
      $msg_user.lesson.word_flip = null;
      hints[isFlipped] = hints[isFlipped];
      showHints[isFlipped] = false;
      label[true] = 'Ожидай вопрос';
      resultElement = '';
      result = '';
      hint_example = '';
      example = '';
    }
  }

  $: if ($msg_oper?.lesson?.quiz === 'word') {
    if ($msg_oper.lesson.word_index || $msg_oper.lesson.word_index == 0) {
      currentWord = words[$msg_oper.lesson.word_index];
      currentWordIndex = $msg_oper.lesson.word_index;
      label[true] = 'Заполни пропуски';
      label[false] = 'Твой ход. Выбери слово';
      showHints[isFlipped] = true;
      level = $msg_oper.lesson.level;
      makeExample();

    } else if ($msg_oper?.lesson.words_data) {
      words = $msg_oper.lesson.words_data;
      hints[false] = JSON.parse(JSON.stringify(words));
      hints[true] = JSON.parse(JSON.stringify(words));
      level = $msg_oper.lesson.level;
      share_mode = true;
      isFlipped = !$msg_oper.lesson.isFlipped;
      showHints[isFlipped] = false;

       $OnCheckQU(null, 'word', $msg_oper.lesson.name) ;
    } else if (
      ($msg_oper.lesson.word_correct || $msg_oper.lesson.word_correct == 0) &&
      hints
    ) {
      hints[isFlipped][$msg_oper.lesson.word_correct].disabled = 'disabled';
      hint_example = '';
      doneWords_2 = $msg_oper.lesson.done_words;
    } else if (
      ($msg_oper.lesson.word_error || $msg_oper.lesson.word_error == 0) &&
      hints
    ) {
      // hints[isFlipped][$msg_user.lesson.word_correct].disabled = 'disabled';
      hint_example = '';
    } else if ($msg_oper.lesson.word_flip) {
      isFlipped = $msg_oper.lesson.word_flip;
      hints[isFlipped] = hints[isFlipped];
      $msg_oper.lesson.word_flip = null;
      showHints[isFlipped] = false;
      label[true] = 'Ожидай вопрос';
      resultElement = '';
      result = '';
      hint_example = '';
      example = '';
    }
  }

  function onShare() {
    // Обработчик нажатия на кнопку "share"
    share_mode = true;
    share_button_class = `button_shared_${share_mode}`;
    const lesson = {
      lesson: {
        quiz: 'word',
        name: data.name,
        llang: $llang,
        level: level,
        words_data: words,
        isFlipped: isFlipped,
      },
    };
    // isFlipped = !isFlipped;
    // currentWord = words[currentWordIndex];
    // makeExample();
    SendData(lesson);
      const dc = $dc_user?.dc.readyState === 'open' ? $dc_user : $dc_oper;
     $OnCheckQU(dc.rtc.oper_uid, 'word', data.name);

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
      `<span  value="$1" class="sentence_span" style="position: relative;width:20px;  left: 0px; color:green; font-weight:bold"  onclick=OnClickInput></span>`
    );
  }

  function replaceWord(text, targetWord) {
    const threshold = 0.8; // 90% порог

    return text.replace(
      /<<([^>]*)>>/g,
      `<span  value="$1" class="sentence_span" style="position: relative;width:20px;  left: 0px; color:green; font-weight:bold">$1</span>`
    );
  }

  async function makeExample() {
    if (!currentWord) return;

    resultElement = '';
    example = '';

    if (currentWord.example[$langs]) {
      example = currentWord['example'][$langs];
    } else if (currentWord.example[$llang]) {
      example = await Translate(currentWord['example'][$llang], $llang, $langs);
    }

    const regex = /(<<\w+>>)\s+(<<\w+>>)/;
    const match = example.match(regex);
    let original = '';
    if (match) {
      original = `${match[0]} ${match[1]}`;
    }
    // else original = `${currentWord.original}`;

    resultElement = replaceWordWithInput(
      currentWord?.example[$llang]
        ? currentWord?.example[$llang]
        : await Translate(currentWord.example['ru'], 'ru', $llang),
      `${original}`
    );

    if (example.includes('<<') && example.includes('>>')) {
      example = example?.replace(
        /<<([^<>]+)>>/gu,
        level.includes('A1')
          ? '<span style="color:green" onclick=OnClickInput><b>$1</b></span>'
          : '$1'
      );
    } else if (example.includes('"')) {
      example = example?.replace(
        /"([^"]+)"/gu,
        level.includes('A1')
          ? '<span style="color:green" onclick=OnClickInput><b>$1</b></span>'
          : '$1'
      );
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
    return metrics.width + 20;
  }

  function OnClickHint(ev, word, i) {
    if (!share_mode) onShare();

    if (!isFlipped) {
      const data = {
        lesson: {
          quiz: 'word',
          level: level,
          word_index: i,
          isFlipped: isFlipped,
        },
      };
      SendData(data);
      showHints[isFlipped] = false;
      ev.target.classList.add('selected');
      label[false] = 'Ожидай вопрос';
    } else {
      showCheckButton = true;
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
      const words = arSpan.length > 1 ? word.split(' ') : [word];

      div_input[0].style.width = '';

      arSpan.forEach((el, i) => {
        if (word.includes(el.attributes.value.nodeValue.toLowerCase())) {
          userContent[i] = el.attributes.value.nodeValue;
          el.style.width = getTextWidth(userContent[i], '20px Arial');
        } else {
          userContent[i] = words[i] ? words[i] : '';
        }
      });
    }

    hint_example = replaceWord(words[i].example[$langs]);
  }

  async function SendData(data) {
    let dc = null;

    if ($dc_user?.dc.readyState === 'open') {
      dc = $dc_user;
    } else if ($dc_oper?.dc.readyState === 'open') {
      dc = $dc_oper;
    }
    if (share_mode && dc) {
      //  words.content[cur_qa].user2['a_shfl'] = a_shfl;
      await dc.SendData(data, (ex) => {
        console.log(ex);
      });
    }
  }

  onMount(async () => {

  });

  // function handleBackClick() {
  //   $lesson.data = { quiz: '' }; // При клике на "Back" показываем компонент Lesson
  // }

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

    if (thisErrorIndex < 1) {
      if (errorIndex < 1) {
        doneWords++;
        const data = {
          lesson: {
            quiz: 'word',
            word_correct: currentWordIndex,
            done_words: doneWords,
          },
        };
        SendData(data);

        errorIndex = 0;
        label[true] = 'Нажми "Вперед"';
        // speak(currentWord.example[$llang]);TODO: для fr
        showHints[isFlipped] = false;
        showNextButton = true;
      } else {
        const data = {
          lesson: {
            quiz: 'word',
            word_error: currentWordIndex,
            done_words: doneWords,
          },
        };
        SendData(data);
        label[true] = 'Нажми "Вперед"';
        showHints[isFlipped] = false;
        showNextButton = true;
      }
    } else {
      errorIndex++;
      label[true] = 'Исправь ошибку';
    }
    // console.log(targetWords.length)
  }

  function onChangeUserContent(ev) {
    let ar = document.getElementsByClassName('empty_block');
    if (ar.length > 0) {
      // console.log(ar.length);
      ar[0].remove();
    }
  }

  function showHint() {
     showCheckButton = true;
    const words = extractWords(currentWord.example[$llang]).join(' ');

    let i = 0,
      w = 0;

    for (let char of words) {
      // word = word.replace(/[.,\/#!?$%\^&\*;:{}=_`~()]/g, '');
      if (char == ' ') {
        w++;
        if (userContent[w] === '&nbsp;') userContent[w] = '';
        continue;
      }

      if (i === hintIndex) {
        console.log(char);
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

  function nextWord() {
    // currentWordIndex = currentWordIndex + 1;
    // if (currentWordIndex >= words.length) currentWordIndex = 0;
    // currentWord = words[currentWordIndex];
    // makeExample();

    userContent[0] = '&nbsp;';
    userContent[1] = '&nbsp;';

    errorIndex = 0;

    label[isFlipped] = 'Выбери слово';

    resultElement = '';
    result = '';
    hint_example = '';
    example = '';

    hintIndex = 0;

    showHints[isFlipped] = false;
    // result = '&nbsp;';

    showNextButton = false;
    showCheckButton = false;
    showSpeakerButton = false;

    const data = {
      lesson: {
        quiz: 'word',
        word_flip: isFlipped,
      },
    };
    SendData(data);
    console.log(isFlipped);
    isFlipped = !isFlipped;
  }

  function onSpeach() {
    speak(
      !showNextButton
        ? extractWords(currentWord.example[$llang]).join()
        : currentWord.example[$llang]
    );
    // hintIndex++;
    const currentWordClone = { ...currentWord };

    if (currentWordIndex + 10 < words.length) {
      words.splice(currentWordIndex + 10, 0, currentWordClone);
    } else {
      words.push(currentWordClone);
    }
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

  function setLang(ev) {
    let lang = ev.currentTarget.outerText;
    let code = ISO6391.getCode(lang);
    if (code !== 'English') {
      $llang = code;
    }
    // console.log($langs);
    lang_menu = false;
  }
  onDestroy(() => {
    // Очищаем интервал при размонтировании компонента
    $llang = _llang;
    $view = 'lesson';
    $lesson.data = { quiz: '' };
    console.log('Компонент размонтирован');
    $showBottomAppBar = true;
  });
</script>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>

<TTS bind:this={tts}></TTS>

{#if words.length === 0}
  <div style="text-align:center">
    <span
      class="material-symbols-outlined"
      style="font-size: 20px; color: blue; scale:1.5;"
    >
      <CircularProgress style="height: 50px; width: 50px;" indeterminate />
    </span>
  </div>
{:else}
  <main>
    <div class="top-app-bar-container flexor">
      <TopAppBar bind:this={topAppBar} variant="fixed">
        <Row>
          <Section></Section>
          <Section>
            <!-- {#if share_button && $call_but_status === 'talk'} -->

            <!-- <div class={share_button_class} on:click={onShare}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiShareVariant} />
                </Icon>
              </IconButton>
            </div> -->
          </Section>

          <Section>
            <button class="hint-button" on:click={showHint}>
              <span class="material-symbols-outlined">?</span>
            </button>
          </Section>

          <Section>
            <div class="counter" style="display:inline">
              <p>
                <span class="mdc-typography--overline" style="position:relative"
                  >{doneWords}:{doneWords_2}
                  <Badge
                    position="middle"
                    align="bottom-end - bottom-middle"
                    aria-label="unread count"
                    style="margin-right:-15px;scale:.8">{words.length}</Badge
                  >
                </span>
              </p>
            </div>
          </Section>
          <Section align="end">
            <span
              class="lang_span"
              on:click={() => {
                lang_menu = !lang_menu;
              }}
              >{(() => {
                return $llang;
              })()}</span
            >
            {#if lang_menu}
              <div class="lang_list">
                {#each langs_list as lang}
                  <div
                    style="color:black; margin:10px;font-size:smaller"
                    on:click={setLang}
                  >
                    {lang}
                  </div>
                {/each}
              </div>
            {/if}
          </Section>

          <Section align="end">
            {#if isFlipped}
              {#if showNextButton}
                <button on:click={nextWord} class="next-button"
                  >{#await Translate('Вперед', 'ru', $langs) then data}
                    {data}
                  {/await}</button
                >
              {:else if showCheckButton}
                <button on:click={checkInput} class="check-button">
                  {#await Translate('Проверить', 'ru', $langs) then data}
                    {data}
                  {/await}
                </button>
              {/if}
            {/if}
          </Section>
        </Row>
      </TopAppBar>
    </div>

    {#if isFlipped}
      <div class="word">
        {@html example}
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

      <!-- {#if showSpeakerButton}
        <div class="speaker-button">
          <IconButton on:click={onSpeach}>
            <Icon tag="svg" viewBox="0 0 24 24">
              <path fill="currentColor" d={mdiVolumeHigh} />
            </Icon>
          </IconButton>
        </div>
      {/if} -->

      {#await Translate(label[isFlipped], 'ru', $langs) then data}
        <div class="title">{data}</div>
      {/await}
    {:else}
      {#await Translate(label[isFlipped], 'ru', $langs) then data}
        <div class="title">{data}:</div>
      {/await}
      {#if showHints[isFlipped]}
        <div class="hint_example">
          {@html hint_example}
        </div>
      {/if}
    {/if}

    <div class="words_div accordion-container">
      {#if isFlipped}
        {#if hints[isFlipped]?.length > 0 && showHints[isFlipped]}
          <Content style="line-height: 2.0; overflow-y:auto; height:70vh">
            {#each hints[isFlipped] as hint, i}
              <!-- {@debug isFlipped} -->
              {#if hint?.example[$llang]}
                <!--  -->
                <span
                  class="hint_button {hint.disabled}"
                  on:click={() => {
                    OnClickHint(
                      this,
                      extractWords(hint.example[$llang]).join(' '),
                      i
                    );
                  }}
                >
                  {@html extractWords(hint.example[$llang]).join(' ') +
                    '&nbsp;' +
                    '&nbsp;'}
                </span>
                <!-- {/if} -->
              {:else}
                {#await Translate(hint?.example['ru'], 'ru', $llang) then data}
                  <span
                    class="hint_button {hint.disabled}"
                    on:click={(ev) => {
                      OnClickHint(ev, extractWords(data).join(' '), i);
                    }}
                  >
                    {@html extractWords(data).join(' ') + '&nbsp;' + '&nbsp;'}
                  </span>
                {/await}
              {/if}
            {/each}

            <div style="height:50px"></div>
          </Content>
        {/if}
      {:else if hints[isFlipped]?.length > 0}
        <Content style="line-height: 2.0; overflow-y:auto; height:70vh">
          {#each hints[isFlipped] as hint, i}
            <!-- {@debug isFlipped} -->
            {#if hint?.example[$langs]}
              <!--  -->
              <span
                class="hint_button {hint.disabled}"
                on:click={(ev) => {
                  OnClickHint(
                    ev,
                    extractWords(
                      hint?.example[isFlipped ? $llang : $langs]
                    ).join(' '),
                    i
                  );
                }}
              >
                {@html extractWords(hint?.example[$langs]).join(' ') +
                  '&nbsp;' +
                  '&nbsp;'}
              </span>
              <!-- {/if} -->
            {:else}
              {#await Translate(hint?.example['ru'], 'ru', $langs) then data}
                <span
                  class="hint_button {hint.disabled}"
                  on:click={(ev) => {
                    OnClickHint(ev, extractWords(data).join(' '), i);
                  }}
                >
                  {@html extractWords(data).join(' ') + '&nbsp;' + '&nbsp;'}
                </span>
              {/await}
            {/if}
          {/each}

          <div style="height:50px"></div>
        </Content>
      {/if}
    </div>
  </main>
{/if}

<style>
  main {
    /* display: inline-grid; */
    /* transition: transform 0.3s ease-in-out; */
    margin: 0 auto;
    position: relative;
    transition: transform 0.5s;
    /* height: 80vh; */
    top: 30px;
  }

  .flexor {
    position: relative;
    /* top: 30px; */
  }
  .title {
    color: coral;
    position: relative;
    text-align: center;
    margin-top: 0px;
    top: 60px;
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

  .hint_example {
    position: relative;
    top: 60px;
    /* border: solid 0.1em #9f3f3f; */
    border-radius: 5px;
    text-align: center;
    width: auto;
    padding-left: 5px;
    margin: 5px;
    background-color: transparent;
  }

  .disabled {
    visibility: hidden;
  }

  /* Стилизуйте компонент по вашему усмотрению */
  .word {
    position: relative;
    top: 60px;
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
    top: 60px;
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
    top: 80px;
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
    width: 50px;
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
    font-size: large;
  }

  .lang_list {
    position: absolute;
    top: 50px;
    height: 80vh;
    overflow: auto;
    justify-content: center; /* Выравниваем содержимое по центру вертикально */
    align-items: center; /* Выравниваем содержимое по центру горизонтально */
    background-color: white;
    /* opacity: 50%; */
  }

  .selected {
    background-color: coral;
  }
</style>
