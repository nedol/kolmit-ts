<script lang="ts">
  import { onMount, setContext } from "svelte";
  import Operator from "./operator/Operator.svelte";
  import Login from "./site/Login.svelte";
  import Chat from "./operator/chat/Chat.svelte";
  import { SignalingChannel } from "./signalingChannel.ts";
  import {
    lesson,
    signal,
    langs,
    ice_conf,
    view,
    users,
    showBottomAppBar,
    click_call_func,
    call_but_status,
    rtc,
    dc_state,
  } from "$lib/stores.ts";

  $view = "greeting";

  import ISO6391 from "iso-google-locales";

  import CallButton from "./operator/callbutton/CallButtonOperator.svelte";

  import { Transloc } from "./translate/Transloc";

  import Tab from "@smui/tab";
  import TabBar from "@smui/tab-bar";

  import Button, { Label } from "@smui/button";
  import { Icon } from "@smui/icon-button";

  import Badge from "@smui-extra/badge";

  import langs_list from "$lib/dict/google_lang_list.json";

  import Module from "./lesson/Module.svelte";

  import Level from "./Level.svelte";
  import TopAppBar, { Row, Title, Section } from "@smui/top-app-bar";

  let tabs = [];

  let chatComponent;

  let active = "УРОК";

  let lang_menu = false;
  interface OperatorData {
    operator: string;
    abonent: string;
    name: string;
    picture: string;
    lang: string;
  }

  interface GroupData {
    group: string[];
    level?: string;
  }

  interface Data {
    operator: OperatorData[];
    group: GroupData[];
    abonent: string;
    ice_conf: Record<string, any>; // или конкретный интерфейс
    cookies?: string;
  }

  export let data: Data;

  let operator: OperatorData | undefined;
  let abonent: string | undefined;
  let name: string | undefined;
  let user_pic: string | undefined;

  let lvl = ""; // = new URL(window.location.href).searchParams.get('lvl')||''

  if (!data.group) {
    $view = "login";
  }

  if (data.group[0]?.level >= 0) {
    setContext("level", data.group[0].level);
  }

  const firstOperator = data.operator[0];

  setContext("operator", firstOperator);
  setContext("abonent", data.abonent);

  onMount(async () => {
    loadTabs();
    Init();

    if (!operator) {
      view.set("login");
    }
  });

  function Init() {
    // Не очищаем весь localStorage, а только нужное
    localStorage.removeItem("kolmit_user");

    if (data.group[0]?.lvl) {
      $view = "module";
    }

    operator = firstOperator;
    operator.level = data.group[0].level;
    abonent = firstOperator.abonent;
    name = firstOperator.name;
    user_pic = firstOperator.picture;

    $signal = new SignalingChannel(firstOperator.operator);

    if ($view == "greeting") {
      chatComponent.Init("Begin een gesprek in het Nederlands.");
    }

    langs.set(
      data.cookies ? JSON.parse(data.cookies).lang : firstOperator.lang
    );

    ice_conf.set(data.ice_conf);

    lvl = operator?.lvl || "";
  }

  function setLang(ev) {
    let lang = ev.currentTarget.outerText;
    let code = ISO6391.getCode(lang);
    if (code !== "English") {
      $langs = code;
    }
    // console.log($langs);
    lang_menu = false;

    loadTabs();

    fetch(`./?func=cookie&abonent=${abonent}&lang=${$langs}&lvl=${lvl}`)
      .then(() => console.log())
      .catch((error) => {
        console.log(error);
      });
  }

  function OnClickCallButton() {
    console.log("OnClickCallButton");
    switch ($call_but_status) {
      case "inactive":
        try {
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
        // if (window.user?.localSound) {

        //   const localSoundSrc = audioCtx.createMediaElementSource(window.user?.localSound);

        //   // Подключение к выходному устройству
        //   localSoundSrc.connect(audioCtx.destination);

        //   // Сохранение источника (если необходимо)
        //   $rtc.localSoundSrc = localSoundSrc;

        // } else {
        //   console.log('No local sound element found.');
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
          remote.text.display = "none";
        } else {
          $call_but_status = "inactive";
        }

        local.audio.paused = true;
        clearInterval(inter);
        call_cnt = 10;

        // const dispatch = createEventDispatcher();
        // dispatch('talk');
        // const event = new Event('talk');
        // document.getElementsByTagName('body')[0].dispatchEvent(event);

        break;
      case "talk":
        local.video.display = "none";
        local.audio.paused = true;
        video_button_display = false;
        remote.video.display = "none";
        remote.video.srcObject = "";
        remote.video.poster = "";
        remote.text.display = "none";
        remote.text.name = "";
        remote.text.email = "";

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

  const loadTabs = async () => {
    const titles = ["ИИ", "УРОК", "ЧАТ"];
    tabs = await Promise.all(
      titles.map(async (title) => {
        const translated = await Transloc(title, "ru", $langs, "");
        return translated.slice(0, 4);
      })
    );
  };
</script>

{#if $view === "greeting"}
  <div style="display: {$view === 'greeting' ? 'block' : 'none'}">
    <!-- <Chat prompt_type={"greeting"} bind:this={chatComponent} /> -->
  </div>
{:else if $view === "login"}
  <Login {operator} {abonent} {user_pic} />
{:else}
  <div>
    <Operator {operator} {abonent} {name} {tabs} />
  </div>

  <div class="callbutton">
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

  <span class="lvl_span">
    {lvl}
  </span>

  <span
    class="lang_span"
    on:click={() => {
      lang_menu = !lang_menu;
    }}
    >{$langs}

    <!-- {#await Transloc('Язык', 'ru', $langs,'') then data}
          {data}
        {/await}       -->
    <!-- <Badge aria-label="unread count"  >{$langs}</Badge> -->
  </span>

  {#if lang_menu}
    <div class="lang_list">
      {#each langs_list as lang}
        <div
          style="color:black;width:min-content; margin:10px;font-size:smaller"
          on:click={setLang}
        >
          {lang}
        </div>
      {/each}
    </div>
  {/if}
{/if}

<style>
  :global(.mdc-tab) {
    min-width: 0px;
    padding-right: 5px;
    padding-left: 5px;
  }
  :global(.mdc-tab__ripple) {
    width: 100%;
  }
  :global(.lvl_span .smui-badge) {
    color: black;
    background-color: transparent;
    border: 1px solid grey;
  }
  :global(.lang_span .smui-badge) {
    position: absolute;
    color: black;
    background-color: transparent;
    border: 1px solid grey;
  }
  .active {
    color: #007bff; /* Выбранный цвет */
    font-weight: bold;
  }

  .callbutton {
    position: absolute;
    top: 12px;
    width: 25px;
    height: 25px;
    right: 150px;
    border: 0px solid;
    color: gray;
    border-radius: 50%;
    padding: 0px;
    font-size: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lang_span {
    position: absolute;
    top: 12px;
    width: 25px;
    height: 25px;
    right: 20px;
    border: 1px solid;
    color: gray;
    border-radius: 50%;
    padding: 0px;
    font-size: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lvl_span {
    display: flex;
    position: absolute;
    top: 12px;
    width: 25px;
    height: 25px;
    right: 70px;
    border: 1px solid;
    color: white;
    background-color: red;
    border-radius: 50%;
    padding: 0px;
    font-size: 1em;
    align-items: center;
    justify-content: center;
  }

  .lang_list {
    position: absolute;
    right: 0;
    top: 50px;
    height: 80vh;
    overflow: auto;
    justify-content: center; /* Выравниваем содержимое по центру вертикально */
    align-items: center; /* Выравниваем содержимое по центру горизонтально */
    background-color: white;
    /* opacity: 50%; */
  }

  @media screen and (min-width: 768px) {
    /* Ваши стили для более крупных экранов здесь */
    :global(.mdc-tab) {
      padding-right: 15px;
      padding-left: 15px;
    }

    .lvl_span {
      right: 100px;
    }
  }
</style>
