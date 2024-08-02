<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  // import EasySpeech from 'easy-speech';

  import bell from '$lib/mp3/bell.mp3';

  import { audioCtx } from '$lib/js/stores.js';

  import { view, lesson } from '$lib/js/stores.js';

  // @ts-ignore
  let voice, tts;

  onMount(async () => {
    // console.log(await EasySpeech.detect());
    initSpeech();
  });

  export async function Speak(text) {
    // console.log(
    //   'EasySpeech.status before Speak:' + EasySpeech.status()['status']
    // );

    if ('speechSynthesis' in window) {
      let utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = tts.voice;
      // utterance.volume = parseFloat(volumeInput.value);
      utterance.rate = parseFloat(.6);
      // utterance.pitch = parseFloat(pitchInput.value);
      utterance.onend = ()=>{
         window.speechSynthesis.cancel()
       }
      window.speechSynthesis.speak(
        utterance
      )

    }



    // EasySpeech.speak({
    //   text: text, //dialog_data.content[cur_qa].question['nl'],
    //   voice: tts.voice,
    //   volume: 9,
    //   rate: 0.6,
    //   pitch: 1,
    //   boundary: (e) => console.debug('boundary reached'),
    //   error: async (e) => {
    //     console.log(e);
    //     EasySpeech.reset();
    //   },
    // });

    // EasySpeech.reset();
  }


  export async function initSpeech() {

    const voices =  window.speechSynthesis.getVoices()

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

      } else {


        console.log('Приложение активно');
      }
    });
  }

  onDestroy(() => {


  });
</script>
