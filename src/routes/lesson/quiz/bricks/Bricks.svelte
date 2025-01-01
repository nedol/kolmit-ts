<script>
    import { onMount , getContext} from 'svelte';
    import { slide } from 'svelte/transition';
    import ConText from '../Context.svelte';
    import { Translate } from '../../../translate/Transloc';
    import Tts from '../../../speech/tts/Tts.svelte';

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
      .then((data) => {
        console.log(data);
        bricks_data = data.data;
      
        bricks_data.text = htmlToText( bricks_data.html).split('.');
     
        sentence = bricks_data.text[cur].trim();

        // Разбиваем на слова
        words = sentence.trim().split(/\s+/);  
  
        // Создаём массив для предложения с placeholder'ами
        formattedSentence = words
            .filter(word => word) // Оставляем только существующие слова
            .map((word) => ({
                placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
                value: word.trim()
            }));



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
    }

    // Функция для перемешивания массива
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Случайный индекс от 0 до i
            [array[i], array[j]] = [array[j], array[i]]; // Обмен элементов
        }
        return array;
    }

    // Функция для преобразования HTML в текст
    function htmlToText(html) {
      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      const styles = tempDiv.querySelectorAll('style');
      styles.forEach(style => style.remove());

        // Извлекаем текст и убираем переносы строк
        const text = tempDiv.textContent || tempDiv.innerText || "";
        return text.replace(/[\n\r]+/g, " ").trim();
    }
  
    // Обработчик клика на слово
    const handleClick = (word) => {
        // Присваиваем выбранное слово фокусируемому элементу
        if(formattedSentence[focusedIndex].value === word){

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

    const SpeakText = () => {
        function endSpeak() {
            sentence = bricks_data.text[++cur].trim();
            // sentence = sentence;
            words = sentence.trim().split(/\s+/);  
                    // Создаём массив для предложения с placeholder'ами
            formattedSentence = words
                .filter(word => word) // Оставляем только существующие слова
                .map((word) => ({
                    placeholder: "\u00a0\u00a0\u00a0\u00a0\u00a0", 
                    value: word.trim()
                }));
            MakeBricks()
        }
        if (sentence) tts.Speak_server($llang, sentence, data.name, endSpeak);
    }

  
    // Обработчик для фокуса на placeholder
    const handleFocus = (index) => {
      focusedIndex = index;
    };

    const handleFormatted = (item)=>{
        formattedSentence[focusedIndex].word =  item.word ;
        formattedSentence[focusedIndex].class = "correct";
        checkCompletion();
    }
  </script>

<Tts bind:this={tts}></Tts>

<main>
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
    <div>
      <!-- Исходное предложение -->

      {#await Translate(sentence, $llang, $langs) then data}
        <p>{data}</p>
      {/await}    
    </div>
  
    <div>
      <!-- Предложение с замененными словами -->
      {#await Translate('Заполни поля, используя Набор слов', 'ru', $langs) then data}
      <div class="title">{data}:</div>
  {/await}
      {#await Translate('(используй подсказки слов в случае необходимости)', 'ru', $langs) then data_2}
      <div class="title title2">{data_2}:</div>
      {/await}
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
      {#await Translate('Набор слов', 'ru', $langs) then data}
          <div class="title">{data}:</div>
      {/await}

      <div class="word-list">
        {#each words as word, index}
          <span on:click={() => handleClick(words[index])}>{word}</span>
        {/each}
      </div>
    </div>
  </main>
  
  <style>
    main{
        margin:15px
    }
    .collapsible{
        height:100vh
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
      margin: 20px 0 20px 0;
      gap: 4px;
      flex-wrap: wrap;
      color:#007BFF
    }
  
    .word-list span, .formatted-list span {
      padding: 5px 10px;
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
  </style>
  

  