<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import EasySpeech from '../../speech/tts/EasySpeech.svelte';


  let easyspeech;

  let audio;

  onMount(async () => {});

  export async function Speak(lang,text) {

    // if ('speechSynthesis' in window) 
    try{
      // await easyspeech.Speak(lang,text);
      Speak_server(lang, text)

    }catch(ex){    
     await easyspeech.Speak(lang,text);
    }
  }

  export async function Speak_server(lang, text) {
    if (!audio || (audio && text !== audio.text)) {
      text = text.replace(/<[^>]+>.*?<\/[^>]+>/g, '');
      const par = {
        func: 'tts',
        text: text,
        lang: lang//(lang=='nl'?lang+'-BE':lang)
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
      audio.type='audio/mpeg';
      audio.text = text;
      audio.playbackRate = 0.9;
     
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
    easyspeech = '';
  });
</script>

<EasySpeech bind:this={easyspeech}></EasySpeech>
