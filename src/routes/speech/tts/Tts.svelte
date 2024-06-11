<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import EasySpeech from '/src/routes/speech/tts/EasySpeech.svelte';
  let easyspeech;


  let audio;

  onMount(() => { easyspeech.initSpeech()});

  export async function Speak(text){
     easyspeech.Speak(text);
     easyspeech.Cancel()
  }

  export async function Speak_server(text) {
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
    audio = new Audio(url.resp);
    audio.playbackRate = 0.7;
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


<EasySpeech bind:this={easyspeech}></EasySpeech>