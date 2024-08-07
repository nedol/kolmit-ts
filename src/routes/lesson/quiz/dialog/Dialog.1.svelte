<script lang="ts">
  import { onMount, onDestroy, getContext } from 'svelte';

  import ConText from './Dialog.Context.svelte';

  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

  import { Number2Words } from '$lib/tts/convert.nl.js';
  import { NumberString, numberToDutchString } from '$lib/tts/Listen.numbers';
  // import BottomAppBar, { Section } from '@smui-extra/bottom-app-bar';
  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar';
  import Button, { Label } from '@smui/button';
  import { Translate } from '../../../translate/Transloc';

  // import '$lib/js/talkify.js';
  // import 'talkify-tts/dist/talkify.min.js';

  import IconButton, { Icon } from '@smui/icon-button';
  import CircularProgress from '@smui/circular-progress';
  import Chip, { Set, LeadingIcon, TrailingIcon, Text } from '@smui/chips';
  import '$lib/css/Typography.scss';

  import { langs, dicts, llang, view } from '$lib/js/stores.js';
  const dict = $dicts;

  import {
    mdiPagePreviousOutline,
    mdiArrowRight,
    mdiArrowLeft,
    mdiShareVariant,
    mdiMicrophone,
    mdiMicrophoneOutline,
    mdiAccountConvertOutline,
    mdiPlay,
  } from '@mdi/js';

  import pkg from 'lodash';
  const { maxBy } = pkg;

  // import Dialog2 from './Dialog.2.svelte';
  // import RV from '/src/routes/speech/tts/RV.svelte';
  // import { Speak } from '../../../speech/tts/RV.svelte';
  import { Speak } from '/src/routes/speech/tts/VoiceRSS';
  let voice;
  import Tts from '/src/routes/speech/tts/Tts.svelte';
  import Stt from '/src/routes/speech/stt/Stt.svelte';

  const operator = getContext('operator');

  let stt: any, tts;

  let dialog_data: any;

  let isFlipped = false;

  let isRepeat = false;

  function flipCard() {
    isFlipped = !isFlipped;
    Dialog();
  }

  const visibility = ['visible', 'hidden', 'hidden'];
  let visibility_cnt = 1;

  let bottomAppBar;

  let share_mode = false;
  export let data;

  if (data.name) {
    console.log('data:',data)
    if(data.quiz !== 'dialog.client')
      init();
  }


  // translate.from = $llang;
  // translate.engine = 'google';

  // llang = data.llang;
  let showSpeakerButton = false;

  let this_user;
  let cur_html = 0;
  let cur_qa = 0;
  let q, q_shfl, a_shfl, a, d;

  let display_audio = 'none';

  let stt_text = '',
    hints = ['test'];

  let isListening = false;

  let share_button = false;
  let share_button_class = 'button_shared_false';

  let variant = 'outlined';

  import {
    lesson,
    dc_oper,
    dc_user,
    msg_user,
    msg_oper,
    call_but_status,
  } from '$lib/js/stores.js';

  let dc = $dc_oper || $dc_user;

  $: if ($msg_user) {
   
    if($msg_user.lesson){   

      dialog_data = $msg_user.lesson.dialog_data;
      isFlipped =  !dialog_data.isFlipped
      cur_qa = $msg_user.lesson.cur_qa;
      Dialog();

    }
    if ($msg_user.command === 'repeat') {
      isRepeat = true;
      setTimeout(() => {
        isRepeat = false;
      }, 2000);
    }
  }

  $: if ($msg_oper) {
    // console.log($msg_oper);
    if($msg_oper.lesson){

      dialog_data = $msg_oper.lesson.dialog_data;
      isFlipped =  !dialog_data.isFlipped;
      cur_qa = $msg_oper.lesson.cur_qa;
      Dialog();

    }
    if ($msg_oper.command === 'repeat') {
      isRepeat = true;
      setTimeout(() => {
        isRepeat = false;
      }, 2000);
    }
  }


  $: if (data.html) {
    share_mode = true;
  }

  $: if (data.cur_qa) {
    cur_qa = data.cur_qa;
  }

  $: if (q && !q[$langs]) {
    (async () => {
      q[$langs] = await Translate(q[$llang], $llang, $langs);
    })();
  }

  $: if (a && !a[$langs]) {
    (async () => {
      a[$langs] = await Translate(a[$llang], $llang, $langs);
    })();
  }

  // async function Translate(text: string, from_lang: string, to_lang: string) {
  //   try {
  //     translate.from = from_lang;

  //     return (
  //       ($dicts[text] && $dicts[text][$langs]) ||
  //       (await translate(text.trim(), to_lang))
  //     );
  //   } catch (error) {
  //     console.error('Translation error:', error);
  //     return text; // или другое подходящее значение по умолчанию
  //   }
  // }

  if (data.func) {
    onChangeUserClick();
  }

  $: switch ($call_but_status) {
    case 'talk':
      share_button = true;
      break;
    default:
      share_button = false;
      share_mode = false;
      // style_button = style_button_non_shared;
      break;
  }

  async function init() {
    function splitHtmlContent(inputString) {
      // Регулярное выражение для поиска содержимого внутри тегов <html>...</html>
      const regex = /<(?:!DOCTYPE html|html(?:\s[^>]*)?)>(.*?)<\/html>/gs;

      // Используем matchAll для поиска всех совпадений в строке
      const matches = inputString.matchAll(regex);

      // Преобразуем итератор в массив и извлекаем только содержимое внутри тегов
      const result = Array.from(matches, (match) => match[1]);

      return result;
    }

    const name = data.name;
    fetch(
      `./lesson?dialog=${data.name}&owner=${operator.abonent}&level=${data.level}`
    )
      .then((response) => response.json())
      .then((data) => {
        dialog_data = data.data.dialog;
        if (data.data.html) {
          dialog_data.html = splitHtmlContent(data.data.html);
        }
        dialog_data.name = name;
        Dialog();
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
    //
    // onClickMicrophone();
  }

  function Dialog() {
    const qa = dialog_data.content[cur_qa];
    if (!qa) {
      cur_qa = 0;
      cur_html++;
      if (dialog_data.html && !dialog_data.html[cur_html]) {
        cur_html = 0;
      }
      setTimeout(() => {
        // onChangeClick();
      }, 0);
    }

    q = isFlipped ? qa.user2 : qa.user1;

    q[$llang] = q[$llang]?.replace(
      '${user1_name}',
      $dc_user ? 'user_name' : 'Kolmit'
    );
    q[$langs] = q[$langs]?.replace(
      '${user1_name}',
      $dc_user ? 'user_name' : 'Kolmit'
    );
    q[$llang] = q[$llang]?.replace('${user2_name}', operator.name);
    q[$langs] = q[$langs]?.replace('${user2_name}', operator.name);

    q_shfl = q[$llang].slice(0);

    speak(q[$llang]);

    let ar = q_shfl
      .toLowerCase()
      .replaceAll('?', '')
      .replaceAll(',', ' ')
      .split(' ');
    // q_shfl = shuffle(ar).toString().replaceAll(',', ' ');
    a = isFlipped ? qa.user1 : qa.user2;
    a[$llang] = a[$llang]?.replace('${user2_name}', operator.name);
    a[$langs] = a[$langs]?.replace('${user2_name}', operator.name);
    a[$llang] = a[$llang]?.replace(
      '${user1_name}',
      $dc_user ? 'user_name' : 'Kolmit'
    );
    a[$langs] = a[$langs]?.replace(
      '${user1_name}',
      $dc_user ? 'user_name' : 'Kolmit'
    );

    hints = a.hints;
    dialog_data.hints = a.hints;

    a_shfl = a[$llang].slice(0);
    ar = a_shfl
      .toLowerCase()
      .replaceAll('?', '')
      .replaceAll(',', ' ')
      .split(' ');
    // a_shfl = shuffle(ar).toString().replaceAll(',', ' ');
  }

  function handleBackClick() {
    $lesson.data = { quiz: '' };
    // $lesson.visible = true;
  }

  function onNextQA() {
    // voice.Cancel();
    cur_qa++;
    visibility[1] = 'hidden';
    visibility[2] = 'hidden';
    display_audio = 'none';

    Dialog();
    SendData();
    stt_text = '';
    showSpeakerButton = false;

    // speak(q[$llang])
  }

  function onBackQA() {
    // voice.Cancel();
    cur_qa--;
    Dialog();
    SendData();
    stt_text = '';
    stt.CollectGarbage();
    // onClickMicrophone();
  }

  function onShare() {
    // Обработчик нажатия на кнопку "share"
    share_mode = !share_mode;
    share_button_class = `button_shared_${share_mode}`;
    Dialog();
    SendData();
  }

  async function SendData() {
    const dc = $dc_user || $dc_oper;
    if (share_mode && dc) {
      dialog_data.content[cur_qa].user2['a_shfl'] = a_shfl;

      await dc.SendData(
        {
          lesson: {
            llang: $llang,
            name: dialog_data.name,
            html: dialog_data.html ? dialog_data.html[cur_html] : null,
            dialog_data: dialog_data,
            cur_qa: cur_qa,
            isFlipped: isFlipped
          },
        },
        (ex) => {
          console.log(ex);
        }
      );
    }
  }

  function onChangeUserClick() {
    flipCard();

    data = {
      llang: $llang,
      html: dialog_data.html ? dialog_data.html[cur_html] : '',
      user1: dialog_data.content[cur_qa].user1,
      user2: dialog_data.content[cur_qa].user2,
      a_shfl: a_shfl,
      quiz: data.quiz,
    };
    data.quiz = data.quiz === 'dialog.client' ? 'dialog' : 'dialog.client';
    const client_quiz =
      data.quiz === 'dialog.client' ? 'dialog' : 'dialog.client';
    const dc = $dc_user || $dc_oper;

    dialog_data.content[cur_qa].user2['a_shfl'] = a_shfl;
    if (dc && share_mode)
      dc.SendData(
        {
          lesson: {
            llang: $llang,
            quiz: client_quiz,
            name: dialog_data.name,
            html: dialog_data.html ? dialog_data.html[cur_html] : '',
            user1: dialog_data.content[cur_qa].user1,
            user2: dialog_data.content[cur_qa].user2,
            cur_qa: cur_qa,
          },
        },
        () => {
          console.log();
        }
      );
  }

  function onClickQ() {
    visibility[1] = 'visible';
    showSpeakerButton = true;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function speak(text) {

    if (text) isFlipped ? Speak($llang, text) : tts.Speak($llang, text);
  }

  function onClickMicrophone() {
    if (isListening) {
      stt.MediaRecorderStop();
      isListening = false;
      return;
    }

    stt.startAudioMonitoring($llang, $langs);

    // const text = dialog_data.content[cur_qa].user1[llang].replace(/[^\w\s]/gi, ''); //.split(' ');

    isListening = true;
  }

  function StopListening() {
    isListening = false;
  }

  function SttResult(text) {
    stt_text = text[$llang];

    const numbers = dialog_data.content[cur_qa].user2[$llang].match(/\b\d+\b/g);
    if (numbers)
      dialog_data.content[cur_qa].user2[$llang] = dialog_data.content[
        cur_qa
      ].user2[$llang].replace(/\b\d+\b/g, numberToDutchString(numbers[0]));

    if (stt_text) {
      const similarity = compareStrings(
        dialog_data.content[cur_qa].user2[$llang]
          .toLowerCase()
          .trim()
          .replace(/[^\w\s]|_/g, ''),
        stt_text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s]|_/g, '') //replace(/[0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '')
      );
      stt_text += ` (${similarity.toFixed(0)}%)`;
      if (similarity > 75) {
        setTimeout(() => {
          // onNextQA();
        }, 3000);
      }
    }
  }

  function compareStrings(str1, str2) {
    // Используем алгоритм Левенштейна для вычисления расстояния между строками

    function levenshteinDistance(s, t) {
      const d = []; // Массив для хранения результатов вычислений

      // Заполняем массив нулями
      for (let i = 0; i <= s.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= t.length; j++) {
        d[0][j] = j;
      }

      // Вычисляем расстояние Левенштейна
      for (let j = 1; j <= t.length; j++) {
        for (let i = 1; i <= s.length; i++) {
          if (s.charAt(i - 1) === t.charAt(j - 1)) {
            d[i][j] = d[i - 1][j - 1];
          } else {
            d[i][j] = Math.min(
              d[i - 1][j] + 1, // удаление
              d[i][j - 1] + 1, // вставка
              d[i - 1][j - 1] + 1 // замена
            );
          }
        }
      }

      // Расстояние Левенштейна между строками находится в d[s.length][t.length]
      return d[s.length][t.length];
    }

    str1 = str1.replace('...', '');
    str2 = str2.replace('...', '');

    // Вычисляем длины строк
    const len1 = str1.length;
    const len2 = str2.length;

    // Вычисляем максимальную длину строки из двух строк
    const maxLength = Math.max(len1, len2);

    // Вычисляем расстояние Левенштейна между строками
    const distance = levenshteinDistance(str1, str2);

    // Вычисляем процент совпадения
    const similarity = (1 - distance / maxLength) * 100;

    console.log('similarityPercentage', similarity);

    // Возвращаем true, если процент совпадения больше 75, иначе false
    return similarity;
  }

  onMount(async () => {
    // style_button = style_button_non_shared;
     
  });

  function SendRepeat() {
    variant = 'unelevated';
    setTimeout(() => {
      variant = 'outlined';
    }, 1000);

    if (dc)
      dc.SendData(
        {
          command: 'repeat',
        },
        () => {
          console.log();
        }
      );
  }


  onDestroy(() => {
    // share_button = false;
    // voice.Cancel();
    dialog_data = '';
    data = '';
    stt_text = '';
    stt = '';
    tts = '';
  });
</script>

<Tts bind:this={tts}></Tts>

<!-- <RV bind:this={voice}></RV> -->

<!-- <VoiceRSS bind:this={voice}></VoiceRSS> -->
<main>

    {#if isRepeat}
      <div class="repeat_alert">
        <Button>
          <Label>{dict['Repeat'][$langs]}</Label>
        </Button>
      </div>
    {/if}
    <div class="top-app-bar-container flexor">
      <TopAppBar bind:this={bottomAppBar} variant="fixed">
        <Row>
          <Section>
            {#if cur_qa > 0}
              <Icon
                tag="svg"
                on:click={onBackQA}
                viewBox="0 0 24 24"
                style="margin-top:0px; scale:.5;width:50px"
              >
                <path fill="white" d={mdiArrowLeft} />
              </Icon>
            {:else}
              <Icon
                tag="svg"
                on:click={onBackQA}
                viewBox="0 0 24 24"
                style="visibility:hidden;margin-top:0px; scale:.5;width:50px"
              >
                <path fill="" d={mdiArrowLeft} />
              </Icon>
            {/if}
          </Section>
          <Section>
            {#if share_button && $call_but_status === 'talk'}
              <div class={share_button_class} on:click={onShare}>
                <IconButton>
                  <Icon tag="svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d={mdiShareVariant} />
                  </Icon>
                </IconButton>
              </div>
            {/if}
          </Section>

          <Section>
            <div class="flip_button" on:click={onChangeUserClick}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiAccountConvertOutline} />
                </Icon>
              </IconButton>
            </div>
          </Section>
          <Section>
            <div class="counter">
              <p><span class="mdc-typography--overline">{cur_qa + 1}</span></p>
            </div>
          </Section>
          <Section>
            <button on:click={onClickQ} class="toggleButton">
              <span class="material-symbols-outlined"> ? </span>
            </button>
          </Section>

          <Section align="end">
            <Icon
              tag="svg"
              on:click={onNextQA}
              viewBox="0 0 24 24"
              style="margin-top:0px; scale:.5; width:50px"
            >
              <path fill="white" d={mdiArrowRight} />
            </Icon>
          </Section>
        </Row>
      </TopAppBar>
    </div>
    <!-- Ваш контент для лицевой стороны -->
    <div class="card">
      {#if dc}
        <div class="repeat_but">
          <Button
            class="button-shaped-round"
            color="secondary"
            on:click={() => SendRepeat()}
            {variant}
          >
            <Label>{dict['Repeat'][$langs]}</Label>
          </Button>
        </div>
      {/if}
      {#if q || a}
        <!-- <div class="cnt">{cur_qa + 1}</div> -->
        {#await Translate('Послушай вопрос', 'ru', $langs) then data}
          <div class="title">{data}:</div>
        {/await}

        <div class="tip mdc-typography--headline6">
          {q[$llang]}
        </div>
        <div style="text-align: center;">
          <div
            class="user1 mdc-typography--headline6"
            style="visibility:{visibility[1]}"
          >
            {#if !dialog_data.content[cur_qa].user1[$langs]}
              {#await Translate(q[$llang], $llang, $langs) then data}
                {data}
              {/await}
            {:else}
              {@html q[$langs]}
            {/if}
          </div>
        </div>
        <div
          class="margins"
          style="text-align: center; display: flex; align-items: center; justify-content: space-between;"
        >
          <br />
          <!-- {#if showSpeakerButton} -->
          <div class="speaker-button">
            <IconButton on:click={speak(q[$llang])}>
              <Icon tag="svg" viewBox="0 0 24 24">
                <path fill="currentColor" d={mdiPlay} />
              </Icon>
            </IconButton>
          </div>
          <!-- {/if} -->
        </div>

        {#await Translate('Переведи и ответь', 'ru', $langs) then data}
          <div class="title">{data}:</div>
        {/await}

        <div class="user2_tr">
          {#if !a[$langs]}
            {#await Translate(a[$llang], $llang, $langs) then data}
              {data}
            {/await}
          {:else}
            {@html a[$langs]}
          {/if}
        </div>

        <div class="user2" style="visibility:{visibility[1]}">
          {@html a[$llang]}
        </div>

        <div style="text-align: center">
          <span style="color: darkgreen;">
            {@html stt_text}
          </span>
        </div>

        <div
          class="margins"
          style="text-align: center; display: flex; align-items: center; justify-content: space-between;"
        >
          <div>
            <IconButton
              class="material-icons"
              aria-label="Back"
              on:click={onClickMicrophone}
            >
              <Icon tag="svg" viewBox="0 0 24 24">
                {#if isListening}
                  <path fill="currentColor" d={mdiMicrophone} />
                {:else}
                  <path fill="currentColor" d={mdiMicrophoneOutline} />
                {/if}
              </Icon>
            </IconButton>
          </div>
          <Stt bind:this={stt} {SttResult} {StopListening} bind:display_audio
          ></Stt>

          <!-- {#if showSpeakerButton} -->
          <div class="speaker-button">
            <IconButton on:click={speak(a[$llang])}>
              <Icon tag="svg" viewBox="0 0 24 24">
                <path fill="currentColor" d={mdiPlay} />
              </Icon>
            </IconButton>
          </div>
          <!-- {/if} -->
        </div>
        <br />

        <div class="words_div accordion-container">
          {#if hints?.length > 0}
            <Content
              style="line-height: 2.0; overflow-y:auto; height:50vh !important"
            >
              {#each hints as hint, i}
                <span class="hint_button">
                  {@html hint + '&nbsp;' + '&nbsp;'}
                </span>
              {/each}
              <div style="height:50px"></div>
            </Content>
          {/if}
        </div>

        {#if dialog_data.html}
          <ConText data={dialog_data} />
          <!-- <div class="html_data">{@html dialog_data.html[cur_html]}</div> -->
          <!-- <iframe srcdoc={dialog_data.html[cur_html]} class="html_data" width="100%" height="700vh"></iframe> -->
        {/if}
      {:else}
        <div style="text-align:center">
          <span
            class="material-symbols-outlined"
            style="font-size: 20px; color: blue; scale:1.5;"
          >
            <CircularProgress
              style="height: 50px; width: 50px;"
              indeterminate
            />
          </span>
        </div>
      {/if}
    </div>
</main>

<style>
  main {
    overflow-y: clip;
    transition: transform 0.3s ease-in-out;
    width: 100vw;
    margin: 0 auto;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s;
    height: 90vh;
  }

  .repeat_alert {
    position: absolute;
    top: 85px;
    right: 0px;
    scale: 0.7;
  }

  .repeat_but {
    position: absolute;
    font-size: smaller;
    left: 0px;
    top: -15px;
    z-index: 2;
    scale: 0.7;
  }
  .top-app-bar-container {
    /* display: inline-block; */
    position: relative;
    top: 30px;
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    margin: 0 18px 18px 0;
    background-color: var(--mdc-theme-background, #fff);
    /* overflow: auto; */
  }

  .margins {
    display: flex;
    position: relative;
    justify-content: start; /* Распределяет пространство между элементами равномерно */
    height: 30px;
  }

  /* Если вы хотите добавить пространство между элементами, вы можете использовать margin */
  .margins > * {
    margin-right: 10px; /* Пример: 10px пространства между элементами */
  }

  .button_shared_true {
    position: relative;
    font-size: 1.5em;
    color: blue;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .button_shared_false {
    position: relative;
    font-size: 1.5em;
    color: grey;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .flip_button {
    position: relative;
    font-size: 1.5em;
    text-align: center;
    color: grey;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    width: 50px;
  }

  .speaker-button {
    position: relative;
    font-size: large;
    border-radius: 25px;
  }

  .html_data {
    display: grid;
    position: relative;
    overflow-y: auto;
    height: 60vh;
    margin: 0 auto;
    margin-top: 10px;
    border: 0;
  }

  .counter {
    /* position: absolute; */
    background-color: #f0f0f0;
    padding: 0px;
    border-radius: 25px;
    width: 30px;
    height: 30px;
    top: -10px;
    left: -6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .counter p {
    margin: 0;
    font-size: 15px;
    color: #333;
  }

  .counter span {
    font-weight: 700;
    font-size: 15px;
    color: #ff5733; /* цвет счетчика */
  }
  .cnt {
    position: absolute;
    text-align: left;
    left: 15px;
    top: -2px;
    z-index: 2;
    font-size: 1em;
    margin-bottom: 10px;
    color: #501d94;
  }

  .title {
    color: grey;
    position: relative;
    line-height: normal;
    text-align: center;
    margin: 5px;
    font-size: 0.8em;    
    background-color: ghostwhite;
  }

  .user1 {
    width: 100vw;
    text-align: center;
    line-height: normal;
    font-size: 0.8em;
    margin-bottom: 0px;
    color: #333;
  }

  .user2 {
    text-align: center;
    line-height: normal;
    font-size: 1em;
    margin-bottom: 0px;
    color: #2196f3;
  }

  .user2_tr {
    text-align: center;
    line-height: normal;
    font-size: 1em;
    margin-bottom: 0px;
    color: #333;
  }

  .tip {
    text-align: center;
    line-height: normal;
    font-size: 1em;
    margin-bottom: 0px;
    color: #2196f3;
  }

  .arrow-button {
    position: relative;
    top: 0px;
    /* margin: 10px */
    /* font-size: 1.5em; */
    font-weight: 600;
    background-color: white;
    color: #101c88;
    border: 1px solid;
    border-radius: 5px;
    cursor: pointer;
  }

  .arrow-button-left {
    transform: translateY(-50%);
  }

  .arrow-button-right {
    transform: translateY(-50%);
  }

  .toggleButton {
    position: relative;
    /* margin: 40px auto 0; */
    /* left: 50%; */
    background-color: #2196f3;
    color: #fff;
    border: none;

    border-radius: 5px;
    cursor: pointer;
  }

  .card {
    transition: transform 0.3s ease-in-out;
    width: 100%;
    top: 85px;
    /* border: grey solid 1px; */
    border-radius: 5px;
    margin: 0 auto;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s;
    height: calc(100vh - 23vh);
  }

  .words_div {
    position: relative;
    text-align: center;
    overflow-y: auto;
  }
  .hint_button {
    display: inline-block;
    border: solid 0.1em #9f3f3f;
    border-radius: 5px;
    text-align: center;
    width: auto;
    padding-left: 8px;
    margin: 5px;
    background-color: transparent;
  }
</style>
