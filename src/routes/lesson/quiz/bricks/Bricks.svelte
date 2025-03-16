<script lang="ts">
  import { onMount , getContext, onDestroy} from 'svelte';
  import { slide } from 'svelte/transition';
  import ConText from '../Context.svelte';
  import { Translate } from '../../../translate/Transloc';
  import Tts from '../../../speech/tts/Tts.svelte';
  import emojiRegex from 'emoji-regex';
  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar';
  import IconButton, { Icon } from '@smui/icon-button';
  import Badge from '@smui-extra/badge';
  import CircularProgress from '@smui/circular-progress';
  import Chat from '../../../operator/chat/Сhat.svelte'
  import Assistant from '../../../operator/chat/Assistant.svelte';


  import Stt from '../../../speech/stt/Stt.svelte';
  
  let isListening = false;

  let isSTT = false;

  let isChat = false;

  let topAppBar;

  let translate = false;

  let span_equal = true;

  let stt_text = '';

  let isPlayAuto = false;

  let playAutoColor = 'currentColor';

  let article_name = ''

  let stt: Stt | null = null; // Если `Stt` — это класс или компонент Svelte

  let tts: Tts | null = null; // Если `Tts` — это класс или компонент Svelte

  interface Word {
    gr: string;
    placeholder: string;
    value: string;
  }

  let words: Word[] = [];

  let isEndSpeak = true;

  let similarity:any;

// Функция для отслеживания сфокусированных элементов
let focusedIndex = 0;

interface FormattedSentence {
  gr: string;
  placeholder: string;
  value: string;
  word:string;
  class:string;
}

let formattedSentence: FormattedSentence[] = [];

interface Brick {
  id: number;
  text:{ sentence: string, article: string }[];
  name: string;
  color: string;
  size: { width: number; height: number; };
}

let bricks_data: Brick;


let isCollapsed = true;

let curSentence = 0;

// let speechData = '';
let current_word = 0;
let audio;
let display_audio:string;

