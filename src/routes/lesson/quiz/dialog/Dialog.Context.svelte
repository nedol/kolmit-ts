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
<div  style="font-size:smaller">
{@html data.html}
</div>

<style>
  ::selection {
    /* color: rgb(27, 155, 49); */
    background: rgb(190, 201, 205);
  }


</style>
