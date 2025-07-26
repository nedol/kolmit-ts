<script lang="ts">
  import { onMount, onDestroy, getContext, setContext } from "svelte";
  import { createEventDispatcher } from "svelte";
  import "../assets/icofont/icofont.min.css";
  import BottomAppBar, {
    Section,
    AutoAdjust,
  } from "@smui-extra/bottom-app-bar";

  import Level from "../Level.svelte";
  import { SignalingChannel } from "../signalingChannel.ts";

  import { writable } from "svelte/store";

  import Button, { Label } from "@smui/button";
  import IconButton, { Icon } from "@smui/icon-button";

  import Chat from "./chat/Chat.svelte";

  import Tab from "@smui/tab";
  import TabBar from "@smui/tab-bar";
  import TopAppBar, { Row, Title } from "@smui/top-app-bar";

  import { mdiAccountBox, mdiVolumeHigh, mdiVolumeOff } from "@mdi/js";

  import {
    users,
    view,
    posterst,
    lesson,
    signal,
    click_call_func,
    rtc,
    dc_state,
    con_state,
    call_but_status,
    mediaStream,
  } from "$lib/stores.ts";

  import CircularProgress from "@smui/circular-progress";

  import Group from "./Group.svelte";

  let operator = getContext("operator");

  import { RTCOperator } from "./rtc/RTCOperator";

  import CallButton from "./callbutton/CallButtonOperator.svelte";
  // import BurgerMenu from './menu/BurgerMenu.svelte';

  import Download from "./Download.svelte";

  import Module from "../lesson/Module.svelte";

  import RecordedVideo from "./RecordedVideo.svelte";

  import pkg from "lodash";
  const { find } = pkg;

  import { msg } from "$lib/stores.ts";
  $: if ($msg) {
    OnMessage($msg, null);
    // $msg = ''
  }

  let dlg_display = "";

  export let loadTabs;

  function SetDlgDisplay() {
    $view = "chat";
  }

  setContext("SetDlgDisplay", SetDlgDisplay);

  // $: if ($view === "chat") {
  //   dlg_display = "none";
  // } else dlg_display = "none";

  $posterst = "assets/operator.svg";

  // let $rtc: any;

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
  let rtcSupportText = "";
  let debug_div: any;

  $call_but_status = "inactive";

  let chatComponent;

  import { editable } from "$lib/stores.ts";
  import { Transloc } from "../translate/Transloc";
  $: if ($editable) {
    edited_display = $editable;
  }

  operator.type = "operator";

  export let tabs = ["УРОК", "ЧАТ"];
  let active = "УРОК";

  const abonent = operator.abonent;
  const name = operator.name;

  let container;

  const headers = {
    "Content-Type": "application/json",
  };

  let isHidden = false;

  onMount(async () => {
    checkWebRTCSupport();

    try {
      $signal = new SignalingChannel(operator);
      $rtc = new RTCOperator(operator, name, $signal);
      initRTC();
    } catch (ex) {
      console.log();
    }

    try {
    } catch (ex) {
      console.log("Web Audio API is not supported in this browser");
    }

    // Добавьте слушателя событий для скрытия списка команд при клике за его пределами
    // document.addEventListener('click', handleOutsideClick);
    if (detectDevice())
      document.addEventListener("visibilitychange", handleVisibilityChange);

    setTimeout(() => {
      if (!operator.lvl && abonent === "public") {
        // $view = "chat";
      }
    }, 1000);
  });

  function handleVisibilityChange() {
    isHidden = document.hidden;
    if (isHidden) {
      console.log("Страница ушла в фоновый режим");
      location.reload(); // Перезагрузка страницы
    } else {
      console.log("Страница активна");
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
      rtcSupportText = "WebRTC не поддерживается вашим браузером";
    } else {
      rtcSupportText = " ";
    }
  }

  let progress = {
    display: "block",
    value: 0,
  };

  let local = writable({
    video: {
      display: "none",
      srcObject: "",
      poster: "",
    },
    audio: {
      paused: false,
      src: "",
    },
  });

  setContext("local", local);

  let remote = writable({
    text: {
      display: "none",
      msg: "",
      name: "",
      email: "",
    },
    video: {
      display: "none",
      srcObject: "",
      poster: "/assets/operator.svg",
    },
  });

  setContext("remote", remote);

  let profile = {
    display: "none",
  };

  if (operator.operator === abonent) {
    operator.role = "admin";
  } else {
    operator.role = "user";
  }

  function onTransFile(params: any) {
    let event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    document.getElementById("files").dispatchEvent(event);
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
    // $rtc ..set($rtc .;
    //$rtc .type = "operator";

    $rtc.PlayCallCnt = () => {
      // video_progress = false;

      $local.audio.paused = false;

      call_cnt = 10;

      inter = setInterval(function () {
        call_cnt--;

        if (call_cnt === 0) {
          clearInterval(inter);
          call_cnt = 10;
          $local.audio.paused = true;
          return;
        }
      }, 2000);

      return;
    };

    $rtc.GetRemoteVideo = () => {
      return $remote.video.srcObject;
    };

    $rtc.SetLocalVideo = (src: string) => {
      if (src) {
        // $local.video.srcObject = src;
      }
    };

    $rtc.SetRemoteVideo = async (src: string) => {
      // if ($call_but_status === 'talk') {
      $remote.video.poster = $posterst;
      // $local.audio.paused = true;
      $remote.video.srcObject = src;
      $remote.video.display = "block";

      const ls = await $rtc.localStream;
      ls.getAudioTracks().forEach((track) => (track.enabled = false)); //микрофон выключен

      // }
    };
  }

  function OnLongPress() {
    selected.display = true;
  }

  export function OnClickCallButton() {
    console.log("OnClickCallButton");
    switch ($call_but_status) {
      case "inactive":
        try {
          $remote.video.srcObject = "";
          // Добавьте слушателя событий для скрытия списка команд при клике за его пределами
          // document.addEventListener('click', handleOutsideClick);
          if (detectDevice())
            document.addEventListener(
              "visibilitychange",
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
        // if (window.user?.$localSound) {

        //   const $localSoundSrc = audioCtx.createMediaElementSource(window.user?.$localSound);

        //   // Подключение к выходному устройству
        //   $localSoundSrc.connect(audioCtx.destination);

        //   // Сохранение источника (если необходимо)
        //   $rtc.$localSoundSrc = $localSoundSrc;

        // } else {
        //   console.log('No $local sound element found.');
        // }

        $rtc.Offer();

        $call_but_status = "active";
        break;

      case "active":
        $call_but_status = "inactive";
        $rtc.OnInactive();

        break;
      case "call":
        if ($dc_state && !$click_call_func) {
          $call_but_status = "talk";
          isRemoteAudioMute = false;
          $rtc.OnTalk();
          video_button_display = true;
          $remote.text.display = "none";
        } else {
          $call_but_status = "inactive";
          $remote.video.srcObject = "";
          $rtc.DC.SendDCClose();
          $rtc.OnInactive();
        }

        $local.audio.paused = true;
        clearInterval(inter);
        call_cnt = 10;

        // const dispatch = createEventDispatcher();
        // dispatch('talk');
        // const event = new Event('talk');
        // document.getElementsByTagName('body')[0].dispatchEvent(event);

        break;
      case "talk":
        $local.video.display = "none";
        $local.audio.paused = true;
        video_button_display = false;
        $remote.video.display = "none";
        $remote.video.srcObject = "";
        $remote.video.poster = "";
        $remote.text.display = "none";
        $remote.text.name = "";
        $remote.text.email = "";

        $call_but_status = "inactive";
        $rtc.DC.SendDCClose();

        $rtc.DC.CloseDC();

        $rtc.OnInactive();

        $users = $users;

        break;
      default:
        return;
    }
  }

  $: if ($click_call_func) {
    console.log();
  }

  $: if ($call_but_status) {
    console.log($call_but_status);
  }

  function openProfile(id) {
    profile.display = "block";
  }

  function OnClickVideoButton() {
    $call_but_status = "talk";
    $local.audio.paused = true;
    $local.video.display = "block";
    video_button_display = false;
    video_progress = true;

    if ($rtc.DC.dc.readyState === "open") {
      $rtc.SendVideoOffer($rtc.main_pc);
    }
  }

  function OnPlayVideo() {
    video_progress = false;
  }

  $: switch ($con_state) {
    case "disconnected":
      // $call_but_status = 'inactive';
      break;
  }

  /*TODO: дает*/
  $: switch ($dc_state) {
    case "open":
      $call_but_status = "call"; //дубль
      $local.audio.paused = true;
      break;
    case "close":
      // $call_but_status = "inactive";
      // $remote.video.display = "none";
      $local.audio.paused = true;
      break;
    case "talk":
      $remote.video.display = "none";
      $local.audio.paused = false;
      break;
  }

  function OnMessage(data: any, resolve: any) {
    if (data.func === "close") {
      $call_but_status = "inactive";
      $rtc.DC.CloseDC();
      $local.audio.paused = true;
    }

    if (data.call || data.func === "call") {
      // $call_but_status = 'call';//дубль
      $remote.text.display = "block";
      video_button_display = false;
      $local.audio.paused = false;

      if (data.profile) {
        // $remote.video.poster = data.profile.img;
        if (data.profile.img) $remote.video.display = "block";

        $remote.text.name = data.profile.name;
        $remote.text.email = data.profile.email;
      }

      if ($click_call_func) $rtc.OnCall();
    }

    if (data.func === "talk") {
      $call_but_status = "talk";
      $local.audio.paused = true;
      video_button_display = true;
      $remote.text.display = "none";
    }

    if (data.camera) {
      $local.video.src = that.$localStream;
    }

    if (data.lesson) {
      $view = "module";
      $lesson.data = data.lesson;
    }
  }

  function toggle_remote_audio() {
    isRemoteAudioMute = !isRemoteAudioMute;
  }

  async function OnClickTab(tab) {
    if (tab === tabs[1]) {
      $view = "group";
    } else if (tab === tabs[0]) {
      if ($view === "module") $lesson.data = { quiz: "" };
      $view = "module";
    }
  }

  onDestroy(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });
</script>

{#if $view === "level"}
  <Level></Level>
{:else}
  <div style="position: fixed;">
    <TabBar {tabs} let:tab bind:active>
      <Tab
        {tab}
        minWidth
        on:click={() => {
          OnClickTab(tab);
        }}
      >
        <div style=" text-align: left;">
          <Button
            class="lvl_span"
            style="position: relative;"
            color="secondary"
          >
            <Label>
              {tab}
            </Label>
          </Button>
        </div>
      </Tab>
    </TabBar>
  </div>

  <div
    style="
    display: flex;
    flex-direction: column;
    height: 95vh;
    top: 50px;
    position: relative;
    overflow-y: hidden"
  >
    <div style="flex: 1;   ">
      {#if $view === "group"}
        <div>
          <Group />
        </div>
      {/if}

      {#if $view === "module"}
        <div>
          <Module data={operator} />
        </div>
      {/if}

      {#if $view === "chat"}
        <div>
          <Chat
            prompt_type="basic"
            isHearing="true"
            bind:this={chatComponent}
          />
        </div>
      {/if}
    </div>
  </div>

  <!-- <div class="empty" style="position:relative;height:70px"></div> -->
{/if}

<style lang="scss">
  /* Hide everything above this component. */
  :global(.mdc-tab) {
    max-width: 20vw;
  }
  .active {
    color: #007bff; /* Выбранный цвет */
    font-weight: bold;
  }
  .bottom-app-bar-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    transform: translateY(0); // Позиция панели по умолчанию
    transition: transform 0.7s ease; // Плавное появление
  }
  .hide {
    // display: none;
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
