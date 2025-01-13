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

    let topAppBar;
    let currentWordIndex = 0;

    let span_equal = true;

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
        mdiFormatAlignLeft,
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

    let stt, tts;
    // Разделяем предложение на слова
    let words = [];
  
  // Функция для отслеживания сфокусированных элементов
  let focusedIndex = 0;

  // Разделение предложения на placeholder'ы
  let formattedSentence = [];

  let bricks_data;

  let isCollapsed = true;

  let cur = 0;

    export let data;
    const operator = getContext('operator');
    // Исходное предложение
    let sentence = "Dit is een voorbeeldzinxx voor het oefenen van Nederlands.";

    fetch(
      `./lesson?bricks=${data.name}&theme=${data.theme}&owner=${operator.abonent}&level=${data.level}`
    )
      .then((response) => response.json())
      .then(async (data) => {

        bricks_data = data.data;
      
        // Преобразуем HTML в текст и разбиваем на массив предложений
        bricks_data.text = htmlToText(bricks_data.html).replaceAll('"','').split(/(?<=[.?!])\s+/);

        // Объединяем массив предложений в единый текст
        const textToTranslate = bricks_data.text.join(' ');

        // Переводим единый текст и преобразуем результат обратно в массив предложений
        bricks_data.translate = (await Translate(JSON.stringify(textToTranslate), $llang, $langs))
        .replace(/^[\"«]|[\"»]$/g, '')
        .split(/(?<=[.?!])\s+/) // Разбиваем на предложения
        .map(sentence => sentence.trim()) // Убираем лишние пробелы
        .filter(sentence => sentence !== ''); 
     
        sentence = bricks_data.text[cur].trim();

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

      })
      .catch((error) => {
        console.log(error);
        return [];
      });

  
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
            SpeakText();
        }
    };

    
    const nextSentence = ()=>{

      cur++;

      if(cur>bricks_data.translate.length-1)
        cur = 0;

      sentence = bricks_data.text[cur].trim();
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

    const SpeakText = async () => {
        function endSpeak() {
            // clearTimeout(t);
            setTimeout(()=>{
              nextSentence()
            },1000)    
           
        }
        if (sentence) await tts.Speak_server($llang, sentence, data.name, endSpeak);

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

  </script>

<Tts bind:this={tts}></Tts>
<div class="top-app-bar-container flexor">
    <TopAppBar bind:this={topAppBar} variant="fixed">
      <Row>
        <Section align="start">
          <!-- {#if currentWordIndex > 0}
            <Icon
              tag="svg"
              on:click={onPrev}
              viewBox="0 0 24 24"
              style="margin:10px 5px 10px 5px; scale:.5; width:50px"
            >
              <path fill="white" d={mdiArrowLeft} />
            </Icon>
          {/if} -->
        </Section>
        <Section align="start">

        </Section>
        <Section>
            
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
                >{cur+1}
                <Badge
                  position="middle"
                  align="bottom-end - bottom-middle"
                  aria-label="unread count"
                  style="margin-right:-10px;scale:.8">{bricks_data?.text.length}</Badge
                >
              </span>
            </p>
          </div>
        </Section>
        <Section align="end">

        </Section>
        <Section align="end">

        </Section>

        <Section align="end">
          <Icon
            tag="svg"
            on:click={nextSentence}
            viewBox="0 0 24 24"
            style="margin:10px 5px 10px 5px; scale:.5; width:50px"
          >
          <path fill="green" d={mdiArrowRight} />
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
      <div class="trans">
            <!-- Исходное предложение -->
            {#if bricks_data?.translate}
            <p>{bricks_data.translate[cur]}</p>
            {/if}
      </div>
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
      </div>
    </div>
  
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
      gap: 4px;
      flex-wrap: wrap;
      color:#007BFF
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
            margin: 2px 10px;
            padding: 0 4px
        }
        .title{
            font-size: small;
        }
    }
  </style>
  

  