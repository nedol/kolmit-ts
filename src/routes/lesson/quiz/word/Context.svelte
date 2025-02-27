<script lang="ts">
  import { onMount, getContext, onDestroy } from 'svelte';
  import { Translate } from '../../../translate/Transloc';

  import IconButton, { Icon } from '@smui/icon-button';
  import Paper, { Title, Subtitle } from '@smui/paper';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

  import { langs, llang, dicts, dc_state } from '$lib/stores.ts';

  import { mdiEarHearing } from '@mdi/js';

  export let data, quiz, tts;

  let trans = '';

  let touchStartTime = 0;
  let playAutoColor = 'currentColor';

  $: if (isPlayAuto) {
    playAutoColor = 'green';
  } else {
    playAutoColor = 'currentColor';
  }
  let isPlayAuto = false;

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
</script>

<div style="height:300vh; overflow-y:auto;font-size:smaller;color:#2196f3">
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
    <iframe srcdoc={data.html} width="100%" height="80%" style="border:0;overflow-y:auto"></iframe>
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
</style>
