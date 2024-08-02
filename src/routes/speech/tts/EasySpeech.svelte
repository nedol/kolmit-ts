<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import EasySpeech from 'easy-speech';

  import bell from '$lib/mp3/bell.mp3';

  import { audioCtx } from '$lib/js/stores.js';

  import { view, lesson } from '$lib/js/stores.js';

  // @ts-ignore
  let voice, tts;

  initSpeech();

  onMount(() => {});

  export async function Speak(text) {
    console.log(
      'EasySpeech.status before Speak:' + EasySpeech.status()['status']
    );

    // await EasySpeech.speak({
    //   text: text, //dialog_data.content[cur_qa].question['nl'],
    //   voice: tts.voice,
    //   volume: 1,
    //   rate: 0.6,
    //   pitch: 1,
    //   boundary: e => console.debug('boundary reached'),
    //   error: async (e) => {
    //     console.log(e);
    //     EasySpeech.reset()
    //   },
    // });
    if ('speechSynthesis' in window) {
      let utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = tts.voice;
      // utterance.volume = parseFloat(volumeInput.value);
      utterance.rate = parseFloat(0.6);
      // utterance.pitch = parseFloat(pitchInput.value);
      utterance.onend = () => {
        window.speechSynthesis.cancel();
      };
      window.speechSynthesis.speak(utterance);
    }
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

    await EasySpeech.init({
      maxTimeout: 5000,
      interval: 250,
      quiet: true,
      rate: 0.7,
    }); // required

    let voices = window.speechSynthesis.getVoices();

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

    document.addEventListener('visibilitychange', async () => {
      // await EasySpeech.reset();
      if (document.hidden) {
        // Ваш код, выполняемый при переходе приложения в неактивное состояние
        window.speechSynthesis.cancel();
      } else {
        // initSpeech();
        // await EasySpeech.resume();

        console.log(
          'EasySpeech.status  after hidden:' + EasySpeech.status()['status']
        );

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
