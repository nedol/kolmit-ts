<script lang="ts">
  import { onMount, onDestroy, getContext, setContext } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import '../assets/icofont/icofont.min.css';
  import BottomAppBar, {
    Section,
    AutoAdjust,
  } from '@smui-extra/bottom-app-bar';
  import IconButton, { Icon } from '@smui/icon-button';

  import TopAppBar, { Row, Title } from '@smui/top-app-bar';

  import { mdiAccountBox, mdiVolumeHigh, mdiVolumeOff } from '@mdi/js';

  import {
    users,
    view,
    posterst,
    lesson,
    signal,
    click_call_func,
    dc_oper_state,
    dc_user_state,
    call_but_status,
    muted,
    user_placeholder,
    dicts,
    langs,
    showBottomAppBar,
  } from '$lib/js/stores.js';

  import CircularProgress from '@smui/circular-progress';

  // import {Dict} from '$lib/js/$dicts'
  import Group from '../user/group/Group.svelte';
  let group = getContext('group');

  import { RTCOperator } from './rtc/RTCOperator';

  import CallButton from './callbutton/CallButtonOperator.svelte';
  // import BurgerMenu from './menu/BurgerMenu.svelte';
  import VideoLocal from './Video.local.svelte';
  import VideoRemote from './Video.remote.svelte';

  import Download from './Download.svelte';
  import AudioLocal from './Audio.local.svelte';
  import AudioRemote from './Audio.remote.svelte';

  import RecordedVideo from './RecordedVideo.svelte';

  import Module from '../lesson/Module.svelte';

  import Chat from './chat/Сhat.svelte';

  import pkg from 'lodash';
  const { find } = pkg;

  import md5 from 'md5';

  /*TODO: дает*/
  $: if ($dc_oper_state) {
    switch ($dc_oper_state) {
      case 'open':
        $call_but_status = 'call';
        local.audio.paused = false;
        break;
      case 'close':
        $call_but_status = 'inactive';
        local.audio.paused = true;

        video_button_display = false;
        local.video.display = 'none';
        local.video.srcObject = '';
        // local.video.display = 'block';
        remote.video.srcObject = '';
        remote.video.poster = '';
        remote.video.display = 'none';
        remote.text.name = '';
        remote.text.email = '';
        remote.text.display = 'none';

        break;
    }
  }

  // $: if ($users[uid] && $users[uid].msg) {
  //   OnMessage($users[uid].msg, null);
  // }

  import { msg_oper } from '$lib/js/stores.js';
  $: if ($msg_oper) {
    OnMessage($msg_oper, null);
    // $msg_oper = ''
  }

  let dlg_display = 'none';

  function SetDlgDisplay() {
    $view = 'chat';
  }

  setContext('SetDlgDisplay', SetDlgDisplay);

  $: if ($view === 'chat') dlg_display = 'block';
  else dlg_display = 'none';

  $posterst = '/assets/operator.svg';

  let rtc: any;
  let topAppBar;
  let bottomAppBar;
  let selected: any;
  let call_cnt: number, inter: any;
  let video_button_display = false;
  let video_progress = false;
  let edited_display = false;
  let synthesis;
  let isRemoteAudioMute = false;
  let commandsList;
  let rtcSupportText = '';
  let debug_div: any;

  let cc_display: string,
    lesson_display: string,
    chat_display = 'block';

  $call_but_status = 'inactive';

  import { editable } from '$lib/js/stores.js';
  import { Translate } from '../translate/Translate';
  $: if ($editable) {
    edited_display = $editable;
  }

  let operator = getContext('operator');
  operator.type = 'operator';

  const abonent = operator.abonent;
  const name = operator.name;

  const uid = operator.operator;

  let container;

  const headers = {
    'Content-Type': 'application/json',
  };

  let isHidden = false;

  function handleVisibilityChange() {
    isHidden = document.hidden;
    if (isHidden) {
      console.log('Страница ушла в фоновый режим');
      location.reload(); // Перезагрузка страницы
    } else {
      console.log('Страница активна');
    }
  }

  let isMobile = false;
  function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Проверяем наличие строки, характерной для мобильных устройств
    if (/android/i.test(userAgent)) {
      isMobile = true;
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      isMobile = true;
    } else {
      isMobile = false; // Если не мобильное устройство
    }
  }

  function checkWebRTCSupport() {
    const isWebRTCSupported = !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.RTCPeerConnection &&
      window.RTCDataChannel
    );
    if (!isWebRTCSupported) {
      rtcSupportText = 'WebRTC не поддерживается вашим браузером';
    } else {
      rtcSupportText = ' ';
    }
  }

  onMount(async () => {
    checkWebRTCSupport();

    try {
      rtc = new RTCOperator(operator, uid, $signal);

      // rtc.SendCheck();

      try {
        // Fix up for prefixing
        if (!window.AudioContext) {
          window.AudioContext =
            window.AudioContext || window.webkitAudioContext;
          window.AudioContext = new AudioContext();

          rtc.localSoundSrc = window.AudioContext.createMediaElementSource(
            window.user.localSound
          );
          rtc.localSoundSrc.connect(window.AudioContext.destination);
        }
      } catch (ex) {
        console.log('Web Audio API is not supported in this browser');
      }

      // Добавьте слушателя событий для скрытия списка команд при клике за его пределами
      // document.addEventListener('click', handleOutsideClick);
      if (detectDevice())
        document.addEventListener('visibilitychange', handleVisibilityChange);
    } catch (ex) {
      console.log();
    }
  });

  let progress = {
    display: 'block',
    value: 0,
  };

  let local = {
    video: {
      display: 'none',
      srcObject: '',
      poster: '',
    },
    audio: {
      paused: true,
      src: '',
    },
  };

  let remote = {
    text: {
      display: 'none',
      msg: '',
      name: '',
      email: '',
    },
    video: {
      display: 'none',
      srcObject: '',
      poster: '/assets/operator.svg',
    },
  };

  let profile = {
    display: 'none',
  };

  if (operator.operator === abonent) {
    operator.role = 'admin';
  } else {
    operator.role = 'user';
  }

  function onTransFile(params: any) {
    let event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    document.getElementById('files').dispatchEvent(event);
  }

  $: if (selected)
    switch (selected) {
      case 1:
        break;
      case 2:
        edited_display = true;
        break;

      case 10:
        break;
    }

  async function initRTC() {
    // rtc ..set(rtc .;
    //rtc .type = "operator";

    rtc.PlayCallCnt = () => {
      // video_progress = false;

      local.audio.paused = false;

      call_cnt = 10;

      inter = setInterval(function () {
        call_cnt--;

        if (call_cnt === 0) {
          clearInterval(inter);
          call_cnt = 10;
          local.audio.paused = true;
          return;
        }
      }, 2000);

      return;
    };

    rtc.GetRemoteVideo = () => {
      return remote.video.srcObject;
    };
    rtc.SetLocalVideo = (src: string) => {
      if (src) local.video.srcObject = src;
    };

    rtc.SetRemoteVideo = (src: string) => {
      // if ($call_but_status === 'talk') {
      // remote.video.poster = $posterst;
      // local.audio.paused = true;
      remote.video.srcObject = src;
      remote.video.display = 'block';

      // }
    };
  }

  function OnLongPress() {
    selected.display = true;
  }

    $: switch ($dc_user_state) {
    case 'open':
      $call_but_status = 'call';
      break;
  }

  function OnClickCallButton() {
    // if($call_but_status==undefined)
    //   $call_but_status = 'inactive'
    console.log();
    switch ($call_but_status) {
      case 'inactive':
            try {
              rtc = new RTCOperator(operator, uid, $signal);
              initRTC();
              // rtc.SendCheck();

              // Добавьте слушателя событий для скрытия списка команд при клике за его пределами
              // document.addEventListener('click', handleOutsideClick);
              if (detectDevice())
                document.addEventListener('visibilitychange', handleVisibilityChange);
            } catch (ex) {
              console.log();
            }
        rtc.Offer();

        $call_but_status = 'active';
        break;

      case 'active':
        $call_but_status = 'inactive';
        rtc.OnInactive();

        break;
      case 'call':
        if ($dc_oper_state) {
          $call_but_status = 'talk';

          local.audio.paused = true;
          // $muted = false;
          rtc.OnTalk();
          video_button_display = true;
          remote.text.display = 'none';
        } else {
          $call_but_status = 'inactive';
        }

        clearInterval(inter);
        call_cnt = 10;

        // const dispatch = createEventDispatcher();
        // dispatch('talk');
        // const event = new Event('talk');
        // document.getElementsByTagName('body')[0].dispatchEvent(event);

        break;
      case 'talk':
        local.video.display = 'none';
        video_button_display = false;
        remote.video.display = 'none';
        remote.video.srcObject = '';
        remote.video.poster = '';
        remote.text.display = 'none';
        remote.text.name = '';
        remote.text.email = '';
        $call_but_status = 'inactive';
        rtc.OnInactive();
        $users = $users;

        break;
      case 'muted':
        $call_but_status = 'inactive';

        local.video.srcObject = '';

        remote.video.display = 'none';
        remote.video.srcObject = '';
        remote.video.poster = '';
        remote.text.display = 'none';
        // local.video.poster = UserSvg;
        rtc.OnInactive();
        break;
      default:
        return;
    }
  }

  $click_call_func = OnClickCallButton;

  $: if ($call_but_status) {
    console.log($call_but_status)
  }

  function openProfile(id) {
    profile.display = 'block';
  }

  function OnClickVideoButton() {
    $call_but_status = 'talk';
    local.audio.paused = true;
    local.video.display = 'block';
    video_button_display = false;
    video_progress = true;

    if (rtc.DC.dc.readyState === 'open') {
      rtc.GetUserMedia({ audio: 1, video: 1 }, function () {
        rtc.SendVideoOffer(rtc.main_pc);
      });
    }
  }

  function OnPlayVideo() {
    video_progress = false;
  }

  function OnMessage(data: any, resolve: any) {
    if (data.func === 'close') {
      rtc?.OnInactive();
      $call_but_status = 'inactive';
    }

    if (data.call || data.func === 'call') {
      if ($call_but_status === 'active') {
        // $call_but_status = 'call';
        // local.audio.paused = false;
      }

      rtc.OnCall();

      $showBottomAppBar = true;

      remote.text.display = 'block';
      video_button_display = false;

      if (data.profile) {
        $posterst = data.profile.img;
        if (data.profile.img) remote.video.display = 'block';

        remote.text.name = data.profile.name;
        remote.text.email = data.profile.email;
      }
    }
    if (data.func === 'talk') {
      $call_but_status = 'talk';

      video_button_display = true;
      remote.text.display = 'none';
    }

    if (data.func === 'mute') {
      local.audio.paused = true;

      video_button_display = false;
      local.video.display = 'none';
      local.video.srcObject = '';
      // local.video.display = 'block';
      remote.video.srcObject = '';
      remote.video.poster = '';
      remote.video.display = 'none';
      remote.text.name = '';
      remote.text.email = '';
      remote.text.display = 'none';
      // local.video.poster = UserSvg;
      // console.log('rtc', rtc);
      rtc.OnInactive();

      if ($call_but_status === 'talk') {
        rtc.OnInactive();
        remote.video.poster =''
      } else if ($call_but_status === 'call') {
        rtc.OnHangup();
        remote.video.poster = ''
        // Group.GetUsers();
      }
      if (resolve) resolve();
    }

    if (data.camera) {
      local.video.src = that.localStream;
    }

    if (data.lesson) {
      $view = 'lesson';
      $lesson.data = data.lesson;
    }
  }

  function toggle_remote_audio() {
    isRemoteAudioMute = !isRemoteAudioMute;
    $muted = isRemoteAudioMute;
  }

  onDestroy(() => {
    group = '';
    document.removeEventListener('visibilitychange', handleVisibilityChange);

  });
