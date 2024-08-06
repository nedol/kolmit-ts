<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import EasySpeech from 'easy-speech';
  EasySpeech.init({
    maxTimeout: 5000,
    interval: 250,
    quiet: true,
    rate: 0.7,
  }); // required

  import bell from '$lib/mp3/bell.mp3';

  import { convertTimeToWords } from './time.convert.js';

  import { view, lesson } from '$lib/js/stores.js';

  // @ts-ignore
  let voice, tts;

  onMount(() => {
    document.addEventListener('visibilitychange', async () => {
      // await EasySpeech.reset();
      if (document.hidden) {
        await window.speechSynthesis.cancel();
        // location.reload();
      } else {
        console.log('Приложение активно');
      }
    });
  });

  export async function Speak(lang, text) {
    console.log(
      'EasySpeech.status before Speak:' + EasySpeech.status()['status']
    );

    let voices = EasySpeech.voices();

    for (let v in voices) {
      tts = { voice: voices[v] };

      if (voices[v].lang.includes('nl')) {
        tts = { voice: voices[v] };

        if (voices[v].lang.includes('BE')) {
          // utterance.voice = voices[index]; //'Microsoft Bart - Dutch (Belgium)';
          tts = { voice: voices[v] };
          break;
        }
      }
    }

    // if ('speechSynthesis' in window) {
    //   let utterance = new SpeechSynthesisUtterance(text);
    //   utterance.voice = tts.voice;
    //   // utterance.volume = parseFloat(volumeInput.value);
    //   utterance.rate = parseFloat(0.6);
    //   // utterance.pitch = parseFloat(pitchInput.value);
    //   utterance.onend = () => {
    //     window.speechSynthesis.cancel();
    //   };
    //   utterance.onerror = (event) => {
    //     console.log(
    //       `An error has occurred with the speech synthesis: ${event.error}`
    //     );
    //   };
    //   window.speechSynthesis.speak(utterance);
    // }

    text = convertTimeToWords(lang, text);

    // setTimeout(() => {
    EasySpeech.speak({
      text: text, //dialog_data.content[cur_qa].question['nl'],
      voice: tts.voice,
      volume: 1,
      rate: 0.6,
      pitch: 1.2,
      boundary: (e) => console.debug('boundary reached'),
      end: (e) => {
        window.speechSynthesis.cancel();
        console.debug('speech end');
      },
      error: async (e) => {
        console.log(e);
        EasySpeech.reset();
      },
    });
    // }, 0);
  }

  export function Cancel() {
    EasySpeech.cancel();
  }

  export function Pause() {
    EasySpeech.pause();
  }

  export function Resume() {
    EasySpeech.resume();
  }

  export async function initSpeech() {
    console.log(
      'EasySpeech.status before initSpeech:' + EasySpeech.status()['status']
    );

    // await EasySpeech.cancel()
    // await EasySpeech.reset();
    // const es_det = EasySpeech.detect();
    //  $audioCtx = new AudioContext();
    //  await EasySpeech.reset();

    document.addEventListener('visibilitychange', async () => {
      if (document.hidden) {
        // Ваш код, выполняемый при переходе приложения в неактивное состояние
        // await EasySpeech.pause();
        // await EasySpeech.cancel();
        // await EasySpeech.reset();

        // $lesson.data = { quiz: '' };
        // $view = 'lesson';
        console.log(
          'EasySpeech.status  before hidden:' + EasySpeech.status()['status']
        );
      } else {
        console.log('Приложение активно');
      }
    });
  }

  onDestroy(() => {
    // EasySpeech.cancel();
    console.log(
      'EasySpeech.status before destroy:' + EasySpeech.status()['status']
    );
  });
</script>
