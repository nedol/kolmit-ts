<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import EasySpeech from 'easy-speech';
  import bell from '$lib/mp3/bell.mp3';

  import { audioCtx } from '$lib/js/stores.js';

  import { view, lesson } from '$lib/js/stores.js';

  let voice, tts;

  onMount(() => {
    initSpeech();
  });

  export async function Speak(text) {
    // await EasySpeech.init({
    //   maxTimeout: 10000,
    //   interval: 250,
    //   quiet: false,
    //   rate: 0.7,
    // }); // required

    // window.speechSynthesis.speak(text);


     await EasySpeech.speak({
        text: text, //dialog_data.content[cur_qa].question['nl'],
        voice: tts.voice,
        volume: 9,
        rate: 0.6,
        error: async (e) => {
          console.log(e);
        },
      });

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
    // console.log(await EasySpeech.detect());
    // await EasySpeech.cancel()
    await EasySpeech.reset();
    // const es_det = EasySpeech.detect();
    //  $audioCtx = new AudioContext();
    await EasySpeech.init({
      maxTimeout: 10000,
      interval: 250,
      quiet: false,
      rate: 0.7,
    }); // required

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

    EasySpeech.on('error', () => {
      //   EasySpeech.reset();
    });

    document.addEventListener('visibilitychange', async () => {
      if (document.hidden) {
        // Ваш код, выполняемый при переходе приложения в неактивное состояние
        // await EasySpeech.pause();
        // await EasySpeech.cancel();
        // await EasySpeech.reset();
        $lesson.data = { quiz: '' };
        $view = 'lesson';
        console.log(
          'EasySpeech.status  before hidden:' + EasySpeech.status()['status']
        );
      } else {
        // await EasySpeech.reset();
        // await EasySpeech.resume();

        await EasySpeech.init({
          maxTimeout: 10000,
          interval: 250,
          quiet: false,
          rate: 1,
        }); // required

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