</script>

<!-- {@debug $view} -->

<!-- {#if $view === 'group'} -->
<Group bind:oper_display={remote.video.display} />

{#if $view === 'lesson'}
  <Module data={group} />
{/if}

<div class="dialog" style="display: {dlg_display};">
  <Chat></Chat>
</div>

<div class="bottom-app-bar-wrapper" class:hide={!$showBottomAppBar}>
  <BottomAppBar variant="static" slot="oper" bind:this={bottomAppBar}>
    <Section>
      <div class="remote_div">
        <div class="user_placeholder" bind:this={$user_placeholder}></div>

        <VideoRemote
          {...remote.video}
          name={remote.text.name}
          operator={operator.operator}
          on:click={OnClickCallButton}
          on:mute
          bind:isRemoteAudioMute
        ></VideoRemote>
        {#if $call_but_status === 'talk'}
          <div class="speaker-button">
            <IconButton on:click={toggle_remote_audio}>
              <Icon tag="svg" viewBox="0 0 24 24">
                {#if !isRemoteAudioMute}
                  <path fill="currentColor" d={mdiVolumeHigh} />
                {:else}
                  <path fill="currentColor" d={mdiVolumeOff} />
                {/if}
              </Icon>
            </IconButton>
          </div>
        {/if}
      </div>
    </Section>
    <Section>
      {#if remote.text.display && remote.text.name}
        <div class="remote_text_display" style="display:{remote.text.display};">
          {#await Translate('Тебя вызывает - ', 'ru', $langs) then data}
            <p class="remote_msg">
              {data}
              {remote.text.name}
            </p>
          {/await}
        </div>
      {/if}
    </Section>
    <Section>
      <CallButton on:click={OnClickCallButton}>
        <b
          class="call_cnt"
          style="display:none;position: relative;left:22px;top:10px;color:#0e0cff;font-size: 12px;"
          >100</b
        >
        <span
          class="badge badge-primary badge-pill call-queue"
          style="display:none;position: relative;right:0px;bottom:0px;color:#0e0cff;font-size: 12px;opacity:1"
          >0</span
        >
      </CallButton>
    </Section>
    <Section align="end">
      <div
        class="video"
        on:click={OnClickVideoButton}
        on:loadstart={OnPlayVideo}
      >
        {#if video_button_display}
          <Icon tag="svg" viewBox="0 0 24 24">
            <path fill="currentColor" style="color:grey" d={mdiAccountBox} />
          </Icon>
          <!-- <i class="video icofont-ui-video-chat"  on:click = {OnClickVideoButton}
                        style="position: absolute; right: 0; top: 0; stroke:black; stroke-width: 2px; color: lightgrey; font-size: 30px; z-index: 20;"></i>  -->
        {/if}

        {#if video_progress}
          <div style="position: absolute; top: -10px;">
            <CircularProgress
              style="height: 30px; width: 30px;"
              indeterminate
            />
          </div>
        {/if}
      </div>

      <div class="videolocal_div">
        <VideoLocal {...local.video}>
          <svelte:fragment slot="footer">
            <div bind:this={container} />
          </svelte:fragment>
        </VideoLocal>
      </div>
    </Section>
  </BottomAppBar>

  {#await Translate(rtcSupportText, 'ru', $langs) then data}
    <span style="position:fixed;bottom:0;font-size:smaller;color:red"
      >{data}</span
    >
  {/await}

  <!-- <VideoLocal {...local.video} /> -->
  <AudioLocal {...local.audio} bind:paused={local.audio.paused} />
  <!-- {@debug $call_but_status} -->
</div>

<style lang="scss">
  /* Hide everything above this component. */

  .bottom-app-bar-wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    transform: translateY(0); // Позиция панели по умолчанию
    transition: transform 0.7s ease; // Плавное появление
  }
  .hide {
    transform: translateY(100px); // Смещаем вниз
    transition: transform 0.7s ease; // Плавное задвигание
  }

  /* Если не скрыт, панель остается на месте */

  .dialog {
    position: fixed;
    background-color: aliceblue;
    top: 50px;
    width: 100vw;
    height: 90vh;
    right: 0vw;
    margin: 0px auto;
    z-index: 2;
  }

  .remote_msg {
    position: relative;
    font-size: 0.7em;
    white-space: nowrap;
    color: black;
    margin: auto;
    text-align: center;
    top: -10px;
    /* background-color: rgba(125, 125, 125, 0.7); */
    z-index: 1;
  }

  .user_placeholder {
    position: relative;
    bottom: 30px;
    scale: 0.8;
    left: -20px;
  }
  .speaker-button {
    position: absolute;
    left: 83px;
    bottom: 20px;
    color: black;
  }

  .video {
    position: relative;
    top: 5px;
    margin: auto;
    max-height: 50px;
  }
  .videolocal_div {
    position: relative;

    width: 45px;
    bottom: 10px;
  }

  @media screen and (max-width: 400px) {
    .video {
      top: 0px;
    }
  }
</style>
