<script lang="ts">
  import { onMount, getContext, onDestroy } from 'svelte';
  import translate from 'translate';

  import Paper, { Title, Subtitle } from '@smui/paper';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

  import { langs, llang, dicts } from '$lib/js/stores.js';

  export let data;

  let trans = '';

  let touchStartTime = 0;

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

  async function Translate(text: string, from_lang: string, to_lang: string) {
    try {
      translate.from = from_lang;

      return (
        ($dicts[text] && $dicts[text][to_lang]) ||
        (await translate(text.trim(), to_lang))
      );
    } catch (error) {
      console.error('Translation error:', error);
      return text; // или другое подходящее значение по умолчанию
    }
  }
</script>

<!-- <main> -->
<!-- <Paper> -->
<!-- <Title></Title>
    <Subtitle></Subtitle> -->
<!-- <Content> -->
<iframe srcdoc={data.html} class="html_data" width="100%" height="100vh"
></iframe>

<!-- <div
        
        on:touchend={onSelectionEnd}
        on:mouseup={onSelectionEnd}
      >
        {@html data.html}
      </div> -->
<!-- </Content> -->
<!-- </Paper> -->
<!-- </main> -->

<style>
  main {
    text-align: center;
    width: 98vw;
    margin: 0 auto;
  }
  #translationOverlay {
    display: block;
    position: absolute;
    line-height: 2.2;
    width: 70%;
    word-wrap: break-word;
    right: 5px;
    /* padding: 5px; */
    /* white-space: nowrap; */
    font-size: small;
    height: auto;
    color: green;
    visibility: hidden;
  }

  .html_data {
    display: grid;
    position: relative;
    overflow-y: auto;
    height: 70vh;
    margin: 0 auto;

    border: 0;
  }

  .context_div {
    line-height: 2.2;
    justify-content: center;
  }

  .accordion-container {
    margin-top: 40px;
  }

  .text_container {
    width: 90vw;
    line-height: 50px;
    /* font-weight: 100; */
    margin: 0 auto;
    text-align: justify;
    height: 140vh;
  }
  .speaker_div {
    position: fixed;
    right: 12px;
    top: 10vh;
    z-index: 2;
    border: darkgrey solid 1px;
    border-radius: 25px;
  }

  ::selection {
    /* color: rgb(27, 155, 49); */
    background: rgb(190, 201, 205);
  }


</style>
