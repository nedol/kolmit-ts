<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { langs } from '$lib/js/stores.js';

  import {Speak} from './EasySpeech.js';

  // let easyspeech;

  let audio;

  onMount(async () => {
    // await easyspeech.initSpeech();
  });

  export async function Speak_google(lang, text, cb_end) {
    if (!audio || (audio && text !== audio.text)) {
      text = text.replace(/<[^>]+>.*?<\/[^>]+>/g, '');
      const par = {
        func: 'tts',
        text: text,
        lang: lang, //(lang=='nl'?lang+'-BE':lang)
      };

      const response = await fetch('/speech/tts', {
        method: 'POST',
        body: JSON.stringify({ par }),
        // header: { 'Content-Type': 'audio/ogg' }
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const url = await response.json(); //URL.createObjectURL(response);
      // Пример того, как можно воспроизвести полученный аудиофайл

      audio = new Audio(url.resp.audio);
      audio.type = 'audio/mpeg';
      audio.text = text;
      audio.playbackRate = lang === $langs ? 1 : 0.9;
    }

    if (cb_end)
      audio.addEventListener('ended', function () {
        cb_end();
        audio = '';
      });
    audio.playbackRate = lang === $langs ? 1 : 0.9;
    audio.play();
  }

  export async  function Speak_server(lang, text, cb_end) {

    async function onEnd(res){
      if(!res){
        await Speak_google(lang, text, cb_end);
       
      }
      else{
        cb_end();
      }
    }
    await Speak(lang, text, onEnd);
     
  }

  export function CollectGarbage() {}

  export function Cancel() {}

  export function Pause() {}

  export function Resume() {}

  export async function initSpeech() {}

  onDestroy(() => {
    audio = '';
    easyspeech = ''
  });
</script>

<!-- <EasySpeech bind:this={easyspeech}></EasySpeech> -->
