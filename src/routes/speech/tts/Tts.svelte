<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { langs } from '$lib/stores.ts';

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



  export async function Speak_server(lang, text, quiz, cb_end) {
    try {
        const key = `tts_${lang}_${btoa(text)}`; // Создаём уникальный ключ для localStorage
        let audioSrc = localStorage.getItem(key);

        if (!audioSrc) {
            // Если аудиофайл отсутствует в localStorage, запрашиваем у GetGoogleTTS
            const resp = await GetGoogleTTS(lang, text, quiz);
            if (!resp || !resp.resp?.audio) {
                console.error("Ошибка: аудиофайл не получен.");
                return;
            }

            audioSrc = resp.resp.audio;
            localStorage.setItem(key, audioSrc); // Сохраняем в localStorage
        }

        let audio = new Audio(audioSrc);
        audio.type = 'audio/mpeg';
        audio.text = text;
        audio.playbackRate = lang === 'en' ? 1 : 0.9;

        if (cb_end) {
            audio.addEventListener('ended', cb_end);
        }

        audio.play();
    } catch (error) {
        console.error("Ошибка в Speak_server:", error);
    }
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

