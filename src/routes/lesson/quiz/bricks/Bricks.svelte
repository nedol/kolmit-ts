<script>
  import { onMount , getContext} from 'svelte';
  import { slide } from 'svelte/transition';
  import ConText from '../Context.svelte';
  import { Translate } from '../../../translate/Transloc';
  import Tts from '../../../speech/tts/Tts.svelte';
  import emojiRegex from 'emoji-regex';
  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar';
  import IconButton, { Icon } from '@smui/icon-button';
  import Badge from '@smui-extra/badge';
  import CircularProgress from '@smui/circular-progress';

  import Stt from '../../../speech/stt/Stt.svelte';

  
  let isListening = false;

  let isSTT = false;

  let topAppBar;

  let translate = false;

  let span_equal = true;

  let stt_text = '';

  let isPlayAuto = false;

  let playAutoColor = 'currentColor';

  $: if (isPlayAuto) {
      playAutoColor = 'green';
  } else {
      playAutoColor = 'currentColor';
  }

  import {
      langs,
      llang,
  } from '$lib/js/stores.js';

  import {
      mdiArrowRight,
      mdiArrowLeft,
      mdiMicrophoneOutline ,
      mdiMicrophone,
      mdiEarHearing,
      mdiPlay,
      mdiTranslate,
      mdiTranslateOff
  } from '@mdi/js';

  let stt, tts;
  // Разделяем предложение на слова
  let words = [];

// Функция для отслеживания сфокусированных элементов
let focusedIndex = 0;

// Разделение предложения на placeholder'ы
let formattedSentence = [];

let bricks_data;

let isCollapsed = true;

let curSentence = 0;

let speechData = '';
let current_word = 0;
let audio;
let display_audio;