let keys: string[] = [];

  export let data: string = '';

  const operator = getContext('operator');
  // Исходное предложение
  let sentence = "";

  $: if (isPlayAuto) {
      playAutoColor = 'green';
  } else {
      playAutoColor = 'currentColor';
  }

  import {
      langs,
      llang,
      showBottomAppBar
  } from '$lib/stores.ts';

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

  function extractTagName(tagString:string) {
      const match = tagString.match(/^<(\w+)/); // Находим первую часть тега
      return match ? match[1] : ''; // Возвращаем название тега или null, если не найдено
  }
  
  const InitData = async () => {
    if (!bricks_data?.text) return;

    try {


      // Собираем все предложения
      const sentences = bricks_data.text;

      // Убираем HTML-теги
      const cleanedSentences = sentences.map(sent_obj => sent_obj.sentence.replace(/<[^>]*>/g, ''));

      // Функция для разделения массива на пакеты по 5 предложений
      const chunkArray = (arr, size) =>
        arr.reduce((chunks, _, i) =>
          i % size === 0 ? [...chunks, arr.slice(i, i + size)] : chunks, []
        );


      // Проверяем наличие curSentence
      if (typeof curSentence === 'undefined' || !keys[curSentence]) {
        curSentence = 0;
      }

      // Текущее предложение
      const sentence = bricks_data.text[curSentence];

      article_name = sentence.article || '\u00a0\u00a0\u00a0\u00a0\u00a0'

      // Получение озвучки через TTS
      // const { resp } = await tts.GetGoogleTTS($llang, sentence.replace(/<[^>]*>/g, ''), data?.name);
      // speechData = resp;

      // Разбиваем на слова
      words = formatWords(sentence);
      formattedSentence = formatWords(sentence);

      // Создаём кирпичики
      setTimeout(()=>{
        MakeBricks();
      },100);


    } catch (error) {
      console.error("Error in InitData:", error);
    }
  };

  const formatWords = (sent_obj) =>
    sent_obj.sentence
    .trim()
    .split(/[\s,:\.]+/)
    .filter(word => word)
    .map(word => ({
        gr: extractTagName(word),
        placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0",
        value: word.trim(),
    }));

  onMount(() => {
    setTimeout(() => {

        $showBottomAppBar = false; //test

    }, 3000);
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


  function splitHtmlIntoSentencesWithInnerTags(html: string): { sentence: string, article: string }[] {
  // Функция для удаления эмодзи
  function removeEmojis(input: string): string {
    const regex = emojiRegex();
    return input.replace(regex, '');
  }

  // Функция для форматирования текста с тегами
  function formatTaggedText(input: string): string {
    return input.replace(/<(\w+)>(.*?)<\/\1>/g, (match, tag, content) => {
      const words = content.match(/\S+|\s+/g) || []; // Разделяем на слова + пробелы
      return words.map(word => {
        if (word.trim()) return `<${tag}>${word}</${tag}>`; // Возвращаем каждое слово внутри тега
        return word; // Оставляем пробелы
      }).join('');
    });
  }

  // Функция, проверяющая, следует ли объединить предложения
  function shouldNotSplit(text: string, index: number): boolean {
    const match = text.slice(Math.max(0, index - 10), index + 10);
    return /<(\w+)>([^<]*\b(?:[A-Z]\.[A-Z]\.)[^<]*)<\/\1>/i.test(match); // Проверка на аббревиатуры
  }

  // Разбор HTML с помощью DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const articles = doc.querySelectorAll('article, aticle');

  // Разделяем контент на предложения и добавляем их в массив
  const sentences = Array.from(articles).flatMap(article => {
    const htmlContent = formatTaggedText(removeEmojis(article.innerHTML.trim()));
    const articleName = article.getAttribute('name') || ''; // Извлекаем название статьи

    return htmlContent
      .split(/(?<!\b(?:Dr|Mr|Ms|Mrs|St|Jr|Sr))(?<=[.!?])\s+(?=<|\w|<\/\w+>)/g)
      .map((sentence, index, arr) => {
        if (index > 0 && shouldNotSplit(arr[index - 1], arr[index - 1].length)) {
          return arr[index - 1] + ' ' + sentence; // Объединяем предложения, если их не следует разделять
        }
        return sentence;
      })
      .filter(sentence => sentence.length > 0)
      .map(sentence => ({
        sentence,
        article: articleName // Добавляем название статьи
      }));
  });

  return sentences;
}


  // Обработчик клика на слово
  const handleClick = (word:string) => {
      // Присваиваем выбранное слово фокусируемому элементу
      if(formattedSentence[focusedIndex].value.toLowerCase().replace(/<[^>]*>/g, '') === word.value.toLowerCase().replace(/<[^>]*>/g, '')){

          formattedSentence[focusedIndex].word =  word.value ;
          formattedSentence[focusedIndex].class = "correct";

          // После того как слово присвоено, ищем следующий элемент для фокуса
          if(formattedSentence.length-1 > focusedIndex){
            focusedIndex = Math.min(focusedIndex + 1, formattedSentence.length - 1);
          }

          // Устанавливаем фокус на следующий элемент
          requestAnimationFrame(() => {
              const nextElement = document.querySelectorAll('.formatted-list span')[focusedIndex];
              if (nextElement) {
              nextElement.focus();
              }
          });

           // Проверяем, все ли слова правильно заполнены
          setTimeout(()=>{
            checkCompletion();
          },100) 
        

      }else{
          formattedSentence[focusedIndex].word =  word.value ;
          formattedSentence[focusedIndex].class = "incorrect";
      }
  };

      // Проверка завершения
  const checkCompletion = () => {
      // Если все элементы имеют класс "correct", вызываем функцию Speak
      if (formattedSentence.every(item => item.class === "correct")) {
          SpeakText();
      }
  };
  
  const navSentence = async(nav)=>{

    if(nav==='prev'){
      --curSentence
    }else if(nav==='next'){
      ++curSentence
    }

    current_word = 0;
    focusedIndex = 0;
    stt_text = ''
    similarity = ''


    if(curSentence >= bricks_data.text.length){
      curSentence = 0;
    }

    sentence = bricks_data.text[curSentence].sentence;
    article_name = bricks_data.text[curSentence].article || '\u00a0\u00a0\u00a0\u00a0\u00a0'

    // const resp = await tts.GetGoogleTTS($llang, sentence.replace(/<[^>]*>/g, ''),  data.name);
    //   speechData = resp.resp;
    //   console.log('speechData:',speechData)
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

  function getCorrectSpanString(isCorrect){
    const elements = document.querySelectorAll(isCorrect?".formatted-list > .correct":".formatted-list > span:not(.correct)");
    return Array.from(elements)
    .map(el => el.getAttribute('value')?.trim() || "")
    .join(" ");;
  }

  const SpeakText = async () => {

    async function onEndSpeak() {
          endSpeak();
          audio = '';
        }

      const endSpeak = ()=> {
          if(isEndSpeak===true)
          setTimeout(()=>{
            if(!isSTT)
              navSentence(++curSentence)
          },500)   
          isEndSpeak = true;       
      }

      const textToSpeak = getCorrectSpanString(isSTT || formattedSentence.every(item => item.class === "correct"));

      if (textToSpeak) {

        tts.Speak_server($llang, textToSpeak, '', onEndSpeak);
    
        // const speechData = resp.resp;
        // audio = new Audio(speechData.audio);
        // let  endTime;
        // audio.playbackRate = 0.9;   
  

        // if (focusedIndex >= formattedSentence.length-1){
        //   audio.playbackRate = 0.9;   
        //   audio.currentTime  = 0;
        // }
      }

  }


  // Обработчик для фокуса на placeholder
  const handleFocus = (index) => {
    // focusedIndex = index;
  };

  const handleFormatted = (item, index)=>{

    if(formattedSentence[index].class === "correct"){
      formattedSentence[index].class= 'incorrect';
      formattedSentence[index].word =  "\u00a0\u00a0\u00a0\u00a0\u00a0";
      return;
    }

    if(formattedSentence[index].value ===  item.word){
      formattedSentence[index].word = item.word;
      formattedSentence[index].class = "correct";
          // После того как слово присвоено, ищем следующий элемент для фокуса
      focusedIndex = Math.min(index + 1, formattedSentence.length - 1);
    }
    setTimeout(()=>{
      checkCompletion();
    },100)

    // // Устанавливаем фокус на следующий элемент
    requestAnimationFrame(() => {
        const nextElement = document.querySelectorAll('.formatted-list span')[focusedIndex];
        if (nextElement) {
          nextElement.focus();
        }
    });        
  }

  const onToggleWord = ()=>{

    const sent_obj = bricks_data.text[curSentence];

    sentence = sent_obj.sentence.trim();

      if(!span_equal){    

        formattedSentence = sentence.split(/[\s:\.]+/)
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
        words =  sentence.trim().split(/[\s:\.]+/) 
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
      stt_text = ''
      stt.MediaRecorderStop();
      isListening = false;
      return;
    }

    stt_text = ''

    stt.startAudioMonitoring($llang, $langs);

    // const text = dialog_data.content[cur_qa].user1[llang].replace(/[^\w\s]/gi, ''); //.split(' ');

    isListening = true;
  }

  function StopListening() {
    isListening = false;
  }

  function SttResult(text) {
    stt_text = text[$llang];
    const correct_str = getCorrectSpanString(true);
    let sent_compare = correct_str;

    const numbers = sent_compare.match(/\b\d+\b/g);
    if (numbers)
      sent_compare = sent_compare.replace(/\b\d+\b/g, numberToDutchString(numbers[0]));

    const numbers2 = stt_text.match(/\b\d+\b/g);
    if(numbers2)
      stt_text = stt_text.replace(/\b\d+\b/g, numberToDutchString(numbers2[0]));

      if (stt_text) {
      similarity = compareStrings(
        sent_compare
          .toLowerCase()
          .trim()
          .replace(/[^\w\s]|_/g, ''),
        stt_text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s]|_/g, '') //replace(/[0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '')
      );
      similarity = `${similarity.toFixed(0)}%`;
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

  const toNextArticle = ()=>{

      const arr=bricks_data.text;
      if (curSentence < 0 || curSentence >= arr.length) return null;

      similarity = ''
      
      let currentArticle = arr[curSentence].article;
      
      for (let i = curSentence + 1; i < arr.length; i++) {
          if (arr[i].article !== currentArticle) {
            curSentence=i;
            MakeBricks()
            article_name = arr[i].article;
            return;
          }
      }
      // Если нет следующего объекта с другим article
      curSentence = 0;
      MakeBricks()
      article_name = arr[0].article;
      return; 
  }
  
  onDestroy(async()=>{
    $showBottomAppBar = true;
  })
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
            <span class="mdc-typography--overline" style="position:relative;letter-spacing: -1.5px;"
              >{1+curSentence}
              <Badge

                position="middle"
                align="bottom-end - bottom-middle"
                aria-label="unread count"
                style="position:relative;top:-32px;right:-10px;scale:.8;letter-spacing: -1.5px;">{bricks_data?.text.length}</Badge
              >
            </span>
          </p>
        </div>
      </Section>
      <Section align="end">
        <div>
        <IconButton on:click={()=>{ isPlayAuto = !isPlayAuto; PlayAutoContent()}} >
          <Icon tag="svg" viewBox="0 0 24 24" style="visibility:hidden;display:absolute;margin:0px 10px 5px 10px ;scale:1.1;width:30px">
            <path fill={playAutoColor} d={mdiEarHearing} />
          </Icon>
        </IconButton>        
      </div>
      <div on:click={()=>{isChat=!isChat}}>
        <Assistant></Assistant> 
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

<div class="card">

{#if bricks_data?.html}
  <div class="bricks-header">
    <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px" fill="grey"> 
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20px" height="20px">
        <rect x="3" y="3" width="8" height="3"></rect>
        <rect x="13" y="3" width="8" height="3"></rect>
        <rect x="3" y="8" width="4" height="3"></rect>
        <rect x="9" y="8" width="6" height="3"></rect>
        <rect x="17" y="8" width="4" height="3"></rect>
        <rect x="3" y="13" width="8" height="3"></rect>
        <rect x="13" y="13" width="8" height="3"></rect>
        <rect x="3" y="18" width="4" height="3"></rect>
        <rect x="9" y="18" width="6" height="3"></rect>
        <rect x="17" y="18" width="4" height="3"></rect>
      </svg>
    </Icon>
    <span class="bricks_name" on:click={() => (isCollapsed = !isCollapsed)}>
      {bricks_data?.name}
    </span>
  </div>

  {#if !isCollapsed}
    <div class="collapsible" in:slide={{ duration: 300 }}>
      <ConText data={bricks_data} {tts} {onToggleWord} />
    </div>
  {/if} 
{/if}

  <span class='article' on:click={toNextArticle}>{article_name}</span>
  <div>
    {#if translate}
    <div class="trans">
      <!-- Исходное предложение -->
      <!-- <p>{bricks_data.translate[curSentence]}</p> -->
      {#await Translate(sentence.replace(/<[^>]*>/g, ''), $llang, $langs,data.name) then data}
        <p>{data}</p>
      {/await}
    </div>
    {/if}
    <div class="container">
      <!-- Предложение с замененными словами -->
      {#await Translate('Составить предложение', 'ru', $langs,data.name) then data}
        <div class="title">{data}:</div>
      {/await}
      <!-- {#await Translate('(используй подсказки слов в случае необходимости)', 'ru', $langs) then data_2}
      <div class="title title2">{data_2}:</div>
      {/await} -->
    <div class="formatted-list">
      {#each formattedSentence as item, index}
        <span class={`${item.class} ${item.gr}`}
          tabindex="0" 
          value={item.value.replace(/<[^>]*>/g, '')}
          on:click={() => {item.word=''; focusedIndex=index;handleFormatted(item, index)}}
          on:focus={() => handleFocus(index)}>
          {@html item.word || item.placeholder}
        </span>
      {/each}
      {#if !isSTT || (isSTT && formattedSentence.some(item => item.class === "correct"))}
        <div class="speaker-button" on:click={()=>{isEndSpeak=false; SpeakText()}}>
          <IconButton>
            <Icon tag="svg" viewBox="0 0 24 24">
              <path fill="currentColor" d={mdiPlay} />
            </Icon>
          </IconButton>
        </div> 
      {/if}
    </div>
  </div>
</div>
<div class="container">
  <div>
    <!-- Горизонтальный список слов -->
    {#await Translate('используя набор слов', 'ru', $langs,data.name) then data}
        <div class="title">{data}:</div>
    {/await}

    <div class="word-list">
      {#each words as word, index}
        <span class={word.gr} on:click={() => handleClick(words[index])}>{@html word.value}</span>
      {/each}
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

  {#if similarity}
    <div class="similarity">
      <p>
        <span class="mdc-typography--overline" style="position:relative"
          >{similarity}
        </span>
      </p>
    </div>
  {/if}

  {/if}

  {#if isChat}
    <Chat quiz={data}></Chat>
  {/if}

  <div style="height:100px"></div>

</div>

<style>

  :global(.mdc-top-app-bar__row){
      height:48px
  }

  :global(.mdc-icon-button){
    top:5px;
    padding: 1px;
    margin: 0px;
    width: 25px;
    height: 25px;
  }
  .top-app-bar-container{
    position: relative;
    top:0px; 
    height: 45px;
  /* transform: scale(1.2) translate(-4%,0%);
  transform-origin: center ;  */
  }

  .card {
    transition: transform 0.3s ease-in-out;
    transform-style: preserve-3d;
    transition: transform 0.5s;
    top: 10px;
    overflow-y: auto;
    border-radius: 5px;
    margin: 0 auto;
    position: relative;
    height: calc(100vh - 80px);
    margin-left: 10px;
    margin-right: 10px;
  }

  .container {
    /* display: flex; */
    top: 15px;
    margin-bottom: 15px;
    position: relative;
    justify-content: space-between;
    align-items: center;
    border: 1px solid lightgrey;
    border-radius: 5px;
  }
  .hint-button {
      border: 0px;
      color: white;
      background-color: #2196f3;
      border-radius: 3px;
      padding: 8px 10px;
  }

  .bricks-header {
    display: flex;
    align-items: center;
    gap: 10px; /* Отступ между элементами */
  }


  .bricks_name{
    position:relative;
    margin: 10px;
    width:80%;
    color: black;
    font-style: italic;
    font-size: small;
    font-family: serif;
  }

  .invisible{
      color:transparent
  }

  .article{
    display: flex;;
    justify-content: center;
    align-items: center;
    height: 3vh;
    color: #2196f3;
    font-style: italic;
    font-size: small;
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
      margin: 5px; 

      color: #9eb2cc;
      line-height: normal;
      text-align: left;
      font-size: 0.8em;
      background-color:transparent; 
  }
  
  .word-list {
    display: flex;
    justify-content: center;
    margin: 10px 2px 15px 2px;
    gap: 10px;
    font-weight: 500;
    flex-wrap: wrap;
    color: #2196f3;
  }

  .formatted-list {
    display: flex;
    justify-content: center;
    margin: 10px 2px 15px 2px;
    gap: 10px;
    font-weight: 700;
    flex-wrap: wrap;
    color: #2196f3;
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

  .word-list span{
      border-color: lightgray;
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

  .similarity  p {
    margin: 0;
    font-size: 15px;
    color: #333;
  }
  .similarity {
    /* display: flex
; */
    /* justify-content: center; */
    position: relative;
    margin: 0 auto;
    background-color: #f0f0f0;
    padding: 0px;
    border-radius: 20px;
    width: 50px;
    height: 30px;
    /* float: right; */
    /* bottom: 10px; */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .similarity  span {
    font-weight: 700;
    font-size: 15px;
    color: #2ca838; /* цвет счетчика */
    text-align: center;
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
    border-color: rgb(49, 49, 169); 
    --border-color: rgb(49, 49, 169); 
    border-radius: 7px;
    /* background-color:lightskyblue; */
    padding: 0px 6px;
  } 

  .word-list .subj,.formatted-list .subj:not(.invisible){
    color: rgb(49, 49, 169); 
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

      box-shadow: 0 0 0px 0 var(--border-color, rgb(124, 124, 139)); /* Без тени */
  }
  50% {

      box-shadow: 0 0 10px 4px var(--border-color, rgb(124, 124, 139)); /* Тень цвета рамки */
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


