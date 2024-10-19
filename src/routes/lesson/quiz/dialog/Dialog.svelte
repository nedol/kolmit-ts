<script lang="ts">
  import { onMount, onDestroy, getContext } from 'svelte';

  import ConText from './Dialog.Context.svelte';

  import { Number2Words } from '$lib/tts/convert.nl.js';
  import { NumberString, numberToDutchString } from '$lib/tts/Listen.numbers';
  // import BottomAppBar, { Section } from '@smui-extra/bottom-app-bar';

  //  import '$lib/css/_Colored.scss';

  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar';
  import Button, { Label } from '@smui/button';
  import Badge from '@smui-extra/badge';
  import IconButton, { Icon } from '@smui/icon-button';

  import { Translate } from '../../../translate/Transloc';

  // import {  RemoveQuizUser} from '../../Module.svelte'

  import CircularProgress from '@smui/circular-progress';
  import Chip, { Set, LeadingIcon, TrailingIcon, Text } from '@smui/chips';
  import '$lib/css/Typography.scss';

  import {
    lesson,
    langs,
    dicts,
    llang,
    view,
    dc_oper,
    dc_user,
    dc_oper_state,
    dc_user_state,
    msg_user,
    msg_oper,
    call_but_status,
    showBottomAppBar,
    OnCheckQU,
  } from '$lib/js/stores.js';

  const dict = $dicts;

  import {
    mdiRepeat,
    mdiArrowRight,
    mdiArrowLeft,
    mdiShareVariant,
    mdiMicrophone,
    mdiMicrophoneOutline,
    mdiAccountConvertOutline,
    mdiPlay,
    mdiThumbUpOutline,
    mdiEarHearing,
  } from '@mdi/js';

  import pkg from 'lodash';
  const { maxBy } = pkg;

  let voice;
  import Tts from '../../../speech/tts/Tts.svelte';
  import Stt from '../../../speech/stt/Stt.svelte';

  const operator = getContext('operator');

  let stt: any, tts: any;

  let dialog_data: any;

  let isFlipped = false;

  let isRepeat = false,
    isThumb = false;

  let isPlayAuto = false;

  let playAutoColor = 'currentColor';

  $: if (isPlayAuto) {
    playAutoColor = 'green';
  } else {
    playAutoColor = 'currentColor';
  }

  const visibility = ['visible', 'hidden', 'hidden'];
  let visibility_cnt = 1;

  let topAppBar;

  let share_mode = false;
  export let data;

  if (data.name) {
    if (data.quiz !== 'dialog.client') init();
  }

  $: if (dialog_data && $call_but_status === 'talk') {
    if (!share_mode) onShare();
  }

  $: switch ($call_but_status) {
    case 'talk':
      break;

    case 'inactive':
      if (share_mode) $lesson.data = { quiz: '' };

      break;
    default:
      share_mode = false;
      // style_button = style_button_non_shared;
      break;
  }

  // llang = data.llang;
  let showSpeakerButton = false;

  let tip_hidden_text = 'hidden-text';
  let cur_html = 0;
  let cur_qa = 0;
  let q, q_shfl, a_shfl, a, d;

  let display_audio = 'none';

  let stt_text = '',
    hints = ['test'];

  let isListening = false;
  let total_cnt = 0;

  let share_button_class = 'button_shared_false';

  let variant = 'outlined';

  $: if ($msg_user) {
    if ($msg_user.lesson?.quiz === 'dialog') {
      dialog_data = $msg_user.lesson.dialog_data;
      isFlipped = !$msg_user.lesson.isFlipped;
      cur_qa = $msg_user.lesson.cur_qa;
      visibility[1] = 'hidden';
      visibility[2] = 'hidden';
      visibility_cnt = 1;
      Dialog();
      $OnCheckQU(null, 'dialog', dialog_data.name);
    }
    if ($msg_user.command === 'repeat') {
      isRepeat = true;
      setTimeout(() => {
        isRepeat = false;
      }, 2000);
    } else if ($msg_user.command === 'thumb') {
      isThumb = true;
      setTimeout(() => {
        isThumb = false;
        if (!isFlipped) {
          onNextQA();
        }
      }, 2000);
    } else if ($msg_user.command === 'quit') {
      $msg_user.command = '';
      setTimeout(() => {
        $lesson.data = { quiz: '' };
      }, 100);
    }
  }

  $: if ($msg_oper) {
    // console.log($msg_oper);
    if ($msg_oper.lesson?.quiz === 'dialog') {
      dialog_data = $msg_oper.lesson.dialog_data;
      isFlipped = !$msg_oper.lesson.isFlipped;
      cur_qa = $msg_oper.lesson.cur_qa;
      visibility[1] = 'hidden';
      visibility[2] = 'hidden';
      visibility_cnt = 1;
      Dialog();
      $OnCheckQU(null, 'dialog', dialog_data.name);
    }
    if ($msg_oper.command === 'repeat') {
      isRepeat = true;
      setTimeout(() => {
        isRepeat = false;
      }, 2000);
    } else if ($msg_oper.command === 'thumb') {
      isThumb = true;
      setTimeout(() => {
        isThumb = false;
      }, 2000);
    } else if ($msg_oper.command === 'quit') {
      $msg_oper.command = '';
      setTimeout(() => {
        $lesson.data = { quiz: '' };
      }, 100);
    }
  }

  $: if ($msg_oper?.msg || $msg_user?.msg) {
    (async () => {
      alert(await Translate($msg_oper?.msg || $msg_user?.msg, 'ru', $langs));
      // $msg_oper?.msg = ''; $msg_user?.msg =  '';
      // $msg_user ? ($msg_user.msg = '') : ($msg_oper.msg = '');
    })();
  }

  $: if (data.html) {
    share_mode = true;
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

  if (data.func) {
    onChangeUserClick();
  }

  onMount(async () => {

     window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      if (!share_mode) {
        // $showBottomAppBar = false; //test
      }
    }, 3000);
  });

  function flipCard() {
    isFlipped = !isFlipped;
    Dialog();
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

    fetch(
      `./lesson?dialog=${data.name}&owner=${operator.abonent}&level=${data.level}`
    )
      .then((response) => response.json())
      .then((dlg_data) => {
        dialog_data = dlg_data.data.dialog;
        total_cnt = dialog_data.content.length;
        if (dlg_data.data.html) {
          dialog_data.html = dlg_data.data.html; //splitHtmlContent(data.data.html);
        }
        dialog_data.name = data.name;
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
    if (!dialog_data.content[0]) {
      return;
    }
    return new Promise(async (resolve, reject) => {
      let qa = dialog_data.content[cur_qa];
      if (!qa) {
        cur_qa = 0;
        qa = dialog_data.content[cur_qa];
        cur_html++;
        if (dialog_data.html && !dialog_data.html[cur_html]) {
          cur_html = 0;
        }

        if (!isPlayAuto)
          setTimeout(() => {
            onChangeUserClick();
          }, 0);

        return;
      }

      q = isFlipped ? qa.user2 : qa.user1;

      if (!q[$langs]) q[$langs] = await Translate(q[$llang], $llang, $langs);

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

      const dc = $dc_user?.dc.readyState === 'open' ? $dc_user : $dc_oper;

      // if (!dc && !isFlipped) speak(q[$llang]);

      let ar = q_shfl
        .toLowerCase()
        .replaceAll('?', '')
        .replaceAll(',', ' ')
        .split(' ');
      // q_shfl = shuffle(ar).toString().replaceAll(',', ' ');
      a = isFlipped ? qa.user1 : qa.user2;

      if (!a[$langs]) a[$langs] = await Translate(a[$llang], $llang, $langs);

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

      resolve();
    });
  }

  function handleBackClick() {
    $lesson.data = { quiz: '' };
    // $lesson.visible = true;
  }

  async function onNextQA() {
    // voice.Cancel();
    cur_qa++;
    visibility[1] = 'hidden';
    visibility[2] = 'hidden';
    visibility_cnt = 1;
    display_audio = 'none';
    tip_hidden_text = '';
    selectedSentence = '';
    setTimeout(() => {
      tip_hidden_text = 'hidden-text';
    }, 50);

    SendData();
    stt_text = '';
    showSpeakerButton = false;

    return Dialog();

    // speak(q[$llang])
  }

  function onBackQA() {
    // voice.Cancel();
    cur_qa--;
    visibility[1] = 'hidden';
    visibility[2] = 'hidden';
    visibility_cnt = 1;
    selectedSentence = '';
    Dialog();
    SendData();
    stt_text = '';
    // stt.CollectGarbage();
    // onClickMicrophone();
  }

  function onShare() {
    // Обработчик нажатия на кнопку "share"
    share_mode = true;
    share_button_class = `button_shared_${share_mode}`;
    selectedSentence = '';
    Dialog();
    SendData();
  }

  async function SendData() {
    const dc = $dc_user?.dc.readyState === 'open' ? $dc_user : $dc_oper;

    if (share_mode && dc) {
      dialog_data.content[cur_qa].user2['a_shfl'] = a_shfl;

      $msg_user = $msg_oper = null; //предотвр.повтор isFlipped

      await dc.SendData(
        {
          lesson: {
            quiz: 'dialog',
            llang: $llang,
            level: data.level,
            name: dialog_data.name,
            html: dialog_data.html ? dialog_data.html[cur_html] : null,
            dialog_data: dialog_data,
            cur_qa: cur_qa,
            isFlipped: isFlipped,
          },
        },
        (ex) => {
          console.log(dc);
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

    const dc = $dc_user?.dc.readyState === 'open' ? $dc_user : $dc_oper;

    dialog_data.content[cur_qa].user2['a_shfl'] = a_shfl;
    if (dc && share_mode) SendData();

    visibility_cnt = 1;
  }

  function onClickQ() {
    visibility[visibility_cnt++] = 'visible';
    showSpeakerButton = true;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function speak(text, cb_end) {
    function endSpeak() {}
    if (text) tts.Speak_server($llang, text, endSpeak);
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

  function SendCommand(cmd, ev) {
    variant = 'unelevated';
    setTimeout(() => {
      variant = 'outlined';
    }, 1000);

    if (ev) ev.target.style.color = 'red';

    const dc = $dc_user?.dc.readyState === 'open' ? $dc_user : $dc_oper;

    if (dc) {
      return new Promise((resolve) => {
        dc.SendData(
          {
            command: cmd,
          },
          () => {
            console.log();
            resolve();
          }
        );
      });
    }
  }

  let selectedSentence = '';

  const getSentenceFromSelection = function (ev) {
    const text = ev.currentTarget.outerText;
    const selection = window.getSelection();
    const selectedText = selection.toString();

    console.log(selectedText);

    if (selectedText) {
      const sentenceRegex = /[^.!?]*[.!?]/g;
      const sentences = text.match(sentenceRegex);

      if (sentences) {
        for (let sentence of sentences) {
          if (sentence.includes(selectedText)) {
            selectedSentence = sentence.trim();
            const translateUrl = `https://translate.google.com/?sl=auto&tl=ru&text=${encodeURIComponent(selectedSentence)}&op=translate`;
            window.open(translateUrl, '_blank');
            break;
          }
        }
      }
    }
  };

  function PlayAutoContent() {
    isPlayAuto = !isPlayAuto;
    if (!isPlayAuto) return;

    async function onEndSpeak() {
      if (!isPlayAuto) return;

      visibility[2] = 'visible';
      if (active === q[$langs]) {
        active = q[$llang];
        tts.Speak_server($llang, active, onEndSpeak);
      } else if (active === a[$llang]) {
        await onNextQA();
        visibility[1] = 'visible';
        active = q[$langs];
        tts.Speak_server($langs, active, onEndSpeak);
      } else if (active === q[$llang]) {
        active = a[$langs];
        tts.Speak_server($langs, active, onEndSpeak);
      } else if (active === a[$langs]) {
        active = a[$llang];
        tts.Speak_server($llang, active, onEndSpeak);
      }
    }
    visibility[1] = 'visible';
    let active = q[$langs];
    tts.Speak_server($langs, active, onEndSpeak);
  }



  onDestroy(async () => {
    // voice.Cancel();
    $lesson.data = { quiz: '' };
    dialog_data = '';
    data = '';
    stt_text = '';
    stt = '';
    tts = '';
    $showBottomAppBar = true;
    await SendCommand('quit', null);
  });
</script>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>

<Tts bind:this={tts}></Tts>

<!-- <RV bind:this={voice}></RV> -->

<!-- <VoiceRSS bind:this={voice}></VoiceRSS> -->
<main>
  <div class="top-app-bar-container flexor">
    <TopAppBar bind:this={topAppBar} variant="fixed">
      <Row>
        <Section align="start">
          {#if !isFlipped}
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
          {/if}
        </Section>
        <Section align="start">
          {#if $dc_user_state === 'close' && $dc_oper_state === 'close'}
            <IconButton on:click={PlayAutoContent}>
              <Icon tag="svg" viewBox="0 0 24 24">
                <path fill={playAutoColor} d={mdiEarHearing} />
              </Icon>
            </IconButton>
          {/if}
        </Section>
        <Section align="start">
          <div class="flip_button">
            <IconButton>
              <Icon tag="svg" viewBox="0 0 24 24">
                <path fill="currentColor" d={mdiAccountConvertOutline} />
              </Icon>
              {#if !isFlipped}
                <Badge
                  position="middle"
                  align="bottom-end - bottom-middle"
                  aria-label="unread count"
                  style="scale:.8">A</Badge
                >
              {:else}
                <Badge
                  color="secondary"
                  position="middle"
                  align="bottom-end - bottom-middle"
                  aria-label="unread count"
                  style="scale:.8">B</Badge
                >
              {/if}
            </IconButton>
          </div>
        </Section>
        <Section align="start">
          <div class="counter">
            <p>
              <span class="mdc-typography--overline" style="position:relative"
                >{cur_qa + 1}
                <Badge
                  position="middle"
                  align="bottom-end - bottom-middle"
                  aria-label="unread count"
                  style="margin-right:-10px;scale:.8">{total_cnt}</Badge
                >
              </span>
            </p>
          </div>
        </Section>
        <Section align="end">
          <button class="hint-button" on:click={onClickQ}>
            <span class="material-symbols-outlined">?</span>
          </button>
        </Section>
        <Section align="end">
          {#if !isFlipped}
            <Icon
              tag="svg"
              on:click={onNextQA}
              viewBox="0 0 24 24"
              style="margin-top:0px; scale:.5; width:50px"
            >
              <path fill="white" d={mdiArrowRight} />
            </Icon>
          {/if}
        </Section>
      </Row>
    </TopAppBar>
  </div>
  <!-- Ваш контент для лицевой стороны -->
  <div class="card">
    <span
      style="display:block;position:relative;color: lightgray;font-style: italic;font-size:smaller;font-family: serif;"
      >{dialog_data?.name}</span
    >
    {#if q || a}
      {#if !isFlipped}
        <div class="container">
          {#if $call_but_status == 'talk'}
            <div class="repeat_but">
              <IconButton on:click={(ev) => SendCommand('repeat', ev)}>
                <Icon tag="svg" color="secondary" viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiRepeat} />
                </Icon>
              </IconButton>
            </div>
          {/if}

          <!-- <div class="cnt">{cur_qa + 1}</div> -->
          {#await Translate('Послушай вопрос', 'ru', $langs) then data}
            <div class="title">{data}:</div>
          {/await}

          {#if $call_but_status == 'talk'}
            <div class="thumb_but">
              <IconButton on:click={(ev) => SendCommand('thumb', ev)}>
                <Icon tag="svg" color="secondary" viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiThumbUpOutline} />
                </Icon>
              </IconButton>
            </div>
          {/if}
        </div>

        <div
          class="tip mdc-typography--headline6 {tip_hidden_text}"
          on:mouseup={getSentenceFromSelection}
          on:touchend={getSentenceFromSelection}
        >
          {#if selectedSentence}
            <p><span class="highlight">{selectedSentence}</span></p>
          {:else}
            {@html q[$llang].replace(/"([^"]*)"/g, '$1')}
          {/if}
          <div style="display: inline-flex; float: right; margin-right: 10px;}">
            <br />
            <!-- {#if showSpeakerButton} -->
            <div class="speaker-button" on:click={speak(q[$llang])}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiPlay} />
                </Icon>
              </IconButton>
            </div>
            <!-- {/if} -->
          </div>
        </div>

        <div style="text-align: center;">
          <div class="user1" style="visibility:{visibility[1]}">
            <span>
              {#if !q[$langs]}
                {#await Translate(q['ru'].replace(/"([^"]*)"/g, '$1'), 'ru', $langs) then data}
                  {@html data}
                {/await}
              {:else}
                {@html q[$langs].replace(/"([^"]*)"/g, '$1')}
              {/if}
            </span>
          </div>
        </div>

        {#if isThumb}
          <div class="thumb_alert">
            <Icon tag="svg" color="green" viewBox="0 0 24 24">
              <path fill="currentColor" d={mdiThumbUpOutline} />
            </Icon>
          </div>
        {/if}

        {#if isRepeat}
          <div class="repeat_alert">
            <Button>
              <Label>{dict['Repeat'][$langs]}</Label>
            </Button>
          </div>
        {/if}

        {#await Translate('Ответь', 'ru', $langs) then data}
          <div class="title">{data}:</div>
        {/await}

        <div class="user2">
          {#if a && visibility[2] === 'hidden'}
            {@html a[$llang].replace(
              /(?<!")\b\p{L}+(?<!\s)(?!")/gu,
              (match) => {
                return `<span class="span_hidden" onclick="(this.style.color='#2196f3')" 
                style="display:inline-block; margin: 5px 0px; padding: 1px 5px;border:1px;border-style:groove;border-color:lightblue;
                color:transparent;">${match}</span>`;
              }
            )}
          {:else if visibility[2] === 'visible'}
            {@html a[$llang].replace(
              /(?<!")\b\p{L}+(?<!\s)(?!")/gu,
              (match) => {
                return `<span class="span_hidden"  
                style="display:inline-block; margin: 5px 0px; padding: 1px 5px;border:1px;border-style:groove;border-color:lightblue;
                color:#2196f3">${match}</span>`;
              }
            )}
          {/if}

          <div class="user2_tr">
            {#if a && visibility[0] === 'visible'}
              {#if !a[$langs]}
                {#await Translate(a['ru'].replace(/"([^"]*)"/g, '$1'), 'ru', $langs) then data}
                  {data}
                {/await}
              {:else}
                {@html a[$langs].replace(/"([^"]*)"/g, '$1')}
              {/if}
            {/if}
          </div>

          <div class="speaker-button" on:click={speak(a[$llang])}>
            <IconButton>
              <Icon tag="svg" viewBox="0 0 24 24">
                <path fill="currentColor" d={mdiPlay} />
              </Icon>
            </IconButton>
          </div>

          {#if !share_mode}
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
                {#if isListening}
                  {#await Translate('говори', 'ru', $llang) then data}
                    <span>{data}</span>
                  {/await}
                {/if}
              </div>
              <Stt
                bind:this={stt}
                {SttResult}
                {StopListening}
                bind:display_audio
              ></Stt>
            </div>
          {/if}
        </div>

        <div style="text-align: center;   margin-top: 10px;">
          <span style="color: darkgreen;">
            {@html stt_text}
          </span>
        </div>
      {:else}
        {#if isThumb}
          <div class="thumb_alert">
            <Icon tag="svg" color="green" viewBox="0 0 24 24">
              <path fill="currentColor" d={mdiThumbUpOutline} />
            </Icon>
          </div>
        {/if}

        {#if isRepeat}
          <div class="repeat_alert">
            <Button>
              <Label>{dict['Repeat'][$langs]}</Label>
            </Button>
          </div>
        {/if}

        {#await Translate('Спроси', 'ru', $langs) then data}
          <div class="title">{data}:</div>
        {/await}

        <div class="user2_tr">
          {#if a}
            {#if !a[$langs]}
              {#await Translate(a[$llang], $llang, $langs) then data}
                {data}
              {/await}
            {:else}
              {@html a[$langs]}
            {/if}
          {/if}
        </div>

        <div class="user2">
          {#if a && visibility[1] === 'hidden'}
            {@html a[$llang].replace(
              /(?<!")\b[\p{L}\p{M}]+\b(?!")/gu,
              (match) => {
                return `<span class="span_hidden" onclick="(this.style.color='#2196f3')" 
                style="display:inline-block;margin: 5px 0px;border:1px;border-style:groove;border-color:light-blue;
                color:transparent;">${match}</span>`;
              }
            )}
          {:else if visibility[1] === 'visible'}
            {@html a[$llang].replace(
              /(?<!")\b[\p{L}\p{M}]+\b(?!")/gu,
              (match) => {
                return `<span class="span_hidden"  
                style="display:inline-block;margin: 5px 0px;border:1px;border-style:groove;border-color:light-blue;
                color:#2196f3">${match}</span>`;
              }
            )}
          {/if}

          <div class="speaker-button" on:click={speak(a[$llang])}>
            <IconButton>
              <Icon tag="svg" viewBox="0 0 24 24">
                <path fill="currentColor" d={mdiPlay} />
              </Icon>
            </IconButton>
          </div>
          {#if !share_mode}
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
              <Stt
                bind:this={stt}
                {SttResult}
                {StopListening}
                bind:display_audio
              ></Stt>
            </div>
          {/if}
        </div>

        <div style="text-align: center;   margin-top: 10px; ">
          <span style="color: darkgreen;">
            {@html stt_text}
          </span>
        </div>
        <div class="container">
          {#if $call_but_status == 'talk'}
            <div class="repeat_but">
              <IconButton on:click={(ev) => SendCommand('repeat', ev)}>
                <Icon tag="svg" color="secondary" viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiRepeat} />
                </Icon>
              </IconButton>
            </div>
          {/if}

          {#await Translate('Послушай ответ', 'ru', $langs) then data}
            <div class="title">{data}:</div>
          {/await}

          {#if $call_but_status == 'talk'}
            <div class="thumb_but">
              <IconButton on:click={(ev) => SendCommand('thumb', ev)}>
                <Icon tag="svg" color="secondary" viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiThumbUpOutline} />
                </Icon>
              </IconButton>
            </div>
          {/if}
        </div>

        <div class="tip mdc-typography--headline6">
          {@html q[$llang]}
        </div>

        <div style="text-align: center;">
          <div class="user1" style="visibility:{visibility[2]}">
            {#if !dialog_data.content[cur_qa].user1[$langs]}
              {#await Translate(q[$llang], $llang, $langs) then data}
                {data}
              {/await}
            {:else}
              {@html q[$langs]}
            {/if}

            <div
              class="margins"
              style="text-align: center; display: flex; align-items: center; justify-content: space-between;"
            >
              <br />
            </div>
            <!-- {#if showSpeakerButton} -->
            <div class="speaker-button" on:click={speak(q[$llang])}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d={mdiPlay} />
                </Icon>
              </IconButton>
            </div>
            <!-- {/if} -->
          </div>
        </div>
      {/if}

      <br />

      {#if dialog_data.html}
 
        <ConText data={dialog_data} {tts}/>
      {/if}
    {:else}
      <div style="text-align:center">
        <span
          class="material-symbols-outlined"
          style="font-size: 20px; color: blue; scale:1.5;"
        >
          <CircularProgress
            style="top: 100px;height: 50px; width: 50px;"
            indeterminate
          />
        </span>
      </div>
    {/if}
    <div style="height:200px" />
  </div>
</main>

<style scoped>
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
    left: 30px;
    /* scale: 0.7; */
    z-index: 2;
  }

  .thumb_alert {
    position: absolute;
    width: 30px;
    z-index: 2;
    right: 40px;
  }

  .container {
    display: flex;
    top: 5px;
    margin-bottom: 30px;
    position: relative;
    justify-content: space-between;
    align-items: center;
  }

  .repeat_but {
    display: inline-flex;
    /* position: absolute; */
    color: grey;
    margin-left: 15px;
    font-size: smaller;
    top: 0px;
    z-index: 2;
    scale: 1;
  }

  .thumb_but {
    display: inline-flex;
    /* position: absolute; */
    color: grey;
    margin-right: 15px;
    font-size: smaller;
    top: 0px;
    z-index: 2;
    scale: 1;
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
    top: 10px;
    position: relative;
    margin-right: 10px;
    margin-left: 10px;
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
    display: inline-flex;
    float: right;
    font-size: large;
    border-radius: 25px;
    margin-right: 0px;
    margin-left: 10px;
    z-index: 2;
  }

  .html_data {
    display: grid;
    width: 100vw;
    position: relative;
    overflow-y: auto;
    height: 100vh;
    margin: 0 auto;
    margin-top: 30px;
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
    width: fit-content;
    margin: 5px auto; /* Центрирование второго элемента */
    margin-top: 15px;
    color: coral;
    line-height: normal;
    text-align: center;
    font-size: 0.8em;
    background-color: ghostwhite;
  }

  .user1 {
    /* width: 100vw;*/
    position: relative;
    text-align: center;
    line-height: normal;
    font-size: 0.8em;
    margin-bottom: 0px;
    color: #333;
    z-index: -1;
  }

  .user2 {
    position: relative;
    top: 10px;
    text-align: center;
    color: #2196f3;
    margin-left: 10px;
    margin-right: 10px;
  }

  .user2_tr {
    text-align: center;
    line-height: normal;
    font-size: 0.8em;
    margin-bottom: 0px;
    color: #333;
    z-index: -1;
  }

  .tip {
    position: relative;
    top: 0px;
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

  .hint-button {
    border: 0px;
    color: white;
    background-color: #2196f3;
    border-radius: 3px;
    padding: 2px 10px;
  }

  .card {
    transition: transform 0.3s ease-in-out;
    top: 80px;
    overflow-y: auto;
    border-radius: 5px;
    margin: 0 auto;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s;
    height: calc(100vh - 80px);
    margin-left: 10px;
    margin-right: 10px;
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
    width: 50px;
    padding-left: 8px;
    margin: 5px;
    background-color: transparent;
  }

  .hidden-text {
    opacity: 0;
    animation: fadeIn 2s ease-in forwards;
    animation-delay: 2s;
  }

  p {
    cursor: pointer;
    user-select: text; /* Позволяет выделять текст на мобильных устройствах */
  }

  .highlight {
    background-color: yellow;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
</style>