let keys = [];

  export let data;
  const operator = getContext('operator');
  // Исходное предложение
  let sentence = "Dit is een voorbeeldzinxx voor het oefenen van Nederlands.";

  $: if($langs){
    InitData();
  }

  fetch(
    `./lesson?bricks=${data.name}&theme=${data.theme}&owner=${operator.abonent}&level=${data.level}`
  )
    .then((response) => response.json())
    .then(async (data) => {
    
      bricks_data = data.data
      // Преобразуем HTML в текст и разбиваем на массив предложений
      // bricks_data.text = htmlToText(bricks_data.html).replaceAll('"','').split(/(?<=[.?!])\s+/);
      bricks_data.text = splitHtmlIntoSentencesWithInnerTags(data.data.html.replaceAll('"',''));//.replaceAll('"','').split(/(?<=[.?!])\s+/);

      InitData();

    })
    .catch((error) => {
      console.log(error);
      return [];
    });

  function extractTagName(tagString) {
      const match = tagString.match(/^<(\w+)/); // Находим первую часть тега
      return match ? match[1] : ''; // Возвращаем название тега или null, если не найдено
  }
  
  const InitData = async () => {
    if (!bricks_data?.text) return;

    try {


      // Собираем все предложения
      const sentences = bricks_data.text;

      // Убираем HTML-теги
      const cleanedSentences = sentences.map(sentence => sentence.replace(/<[^>]*>/g, ''));

      // Функция для разделения массива на пакеты по 5 предложений
      const chunkArray = (arr, size) =>
        arr.reduce((chunks, _, i) =>
          i % size === 0 ? [...chunks, arr.slice(i, i + size)] : chunks, []
        );

      const sentenceBatches = chunkArray(cleanedSentences, 5);

      // Фоновый перевод: отправляем группы по 5
      if(false)
      Promise.allSettled(sentenceBatches.map(batch => Translate(batch.join(' '), $llang, $langs)))
        .then(results => {
          bricks_data.translate = results.flatMap(result =>
            result.status === "fulfilled"
              ? result.value
                .replace(/^[\"«]|[\"»]$/g, '')
                .split(/(?<=[.?!])\s+/)
                .map(sentence => sentence.trim())
                .filter(sentence => sentence !== '')
              : ["Ошибка перевода"] // если перевод не удался
          );
        })
        .catch(error => console.error("Translation error:", error));

      // Проверяем наличие curSentence
      if (typeof curSentence === 'undefined' || !keys[curSentence]) {
        curSentence = 0;
      }

      // Текущее предложение
      const sentence = bricks_data.text[curSentence];

      // Получение озвучки через TTS
      const { resp } = await tts.GetGoogleTTS($llang, sentence.replace(/<[^>]*>/g, ''), data?.name);
      speechData = resp;

      // Разбиваем на слова
      words = formatWords(sentence);
      formattedSentence = formatWords(sentence);

      // Создаём кирпичики
      MakeBricks();
    } catch (error) {
      console.error("Error in InitData:", error);
    }
  };


  const formatWords = (sentence) =>
    sentence
    .trim()
    .split(/[\s,:\.]+/)
    .filter(word => word)
    .map(word => ({
        gr: extractTagName(word),
        placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0",
        value: word.trim(),
    }));

  onMount(() => {

  });


  function MakeBricks(){
      // Перемешиваем formattedSentence

      const firstElement = document.querySelector('.formatted-list span');
      if (firstElement) {
          firstElement.focus();
      }
      onToggleWord()
  }

  // Функция для перемешивания массива
  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1)); // Случайный индекс от 0 до i
          [array[i], array[j]] = [array[j], array[i]]; // Обмен элементов
      }
      return array;
  }


  function splitHtmlIntoSentencesWithInnerTags(html) {
      function removeEmojis(input) {
        const regex = emojiRegex();
        return input.replace(regex, '');
      }

      function formatTaggedText(input) {
        return input.replace(/<(\w+)>(.*?)<\/\1>/g, (match, tag, content) => {
          const words = content.split(/\s+/);
          return words.map(word => `<${tag}>${word}</${tag}>`).join(' ');
        });
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const paragraphs = doc.querySelectorAll('p');

      const sentences = Array.from(paragraphs).flatMap(p => {
      const htmlContent = formatTaggedText(removeEmojis(p.innerHTML.trim()));

        return htmlContent
          .split(/(?<!\b(?:Dr|Mr|Ms|Mrs|St))(?<=[.!?])\s+(?=<|\w|<\/\w+>)/g) // Улучшенное разделение
          .map(sentence => sentence.trim())
          .filter(sentence => sentence.length > 0);
      });

      return sentences;
  }

  // Обработчик клика на слово
  const handleClick = (word) => {
      // Присваиваем выбранное слово фокусируемому элементу
      if(formattedSentence[focusedIndex].value.toLowerCase() === word.value.toLowerCase()){

          formattedSentence[focusedIndex].word =  word.value ;
          formattedSentence[focusedIndex].class = "correct";

          // После того как слово присвоено, ищем следующий элемент для фокуса
          focusedIndex = Math.min(focusedIndex + 1, formattedSentence.length - 1);

          // Устанавливаем фокус на следующий элемент
          requestAnimationFrame(() => {
              const nextElement = document.querySelectorAll('.formatted-list span')[focusedIndex];
              if (nextElement) {
              nextElement.focus();
              }
          });

           // Проверяем, все ли слова правильно заполнены
          checkCompletion();

      }else{
          formattedSentence[focusedIndex].word =  word.value ;
          formattedSentence[focusedIndex].class = "incorrect";
      }
  };

      // Проверка завершения
  const checkCompletion = () => {
      // Если все элементы имеют класс "correct", вызываем функцию Speak
      if (formattedSentence.every(item => item.class === "correct")) {
          SpeakText(true);
      }
  };


  
  const navSentence = async(nav)=>{

    if(nav==='prev'){
      --curSentence
    }else if(nav==='next'){
      ++curSentence
    }

    current_word = 0;
    // isSTT = false;
    stt_text = ''

    if(curSentence >= bricks_data.text.length){
      curSentence = 0;
    }

    sentence = bricks_data.text[curSentence];


    const resp = await tts.GetGoogleTTS($llang, sentence.replace(/<[^>]*>/g, ''),  data.name);
      speechData = resp.resp;
      console.log('speechData:',speechData)
      // sentence = sentence;
      words = sentence.trim().split(/[\s,:\.]+/)
        .filter(word => word) // Оставляем только существующие слова
        .map((word) => ({
            gr: extractTagName(word),
            placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
            value: word.trim()
        })); 
      // Создаём массив для предложения с placeholder'ами
      formattedSentence = sentence.trim().split(/[\s,:\.]+/)
          .filter(word => word) // Оставляем только существующие слова
          .map((word) => ({
            gr: extractTagName(word),
            placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
            value: word.trim()
          }));

      // words =  Array.from(new Set(sentence.trim().split(/[\s,:\.]+/).filter(word => word !== "")))    

      MakeBricks();
  }

  const SpeakText = async (isEndSpeak) => {
      const endSpeak = ()=> {
          if(isEndSpeak===true)
          setTimeout(()=>{
            if(!isSTT)
              navSentence(++curSentence)
          },500)          
      }
      if (sentence) {
        audio = new Audio(speechData.audio);
        let  endTime;
        audio.playbackRate = 0.9;   
        if(speechData?.ts?.length>0 && focusedIndex < formattedSentence.length-1){
          audio.currentTime = speechData.ts[focusedIndex].start-.001;
          if(focusedIndex!=0)
            audio.playbackRate = 0.8;     
          // endTime =  speechData.ts[current_word+3].end
        }

        if (focusedIndex >= formattedSentence.length-1){
          audio.playbackRate = 0.9;   
          audio.currentTime  = 0;
        }

        if(!isSTT)
            audio.addEventListener('ended', function () {
              endSpeak();
              audio = '';
            });
                 
         // Отслеживание текущего времени
        //  if( false && endTime)
          audio.addEventListener('timeupdate', () => {
            let endTime;
            // if (speechData.ts.length > current_word + 5) {
            //   endTime = speechData.ts[current_word + 5].end;
            // } else if(speechData.ts.length>0){
            //   endTime = speechData.ts[speechData.ts.length].end; // Если выходит за пределы массива, берем последний элемент
            // }
            // if(audio.currentTime  >= endTime)
            //   audio.pause()
          });
         audio.play();
      } 
  }


  // Обработчик для фокуса на placeholder
  const handleFocus = (index) => {
    focusedIndex = index;
  };

  const handleFormatted = (item)=>{
      formattedSentence[focusedIndex].word =  item.word ;
      formattedSentence[focusedIndex].class = "correct";
      checkCompletion();

      // После того как слово присвоено, ищем следующий элемент для фокуса
      focusedIndex = Math.min(focusedIndex + 1, formattedSentence.length - 1);

      // Устанавливаем фокус на следующий элемент
      requestAnimationFrame(() => {
          const nextElement = document.querySelectorAll('.formatted-list span')[focusedIndex];
          if (nextElement) {
            nextElement.focus();
          }
      });        
  }

  const onToggleWord = ()=>{

    const text = bricks_data.text[curSentence];

    sentence = text.trim();

      if(!span_equal){    

        formattedSentence = sentence.split(/[\s,:\.]+/)
          .filter(word => word) // Оставляем только существующие слова
          .map((word) => ({
            gr: extractTagName(word),
            placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
            value: word.trim()
          }));

        formattedSentence.forEach((item)=>{
            item.placeholder = item.value;
            item.class = "invisible"
        });

                  // Разбиваем на слова
        words =  sentence.trim().split(/[\s,:\.]+/) 
        .filter(word => word) // Оставляем только существующие слова
        .map((word) => ({
            gr: extractTagName(word),
            placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
            value: word.trim()
        }));

      }else{

        formattedSentence = sentence.replace(/<[^>]*>/g, '').split(/[\s,:\.]+/)
          .filter(word => word) // Оставляем только существующие слова
          .map((word) => ({
            gr: extractTagName(word),
            placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
            value: word.trim()
          }));
        formattedSentence.forEach((item)=>{
            item.placeholder = "\u00a0\u00a0\u00a0\u00a0\u00a0";
            item.class = ""
        });     
        
        // Разбиваем на слова
        words =  sentence.replace(/<[^>]*>/g, '').trim().split(/[\s,:\.]+/) 
        .filter(word => word) // Оставляем только существующие слова
        .map((word) => ({
            gr: extractTagName(word),
            placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
            value: word.trim()
        }));


      }

      words = shuffleArray(words);

      formattedSentence = formattedSentence
  }

  function ToggleTranslate(){
    translate = !translate
  }

  function onClickMicrophone() {
    if (isListening) {
      stt.MediaRecorderStop();
      isListening = false;
      return;
    }

    stt.startAudioMonitoring($llang, $langs);

    // const text = dialog_data.content[cur_qa].user1[llang].replace(/[^\w\s]/gi, ''); //.split(' ');

    isListening = true;
  }

  function StopListening() {
    isListening = false;
  }

  function SttResult(text) {
    stt_text = text[$llang];

    const numbers = sentence.match(/\b\d+\b/g);
    if (numbers)
      sentence = sentence.replace(/\b\d+\b/g, numberToDutchString(numbers[0]));

    if (stt_text) {
      const similarity = compareStrings(
        sentence
          .toLowerCase()
          .trim()
          .replace(/[^\w\s]|_/g, ''),
        stt_text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s]|_/g, '') //replace(/[0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '')
      );
      stt_text += ` (${similarity.toFixed(0)}%)`;
      if (similarity > 75) {
        setTimeout(() => {
          // onNextQA();
        }, 3000);
      }
    }
  }

  function compareStrings(str1, str2) {
    // Используем алгоритм Левенштейна для вычисления расстояния между строками

    function levenshteinDistance(s, t) {
      const d = []; // Массив для хранения результатов вычислений

      // Заполняем массив нулями
      for (let i = 0; i <= s.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= t.length; j++) {
        d[0][j] = j;
      }

      // Вычисляем расстояние Левенштейна
      for (let j = 1; j <= t.length; j++) {
        for (let i = 1; i <= s.length; i++) {
          if (s.charAt(i - 1) === t.charAt(j - 1)) {
            d[i][j] = d[i - 1][j - 1];
          } else {
            d[i][j] = Math.min(
              d[i - 1][j] + 1, // удаление
              d[i][j - 1] + 1, // вставка
              d[i - 1][j - 1] + 1 // замена
            );
          }
        }
      }

      // Расстояние Левенштейна между строками находится в d[s.length][t.length]
      return d[s.length][t.length];
    }

    // Вычисляем длины строк
    const len1 = str1.length;
    const len2 = str2.length;

    // Вычисляем максимальную длину строки из двух строк
    const maxLength = Math.max(len1, len2);

    // Вычисляем расстояние Левенштейна между строками
    const distance = levenshteinDistance(str1, str2);

    // Вычисляем процент совпадения
    const similarity = (1 - distance / maxLength) * 100;

    console.log('similarityPercentage', similarity);

    // Возвращаем true, если процент совпадения больше 75, иначе false
    return similarity;
  }

  function onSTT(){
    isSTT = !isSTT
  }

  function PlayAutoContent(){

    if (!isPlayAuto) return;

    async function endSpeak() {

      async function endLangSpeak(){
        await navSentence('next');
        PlayAutoContent();
      }

      tts.Speak_server($langs, bricks_data.translate[curSentence],data.name,endLangSpeak)

    }

    if (sentence) {
        audio = new Audio(speechData.audio);
        let  endTime;
        audio.playbackRate = 0.9;   
        audio.addEventListener('ended', function () {
          endSpeak();
          audio = '';
        });
        audio.play();
    }

  }

