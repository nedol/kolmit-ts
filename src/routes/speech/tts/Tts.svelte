<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { langs } from '$lib/js/stores.js';

  let audio;

  onMount(async () => {

  });

  export async function GetGoogleTTS(lang, text, quiz){

    if (!audio || (audio && text !== audio.text)) {
      text = text.replace(/<[^>]+>.*?<\/[^>]+>/g, '');
      const par = {
        func: 'tts',
        text: text,
        lang: lang, //(lang=='nl'?lang+'-BE':lang)
        quiz: quiz
      };

      const response = await fetch('/speech/tts', {
        method: 'POST',
        body: JSON.stringify({ par }),
        // header: { 'Content-Type': 'audio/ogg' }
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      return await response.json(); //URL.createObjectURL(response);
    }
  }



  export async  function Speak_server(lang, text, quiz, cb_end) {

    const resp = await GetGoogleTTS(lang, text, quiz);

    audio = new Audio(resp.resp.audio);
      audio.type = 'audio/mpeg';
      audio.text = text;
      audio.playbackRate = lang === $langs ? 1 : 0.9;
      if(cb_end)
      audio.addEventListener('ended', function () {
        cb_end();
      });
      audio.play();
  }

  export function CollectGarbage() {}

  export function Cancel() {}

  export function Pause() {}

  export function Resume() {}

  export async function initSpeech() {}

  onDestroy(() => {
    audio = '';
  });
</script>

