<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import voices from './rv.voices.json';
  import { llang } from '$lib/js/stores.js';
  import pkg_l from 'lodash';
  const { find, findKey } = pkg_l;

  let voice;

  $: if($llang){
	voice = find(voices, {lang:$llang, sex:'female'})
  }

  onMount(() => {
    if (false) {
      const script = document.createElement('script');
      script.src =
        'https://code.responsivevoice.org/responsivevoice.js?key=n8TO6XTS';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        // Скрипт загружен и готов к использованию
        // Например, вы можете использовать responsiveVoice.speak()
        // responsiveVoice.enableEstimationTimeout = false;
        responsiveVoice.enableWindowClickHook();
        responsiveVoice.setDefaultVoice('Dutch Female');
        voicelist = true; //responsiveVoice.getVoices();
      };
    }
  });

  export function Speak(text) {
    if (responsiveVoice.voiceSupport()) {
      responsiveVoice.speak(text, voice.name, {
        rate: 0.8,
        onstart: StartCallback,
        onend: EndCallback,
      });

      if (responsiveVoice.utterances[0])
        responsiveVoice.utterances[0].onerror = function (event) {
          console.error('Ошибка синтеза речи: ', event.error);
          // responsiveVoice.cancel();
          // Speak(text)
        };
    }
  }

  function EndCallback() {
    // responsiveVoice.cancel();
  }

  function StartCallback() {
    console.log();
  }

  export function Pause(text) {
    responsiveVoice.pause();
  }

  export function Resume(text) {
    responsiveVoice.resume();
  }

  export function Cancel(text) {
    responsiveVoice.cancel();
  }

  onDestroy(() => {
    responsiveVoice.cancel();
  });
</script>
