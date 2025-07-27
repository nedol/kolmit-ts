<script lang="ts">
  import { onMount, setContext } from "svelte";
  import Operator from "./operator/Operator.svelte";
  import Login from "./site/Login.svelte";

  import { SignalingChannel } from "./signalingChannel.ts";
  import {
    lesson,
    signal,
    langs,
    ice_conf,
    view,
    mediaStream,
  } from "$lib/stores.ts";

  import AddToHome from "$lib/components/AddToHome.svelte";

  $view = "";

  import ISO6391 from "iso-google-locales";

  import CallButton from "./operator/callbutton/CallButtonOperator.svelte";

  import { Transloc } from "./translate/Transloc";

  import langs_list from "$lib/dict/google_lang_list.json";
  import Level from "./Level.svelte";

  let operatorComponent: Operator = "";

  let tabs = [];

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

  if (data.group && data.group[0].level >= 0) {
    setContext("level", data.group[0].level);
  }

  const firstOperator = data.operator[0];

  setContext("operator", firstOperator);
  setContext("abonent", data.abonent);

  const loadTabs = async () => {
    const titles = ["УРОК", "ЧАТ"];
    tabs = await Promise.all(
      titles.map(async (title) => {
        const translated = await Transloc(title, "ru", $langs, "");
        return translated.slice(0, 4);
      })
    );
  };

  onMount(async () => {
    $mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 48000,
        sampleSize: 16,
      },
      // video: {
      //   width: { ideal: 1280 },
      //   height: { ideal: 720 },
      //   frameRate: { ideal: 30 },
      // },
    });

    if (!data.operator[0].operator) {
      $view = "login";
    } else {
      Init();
      if (!data.operator[0].lvl) $view = "level";
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

    if ($view == "level") {
      // chatComponent.Init("Begin een gesprek in het Nederlands.");
    }

    langs.set(
      data.cookies ? JSON.parse(data.cookies).lang : firstOperator.lang
    );

    loadTabs();

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
</script>

{#if $view === "level"}
  <Level></Level>
{:else if $view === "login"}
  <Login {operator} {abonent} {user_pic} />
{:else}
  <AddToHome />
  <div>
    <Operator
      bind:this={operatorComponent}
      {operator}
      {abonent}
      {name}
      {tabs}
    />
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
    max-width: 15vw;
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

  .lang_span {
    position: absolute;
    top: 12px;
    width: 25px;
    height: 25px;
    right: 5vw;
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
    right: 20vw;
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
    z-index: 5;
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
