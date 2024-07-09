<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import EasySpeech from '../../speech/tts/EasySpeech.svelte';

  let easyspeech;

  let audio;

  onMount(async () => {});

  export async function Speak(text) {
    // await easyspeech.initSpeech();
    // await easyspeech.Speak(text);

    Speak_server(text);
  }

  export async function Speak_server(text) {
    if (!audio || (audio && text !== audio.text)) {
      text = text.replace(/<[^>]+>.*?<\/[^>]+>/g, '');
      const par = {
        func: 'tts',
        text: text,
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
      audio.text = text;
      audio.playbackRate = 0.7;
    }
    audio.play();
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

<EasySpeech bind:this={easyspeech}></EasySpeech>
