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
    dc_state,
    con_state,
    call_but_status,
    langs,
    showBottomAppBar,
  } from '$lib/stores.ts';

  import CircularProgress from '@smui/circular-progress';

  import Group from './Group.svelte';

  let operator =  getContext('operator');

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


  import { msg } from '$lib/stores.ts';
  $: if ($msg) {
    OnMessage($msg, null);
    // $msg = ''
  }

  let dlg_display = 'none';

  function SetDlgDisplay() {
    $view = 'chat';
  }

  setContext('SetDlgDisplay', SetDlgDisplay);
 

  $: if ($view === 'chat'){
     dlg_display = 'none';
  } else dlg_display = 'none';

  $posterst = 'assets/operator.svg';

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

  $call_but_status = 'inactive';

  import { editable } from '$lib/stores.ts';
  import { Transloc } from '../translate/Transloc';
  $: if ($editable) {
    edited_display = $editable;
  }

  operator.type = 'operator';

  const abonent = operator.abonent;
  const name = operator.name;

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
      rtc = new RTCOperator(operator, name, $signal);
      initRTC();

    } catch (ex) {
        console.log();
    }

    try {

    } catch (ex) {
      console.log('Web Audio API is not supported in this browser');
    }


      // Добавьте слушателя событий для скрытия списка команд при клике за его пределами
      // document.addEventListener('click', handleOutsideClick);
      if (detectDevice())
        document.addEventListener('visibilitychange', handleVisibilityChange);

      if(operator.length<=1)
        $view = 'lesson'



    setTimeout(()=>{
      if(!operator.level && abonent==='public'){  
        $view = 'chat'
      }
    },1000)

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

  function initRTC() {
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
      remote.video.poster = $posterst;
      // local.audio.paused = true;
      remote.video.srcObject = src;
      remote.video.display = 'block';

      // }
    };
  }

  function OnLongPress() {
    selected.display = true;
  }


  function OnClickCallButton() {
    console.log('OnClickCallButton')
    switch ($call_but_status) {
      case 'inactive':
        try {
          // Добавьте слушателя событий для скрытия списка команд при клике за его пределами
          // document.addEventListener('click', handleOutsideClick);
          if (detectDevice())
            document.addEventListener(
              'visibilitychange',
              handleVisibilityChange
            );
        } catch (ex) {
          console.log();
        }

        // // Проверка поддержки Web Audio API
        // const AudioContext = window.AudioContext || window.webkitAudioContext;

        // if (!window.AudioContext) {
        //   throw new Error('Web Audio API is not supported in this browser');
        // }

        // // Создание экземпляра AudioContext
        // let audioCtx = new AudioContext();

        // // Источник звука (например, <audio> элемент)
        // if (window.user?.localSound) {

        //   const localSoundSrc = audioCtx.createMediaElementSource(window.user?.localSound);

        //   // Подключение к выходному устройству
        //   localSoundSrc.connect(audioCtx.destination);

        //   // Сохранение источника (если необходимо)
        //   rtc.localSoundSrc = localSoundSrc;
          
        // } else {
        //   console.log('No local sound element found.');
        // }

        rtc.Offer();

        $call_but_status = 'active';
        break;

      case 'active':

        $call_but_status = 'inactive';
        rtc.OnInactive();

        break;
      case 'call':
        if ($dc_state && !$click_call_func) {
          $call_but_status = 'talk';         
          isRemoteAudioMute = false;
          rtc.OnTalk();
          video_button_display = true;
          remote.text.display = 'none';
        } else {
          $call_but_status = 'inactive';
        }
         
        local.audio.paused = true;
        clearInterval(inter);
        call_cnt = 10;

        // const dispatch = createEventDispatcher();
        // dispatch('talk');
        // const event = new Event('talk');
        // document.getElementsByTagName('body')[0].dispatchEvent(event);

        break;
      case 'talk':
        local.video.display = 'none';
        local.audio.paused = true;
        video_button_display = false;
        remote.video.display = 'none';
        remote.video.srcObject = '';
        remote.video.poster = '';
        remote.text.display = 'none';
        remote.text.name = '';
        remote.text.email = '';

        $call_but_status = 'inactive';
        rtc.DC.SendDCClose();

        rtc.DC.CloseDC();

        rtc.OnInactive();
        
        $users = $users;

        break;
      default:
        return;
    }
  }

  $: if($click_call_func){
    console.log()
  }

  $: if ($call_but_status) {
    console.log($call_but_status);
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

  $:switch($con_state){
    case 'disconnected':
      // $call_but_status = 'inactive';
    break;
  }

    /*TODO: дает*/
  $: switch ($dc_state) {
      case 'open':
        $call_but_status = 'call';//дубль
        local.audio.paused = false;
        break;
      case 'close':
        $call_but_status = 'inactive';
        remote.video.display = 'none'
        local.audio.paused = true;
        break;
    }

  function OnMessage(data: any, resolve: any) {
    if (data.func === 'close') {
      $call_but_status = 'inactive';
      rtc.DC.CloseDC();
      local.audio.paused = true;
    }

    if (data.call || data.func === 'call') {
   
      $showBottomAppBar = true;
      // $call_but_status = 'call';//дубль
      remote.text.display = 'block';
      video_button_display = false;
      local.audio.paused = false;

      if (data.profile) {
        // remote.video.poster = data.profile.img;
        if (data.profile.img) remote.video.display = 'block';

        remote.text.name = data.profile.name;
        remote.text.email = data.profile.email;
      }

      if($click_call_func)
        rtc.OnCall()
    }

    if (data.func === 'talk') {
      $call_but_status = 'talk';
      local.audio.paused = true;
      video_button_display = true;
      remote.text.display = 'none';
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
  }

  onDestroy(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });
</script>

<!-- {@debug $view} -->



{#if $view === 'lesson'}
  <Module data={operator}/>

{:else if $view==='chat'}
  <Chat prompt_type={operator.level?"greeting":'basic'}></Chat>   

{:else if  $view === 'group'}
  <Group  {rtc} />
{/if}





<div class="bottom-app-bar-wrapper" class:hide={!$showBottomAppBar}>
  <BottomAppBar variant="static" slot="oper" bind:this={bottomAppBar}>
    <Section>
      <div class="remote_div">
        <div class="user_placeholder"></div>

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
          {#await Transloc('Тебя вызывает - ', 'ru', $langs,remote.text.name) then data}
            <p class="remote_msg">
              {data}
              {remote.text.name}
            </p>
          {/await}
        </div>
      {/if}
    </Section>
    <Section>

    </Section>
    <Section align="end">
      <div style="position: relative; top:-17px;right: 10px;z-index: 1; scale:1">
        <CallButton on:click={OnClickCallButton}>
          <b
            class="call_cnt"
            style="display:none;position: relative;left:25px;top:10px;color:#0e0cff;font-size: 12px;"
            >100</b
          >
          <span
            class="badge badge-primary badge-pill call-queue"
            style="display:none;position: relative;right:0px;bottom:0px;color:#0e0cff;font-size: 12px;opacity:1"
            >0</span
          >
        </CallButton>
      </div>
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

  {#await Transloc(rtcSupportText, 'ru', $langs,'operator') then data}
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
    height: 87vh;
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
    left: 70px;
    bottom: 30px;
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

  @media screen and (min-width: 768px) {
		/* Ваши стили для более крупных экранов здесь */
    main {
      // transform: scale(1.0);
        // transform-origin: center; /* Масштабирование от центра элемента */
        // max-width: 100%; /* Ограничение ширины */
        // max-height: 100%; /* Ограничение высоты */
    }
	}

</style>