</script>

<Tts bind:this={tts}></Tts>

{#if bricks_data?.length < 1}
  <div style="text-align:center">
    <span
      class="material-symbols-outlined"
      style="font-size: 20px; color: blue; scale:1.5;"
    >
      <CircularProgress style="height: 50px; width: 50px;" indeterminate />
    </span>
  </div>
{/if}
<div class="top-app-bar-container flexor">
  <TopAppBar bind:this={topAppBar} variant="fixed">
    <Row>
      <Section align="start">
        {#if curSentence > 0}
        <Icon
          tag="svg"
          on:click={() => { navSentence('prev') }}
          viewBox="0 0 24 24"
          style="margin:10px 5px 10px 5px; scale:1.3; width:20px; visibility: {curSentence > 0 ? 'visible' : 'hidden'}"
        >
          <path fill="white" stroke="white" stroke-width="1.5" stroke-linejoin="round" d={mdiArrowLeft} />
        </Icon>
      {:else}
        <Icon
          tag="svg"
          viewBox="0 0 24 24"

          style="margin:10px 5px 10px 5px; scale:1.3; width:20px; visibility: hidden;"
        />
      {/if}
      </Section>
      <Section align="start"> 
          <IconButton on:click={()=>{ isPlayAuto = !isPlayAuto; PlayAutoContent()}}>
            <Icon tag="svg" viewBox="0 0 24 24" style="position:absolute;margin:0px 10px 5px 10px ;scale:1.1;width:30px">
              <path fill={playAutoColor} d={mdiEarHearing} />
            </Icon>
          </IconButton>

      </Section>
      <Section align="start">
          {#if span_equal}
          <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px" fill="white"  
          on:click={() => { span_equal = !span_equal; onToggleWord(); }} >
            <!-- Верхняя полоска -->
            <rect x="2" y="4" width="8" height="2" fill="red" />
            <rect x="12" y="4" width="6" height="2" />
            <rect x="18" y="4" width="4" height="2" />
          
            <!-- Вторая полоска (разделенная на две части) -->
            <rect x="2" y="8" width="8" height="2" />
            <rect x="12" y="8" width="10" height="2" fill="orange" />
       
          
            <!-- Третья полоска -->
            <rect x="2" y="12" width="4" height="2" />
            <rect x="8" y="12" width="10" height="2" fill="black" />
            <rect x="18" y="12" width="4" height="2" />
          
            <!-- Четвертая полоска (разделенная на две части) -->
            <rect x="2" y="16" width="14" height="2" fill="green" />
            <rect x="18" y="16" width="4" height="2" />
          
            <!-- Нижняя полоска -->
            <rect x="12" y="20" width="10" height="2" fill="magenta" />
            <rect x="2" y="20" width="8" height="2" />
          </Icon>
    
          {:else}
          <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px"  fill="white"  
              on:click={()=>{span_equal = !span_equal; onToggleWord()}} >
              <!-- Верхняя полоска -->
              <rect x="2" y="4" width="14" height="2"/>
              <rect x="18" y="4" width="4" height="2" />
              <!-- Вторая полоска (разделенная на две части) -->
              <rect x="12" y="8" width="10" height="2"/>
              <rect x="2" y="8" width="8" height="2" />
              <!-- Третья полоска -->
              <rect x="2" y="12" width="20" height="2" />
              <!-- Четвертая полоска (разделенная на две части) -->
              <rect x="2" y="16" width="14" height="2"/>
              <rect x="18" y="16" width="4" height="2"  />
              <!-- Нижняя полоска -->
              <rect x="12" y="20" width="10" height="2"/>
              <rect x="2" y="20" width="8" height="2" />
          </Icon>

          {/if}

      </Section>

      <Section align="end">
        <div class="counter">
          <p>
            <span class="mdc-typography--overline" style="position:relative"
              >{1+curSentence}
              <Badge
                position="middle"
                align="bottom-end - bottom-middle"
                aria-label="unread count"
                style="position:relative;top:-30px;right:-5px;scale:.8">{bricks_data?.text.length}</Badge
              >
            </span>
          </p>
        </div>
      </Section>
      <Section align="end">
        <div>
          <IconButton
            class="material-icons"
            aria-label="Back"
            on:click={onSTT}
          >
            <Icon tag="svg" viewBox="0 0 24 24" style="position:absolute; margin:10px 5px 10px 5px; scale:1.1;width:30px">
              {#if isSTT}
                <path fill="grey" d={mdiMicrophone} />
              {:else}
                <path fill="white" d={mdiMicrophoneOutline} />
              {/if}
            </Icon>
          </IconButton>
        </div>
      </Section>
      <Section align="end">
        <Icon
          tag="svg"
          viewBox="0 0 24 24"
          style="margin:10px 5px 10px 5px; scale:1.1; width:25px"
          on:click={ToggleTranslate}
        >
        {#if translate}
          <path fill="grey" d={mdiTranslateOff}/>
        {:else}
          <path fill="white" d={mdiTranslate}/>
        {/if}
        </Icon>
      </Section>

      <Section align="end">
        <Icon
          tag="svg"
          on:click={()=>{navSentence('next')}}
          viewBox="0 0 24 24"
          style="margin:10px 5px 10px 5px; scale:1.3; width:20px;"
        >
        <path fill="white" stroke="white" stroke-width="1.5" stroke-linejoin="round" d={mdiArrowRight} />
      </Icon>
      </Section>
    </Row>
  </TopAppBar>
</div>

{#if bricks_data?.html}
  <span on:click={() => (isCollapsed = !isCollapsed)}
  style="display:block-inline;position:relative;width:80%;color: black;font-style: italic;font-size:smaller;font-family: serif;"
  >{bricks_data?.name}</span
  >
  {#if !isCollapsed}
      <div class="collapsible" in:slide={{ duration: 300 }}>
          <ConText data={bricks_data} {tts} />
      </div>
  {/if} 
{/if}

<main>
  <div>
    {#if translate}
    <div class="trans">
      <!-- Исходное предложение -->
      <!-- <p>{bricks_data.translate[curSentence]}</p> -->
      {#await Translate(sentence.replace(/<[^>]*>/g, ''), $llang, $langs) then data}
        <p>{data}</p>
      {/await}
    </div>
    {/if}
    <!-- Предложение с замененными словами -->
    {#await Translate('Составить предложение', 'ru', $langs) then data}
      <div class="title">{data}:</div>
    {/await}
      <!-- {#await Translate('(используй подсказки слов в случае необходимости)', 'ru', $langs) then data_2}
      <div class="title title2">{data_2}:</div>
      {/await} -->
    <div class="formatted-list">
      {#each formattedSentence as item, index}
        <span class={`${item.class} ${item.gr}`}
          tabindex="0" 
          on:click={() => {item.word=item.value; handleFormatted(item)}}
          on:focus={() => handleFocus(index)}>
          {@html item.word || item.placeholder}
        </span>
      {/each}
      <div class="speaker-button" on:click={SpeakText}>
        <IconButton>
          <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" d={mdiPlay} />
          </Icon>
        </IconButton>
      </div> 
    </div>
  </div>

  <div>
    <!-- Горизонтальный список слов -->
    {#await Translate('используя набор слов', 'ru', $langs) then data}
        <div class="title">{data}:</div>
    {/await}

    <div class="word-list">
      {#each words as word, index}
        <span class={word.gr} on:click={() => handleClick(words[index])}>{@html word.value}</span>
      {/each}
    </div>
  </div>



  {#if isSTT}
  {#await Translate('Check a pronanciation', 'en', $langs) then data}
    <div class="title">{data}:</div>
  {/await}
      
  <div class="margins"
    style="text-align: center; display: flex; align-items: center; justify-content: space-between;">
    <div>
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
    </div>
    <Stt
      bind:this={stt}
      {SttResult}
      {StopListening}
      bind:display_audio
    ></Stt>
  </div>
  <div style="text-align: center;  margin-top: 20px;">
    <span style="color: darkgreen;">
      {@html stt_text}
    </span>
  </div>

  {/if}

  <div style="height:200px"></div>

</main>

<style>

  :global(.mdc-top-app-bar__row){
      height:48px
  }

  :global(.mdc-icon-button){
    top:5px
  }

  .top-app-bar-container{
    position: relative;
    top:0px; 
    height: 45px;
  /* transform: scale(1.2) translate(-4%,0%);
  transform-origin: center ;  */
  }
  .hint-button {
      border: 0px;
      color: white;
      background-color: #2196f3;
      border-radius: 3px;
      padding: 8px 10px;
  }

  .invisible{
      color:transparent
  }

  .speaker-button {
    display: inline-flex;
    float: right;
    font-size: large;
    border-radius: 25px;
    margin-right: 0px;
    margin-left: 10px;
    z-index: 0;
  }

  .counter {
      position: relative;
      background-color: #f0f0f0;
      border-radius: 25px;
      width: 30px;
      height: 30px;
      top: 0px;
      left: -5px;
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
  main{
      overflow-y: auto;
      height: calc(90vh - 56px);
      margin: 0px 15px 0 15px;
  }

  .trans {
      font-size: 0.8em;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
      text-align: center;
      line-height: 1.2 !important;
  }
  .placeholder {
    border-bottom: 1px dashed #000;
    cursor: pointer;
  }

  .title {
      width: fit-content;
      margin: 5px auto; /* Центрирование второго элемента */
      margin-top: 5px;
      color: coral;
      line-height: normal;
      text-align: center;
      font-size: 0.8em;
      background-color:transparent; 
  }
  
  .word-list, .formatted-list {
    display: flex;
    text-align: center;
    margin: 10px 2px 15px 2px;
    gap: 10px;
    font-weight: 500;
    flex-wrap: wrap;
    color: rgb(67, 65, 65);
  }

  .word-list span:not(.ver):not(.subj):not(.tijd):not(.plaats):not(.adv), 
  .formatted-list span:not(.ver):not(.subj):not(.tijd):not(.plaats):not(.adv) {
    padding: 0px 6px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #f9f9f9;
    cursor: pointer;
    user-select: none;
  }

  .formatted-list span:focus {
    outline: 2px solid transparent
  }

  .correct{
      /* color:green */
  }

  .incorrect{
      color:red;
      animation: color-blink 1s infinite;
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


 .ver {
    position: relative;
    border:2px solid; 
    border-color: rgb(225, 111, 111);
    --border-color: rgb(225, 111, 111); /* Красный для .ver */
    border-radius: 5px;
    /* background-color: lightcoral; */
    padding: 0px 6px;
  } 

  .word-list .ver,.formatted-list .ver:not(.invisible){
    color: rgb(225, 111, 111); 
  }

  .subj{
    position: relative;
    border:2px solid; 
    border-color: rgb(101, 101, 192); 
    --border-color: rgb(101, 101, 192); 
    border-radius: 7px;
    /* background-color:lightskyblue; */
    padding: 0px 6px;
  } 

  .word-list .subj,.formatted-list .subj:not(.invisible){
    color: rgb(101, 101, 192); 
  }

  .tijd{
    position: relative;
    border:2px solid; 
    border-color: rgb(119, 201, 119); 
    --border-color: rgb(119, 201, 119); 
    border-radius: 5px;
    /* background-color: lightgreen; */
    padding: 0px 6px;
  } 


  .word-list .tijd,.formatted-list .tijd:not(.invisible){
    color: rgb(119, 201, 119);
  }

  .plaats{
    position: relative;
    border:2px solid; 
    border-color:  darkmagenta;
    --border-color:  darkmagenta;
    /* background-color: lightcyan ; */
    border-radius: 5px;
    padding: 0px 6px;
  } 
  .word-list .plaats,.formatted-list .plaats:not(.invisible){
    color:  darkmagenta
  }

  .adv{
    position: relative;
    border:2px solid; 
    border-color: darkmagenta;
    --border-color: darkmagenta;
    border-radius: 5px;
    padding: 0px 6px;
  }

  .word-list .adv,.formatted-list .adv:not(.invisible){
    color:  darkmagenta
  }


  /* Анимация мигания */
  @keyframes color-blink {
    0%, 100% {
      color:red;

    }
    50% {
      color:white;

    }
  }

  @keyframes border-blink {
    0%, 100% {

      box-shadow: 0 0 0px 0 var(--border-color, blue); /* Без тени */
  }
  50% {

      box-shadow: 0 0 10px 4px var(--border-color, blue); /* Тень цвета рамки */
  }
}

   /* Эффект мигания при фокусе */
   span:focus {
      /*outline: none; /* Убираем стандартный outline браузера */
      animation: border-blink 1s infinite; /* Запускает мигание */
      border-width: 2px; /* Устанавливаем ширину рамки для чёткости */
    }

      /* Стили для мобильных устройств */
  @media screen and (max-width: 767px) {
      .trans {
          font-size: 0.7em;
      }
      .word-list, .formatted-list {
          font-size: 0.9em;
          /* margin: 2px 10px; */
          padding: 0 5px
      }
      .title{
          font-size: small;
      }
  }
</style>


