<script lang="ts">
  import { onMount, getContext, onDestroy } from 'svelte';
  import { Translate } from '../../translate/Transloc';

  import IconButton, { Icon } from '@smui/icon-button';
  import Paper, { Title, Subtitle } from '@smui/paper';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

  import { langs, llang, dicts, dc_state } from '$lib/js/stores.js';

  import { mdiEarHearing } from '@mdi/js';

  export let data, quiz, tts, onToggleWord;

  let trans = '';

  let touchStartTime = 0;
  let playAutoColor = 'currentColor';

  $: if (isPlayAuto) {
    playAutoColor = 'green';
  } else {
    playAutoColor = 'currentColor';
  }
  let isPlayAuto = false;

  const style_color = `
body{
  height:110vh;
}
article {
  display: block;
  background: #f9f9f9;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}
article p {
  margin-bottom: 15px;
  color: #333;
}
  article p:last-child {
  margin-bottom: 0;
}
article subj {
  font-weight: bold;
  color: #2c3e50;
}
article ver {
  color: #e74c3c;
  font-style: italic;
}
article dirobj {
  color: #3498db;
  font-weight: bold;
}
article tijd, article plaats, article extra, article adv {
  color: #27ae60;
  font-style: italic;
}
article:hover {
  background: #ffffff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
}`;
let iframe;
    

  function onTouchStart(event) {
    // Запомните время начала касания
    touchStartTime = new Date().getTime();
  }

  async function onSelectionEnd(event) {
    let x, y;
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - touchStartTime;
    if (touchDuration >= 500) {
      if (selection && selection.toString().trim() !== '') {
        if (event.target.attributes['trans']) {
          x = rect.x;
          y = rect.y - 22 + window.scrollY;
          trans_div.style.top = `${y}px`;
          trans_div.style.left = `${x}px`;
          trans_div.style.visibility = 'visible';
          trans = event.target.attributes['trans'].nodeValue;
          await TTSSpeak(event.target.innerText);
          return;
        }

        // Выделение текста завершено
        const selectedText = selection.toString().trim();
        trans = await Translate(selectedText);
        x = rect.x;
        y = rect.y - 22 + window.scrollY;

        trans_div.style.top = `${y}px`;
        trans_div.style.left = `${x}px`;
        trans_div.style.visibility = 'visible';
      }
    }
  }

  function PlayAutoText(text) {
    isPlayAuto = !isPlayAuto;
    if (!isPlayAuto) return;


    const textAr = htmlToText(text).split(/(?<=[.!?])\s+/);
    let ind = 0;

    // Запуск последовательного процесса озвучивания
    playNext();

    // Функция для преобразования HTML в текст
    function htmlToText(html) {
      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      const styles = tempDiv.querySelectorAll('style');
      styles.forEach(style => style.remove());

      return tempDiv.textContent || tempDiv.innerText || '';
    }

    async function playNext() {
      if (!isPlayAuto || ind >= textAr.length) return;

      let originalSentence = htmlToText(textAr[ind]).split(/(?<=[.!?])\s+/)[0];
      let translatedSentence = await Translate(
        originalSentence,
        $llang,
        $langs
      ); // Вызов функции перевода

      // Озвучить перевод
      tts.Speak_server(
        $langs,
        translatedSentence.replace(/['"<>]/g, ''),
        data.name,
        onEndSpeakTranslated
      );

      async function onEndSpeakTranslated() {
        // Озвучить оригинал после перевода
        tts.Speak_server(
          $llang,
          originalSentence,
          data.name,
          onEndSpeakOriginal
        );
      }

      async function onEndSpeakOriginal() {
        ind++; // Переходим к следующему предложению
        if (ind < textAr.length) {
          playNext(); // Рекурсивно вызываем playNext для следующего предложения
        }
      }
    }
  }

  function OnLoad(){
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    if (iframeDoc) {
            // Проверяем, есть ли <head>
        if (!iframeDoc.head) {
            iframeDoc.documentElement.insertAdjacentHTML("afterbegin", "<head></head>");
        }
        const styleTag = iframeDoc.createElement("style");
        styleTag.textContent  = style_color;
        iframeDoc.head.appendChild(styleTag); // Вставляем стили в <head>
        console.log("🎨 Стили успешно добавлены!");

    } else {
        console.error("Не удалось получить contentDocument у iframe.");
    }
  }
</script>

<div>
  {#if $dc_state === 'close'}
    <div class="speaker-button">
      <IconButton
        on:click={() => {
          PlayAutoText(data.html, quiz);
        }}
      >
        <Icon tag="svg" viewBox="0 0 24 24">
          <path fill={playAutoColor} d={mdiEarHearing} />
        </Icon>
      </IconButton>
    </div>
    <iframe bind:this={iframe} class="context" srcdoc={data.html} on:load={OnLoad}></iframe>
  {/if}
</div>

<style>
  ::selection {
    /* color: rgb(27, 155, 49); */
    background: rgb(190, 201, 205);
  }

  .speaker-button {
    display: inline-flex;
    float: right;
    font-size: large;
    border-radius: 25px;
    margin-right: 0px;
    margin-left: 10px;
    z-index: 2;
  }

  iframe.context{
    position:absolute; 
    z-index: 1;
    width: 100vw;
    height: calc(100vh - 56px - 45px - 50px); 
    border:0;
    /* overflow-y:auto; */
    background-color: aliceblue;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE и Edge */
  }


  .context::-webkit-scrollbar {
    display: none; /* Для Chrome, Safari и Opera */
  }

</style>
