

  import bell from '$lib/mp3/bell.mp3';

  import { audioCtx } from '$lib/js/stores.js';

import { langs } from '$lib/js/stores.js';

let $lang;

langs.subscribe((data) => {
  $lang = data;
});


  // @ts-ignore
let voice, tts;
  
import EasySpeech from 'easy-speech';

const es = EasySpeech.detect();

EasySpeech.init({ maxTimeout: 5000, interval: 250 })
  .then(() => console.debug('load complete'))
  .catch((e) => console.error(e));


    // console.log(await EasySpeech.detect());



export async function Speak(lang, text, cb) {
    
    // console.log(
    //   'EasySpeech.status before Speak:' + EasySpeech.status()['status']
    // );

    // if ('speechSynthesis' in window) {
    //   let utterance = new SpeechSynthesisUtterance(text);
    //   utterance.voice = tts.voice;
    //   // utterance.volume = parseFloat(volumeInput.value);
    //   utterance.rate = parseFloat(.6);
    //   // utterance.pitch = parseFloat(pitchInput.value);
    //   utterance.onend = ()=>{
    //      window.speechSynthesis.cancel()
    //    }
    //   window.speechSynthesis.speak(
    //     utterance
    //   )

    // }else{
    //   alarm('problem')
    // }

    // es.speechSynthesisUtterance?.onend =>{
    //   console.log()
    // }



      initSpeech(lang);
    
      if (!tts.voice.lang.includes(lang)) {
        cb(false);
        return;
      }
    

      EasySpeech.speak({
        text: text, //dialog_data.content[cur_qa].question['nl'],
        voice: tts.voice,
        volume: 9,
        rate: tts.voice.lang.includes($lang)?1:0.7,
        pitch: 1,
        boundary: (e) => console.debug('boundary reached'),
        end: async (e) => {
          tts.voice = ''
          cb(true);
        
        },
        error: async (e) => {
          tts.voice = '';
          // alert('error')
          cb(false)
        },
      });



    // EasySpeech.reset();
  }


  function initSpeech(lang) {

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
      } else if (voices[v].lang.includes(lang)) {
        tts = { voice: voices[v] };
        break;
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


