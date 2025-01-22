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
      lesson,
      langs,
      dicts,
      llang,
      view,
      dc,
      dc_state,
      msg,
      call_but_status,
      showBottomAppBar,
      OnCheckQU,
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

      bricks_data = data.data;
    
      // Преобразуем HTML в текст и разбиваем на массив предложений
      bricks_data.text = htmlToText(bricks_data.html).replaceAll('"','').split(/(?<=[.?!])\s+/);

      InitData();

    })
    .catch((error) => {
      console.log(error);
      return [];
    });

  
   const InitData = async()=>{

    if(!bricks_data)
    return

    // Объединяем массив предложений в единый текст
    const textToTranslate = bricks_data.text.join(' ');

    // Переводим единый текст и преобразуем результат обратно в массив предложений
    bricks_data.translate = (await Translate(JSON.stringify(textToTranslate), $llang, $langs))
      .replace(/^[\"«]|[\"»]$/g, '')
      .split(/(?<=[.?!])\s+/) // Разбиваем на предложения
      .map(sentence => sentence.trim()) // Убираем лишние пробелы
      .filter(sentence => sentence !== ''); 

    sentence = bricks_data.text[curSentence].trim();

    setTimeout(async()=>{
      speechData = (await tts.GetGoogleTTS($llang, sentence,  data.name)).resp;
    },1000)


    // Разбиваем на слова
    words = sentence.trim().split(/[\s,:\.]+/)  

    // Создаём массив для предложения с placeholder'ами
    formattedSentence = words
        .filter(word => word) // Оставляем только существующие слова
        .map((word) => ({
            placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
            value: word.trim()
        }));

    words =  Array.from(new Set(sentence.trim().split(/[\s,:\.]+/).filter(word => word !== "")))
    // Устанавливаем фокус на первый элемент
    setTimeout(() => {
        MakeBricks();
    }, 0);
  }

  onMount(() => {

  });

  function MakeBricks(){
      // Перемешиваем formattedSentence
      words = shuffleArray(words);
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

  function htmlToText(html) {
      // Удаляем эмодзи с помощью библиотеки
      function removeEmojis(input) {
          const regex = emojiRegex();
          return input.replace(regex, '');
      }

      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Удаляем стили
      const styles = tempDiv.querySelectorAll('style');
      styles.forEach(style => style.remove());

      // Извлекаем текст только из <p> элементов
      const paragraphs = tempDiv.querySelectorAll('p');
      let text = Array.from(paragraphs)
          .map(p => p.textContent || p.innerText || "")
          .join(" ");
      if(!text)
          text = html;

      // Убираем эмодзи и лишние переносы строк
      return removeEmojis(text).replace(/[\n\r]+/g, " ").trim();
  }


  // Обработчик клика на слово
  const handleClick = (word) => {
      // Присваиваем выбранное слово фокусируемому элементу
      if(formattedSentence[focusedIndex].value.toLowerCase() === word.toLowerCase()){

          formattedSentence[focusedIndex].word =  word ;
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
          formattedSentence[focusedIndex].word =  word ;
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
    isSTT = false;
    stt_text = ''

    if(curSentence >= bricks_data.translate.length){
      curSentence = 0;
    }

    sentence = bricks_data.text[curSentence].trim();

    const resp = await tts.GetGoogleTTS($llang, sentence,  data.name);
      speechData = resp.resp;
      console.log('speechData:',speechData)
      // sentence = sentence;
      words = sentence.trim().split(/[\s,:\.]+/); 
      // Создаём массив для предложения с placeholder'ами
      formattedSentence = words
          .filter(word => word) // Оставляем только существующие слова
          .map((word) => ({
              placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
              value: word.trim()
          }));

      words =  Array.from(new Set(sentence.trim().split(/[\s,:\.]+/).filter(word => word !== "")))    

      MakeBricks();
  }

  const SpeakText = async (isEndSpeak) => {
      const endSpeak = ()=> {
          // clearTimeout(t);
          console.log()
          if(isEndSpeak===true)
          setTimeout(()=>{
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
            endTime = speechData.ts[current_word + 5].end;
            // if(audio.currentTime  >= endTime)
            //   audio.pause()
          });
         audio.play();
      } 

      // const t = setTimeout(()=>{
      //     endSpeak();
      // },sentence.length * 100)
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

      if(!span_equal){

          formattedSentence.forEach((item)=>{
              item.placeholder = item.value;
              item.class = "invisible"
          });
      }else{
          formattedSentence.forEach((item)=>{
              item.placeholder = "\u00a0\u00a0\u00a0\u00a0\u00a0";
              item.class = ""
          });
      }

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
            on:click={()=>{navSentence('prev')}}
            viewBox="0 0 24 24"
            style="margin:10px 5px 10px 5px; scale:.5; width:50px"
          >
            <path path fill="none" stroke="white" stroke-width="2" stroke-linejoin="round"  d={mdiArrowLeft} />
          </Icon>
        {/if}
      </Section>
      <Section align="start">
 
          <IconButton on:click={PlayAutoContent}>
            <Icon tag="svg" viewBox="0 0 24 24">
              <path fill={playAutoColor} d={mdiEarHearing} />
            </Icon>
          </IconButton>

      </Section>
      <Section align="start">
          
          <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px"  fill="white"  
              on:click={()=>{span_equal = !span_equal; onToggleWord()}} >
              <!-- Верхняя полоска -->
              <rect x="2" y="4" width="14" height="2" />
              <rect x="18" y="4" width="4" height="2" />
              <!-- Вторая полоска (разделенная на две части) -->
              <rect x="12" y="8" width="10" height="2" />
              <rect x="2" y="8" width="8" height="2" />
              <!-- Третья полоска -->
              <rect x="2" y="12" width="20" height="2" />
              <!-- Четвертая полоска (разделенная на две части) -->
              <rect x="2" y="16" width="14" height="2" />
              <rect x="18" y="16" width="4" height="2" />
              <!-- Нижняя полоска -->
              <rect x="12" y="20" width="10" height="2" />
              <rect x="2" y="20" width="8" height="2" />
          </Icon>

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
            <Icon tag="svg" viewBox="0 0 24 24">
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
        <Icon
          tag="svg"
          on:click={()=>{navSentence('next')}}
          viewBox="0 0 24 24"
          style="margin:10px 5px 10px 5px; scale:.5; width:50px;"
        >
        <path fill="none" stroke="white" stroke-width="2" stroke-linejoin="round" d={mdiArrowRight} />
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
            {#if bricks_data?.translate}
            <p>{bricks_data.translate[curSentence]}</p>
            {/if}
      </div>
    {/if}
    <!-- Предложение с замененными словами -->
    {#await Translate('Make up a sentence', 'en', $langs) then data}
      <div class="title">{data}:</div>
    {/await}
      <!-- {#await Translate('(используй подсказки слов в случае необходимости)', 'ru', $langs) then data_2}
      <div class="title title2">{data_2}:</div>
      {/await} -->
    <div class="formatted-list">
      {#each formattedSentence as item, index}
        <span class="{item.class}"
          tabindex="0" 
          on:click={() => {item.word=item.value; handleFormatted(item)}}
          on:focus={() => handleFocus(index)}>
          {item.word || item.placeholder}
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

  <div>
    <!-- Горизонтальный список слов -->
    {#await Translate('using the Set of words', 'en', $langs) then data}
        <div class="title">{data}:</div>
    {/await}

    <div class="word-list">
      {#each words as word, index}
        <span on:click={() => handleClick(words[index])}>{word}</span>
      {/each}
    </div>
  </div>

  <div style="height:200px"></div>
</main>

<style>

  :global(.mdc-top-app-bar__row){
      height:45px
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
    color: #007BFF;
  }

  .word-list span, .formatted-list span {
    padding: 0px 6px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #f9f9f9;
    cursor: pointer;
    user-select: none;
  }

  .formatted-list span:focus {
    outline: 2px solid #007BFF;
  }

  .correct{
      color:green
  }

  .incorrect{
      color:red
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

      /* Стили для мобильных устройств */
  @media screen and (max-width: 767px) {
      .trans {
          font-size: 0.7em;
      }
      .word-list, .formatted-list {
          font-size: 0.8em;
          /* margin: 2px 10px; */
          padding: 0 4px
      }
      .title{
          font-size: small;
      }
  }
</style>


