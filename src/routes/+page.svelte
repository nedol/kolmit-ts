<script lang="ts">
  import { onMount, setContext } from "svelte";
  import Operator from "./operator/Operator.svelte";
  import Login from "./site/Login.svelte";
  import Chat from "./operator/chat/Chat.svelte";
  import { SignalingChannel } from "./signalingChannel.ts";
  import { lesson, signal, langs, ice_conf, view } from "$lib/stores.ts";

  $view = "greeting";

  import ISO6391 from "iso-google-locales";

  import CallButton from "./operator/callbutton/CallButtonOperator.svelte";

  import { Transloc } from "./translate/Transloc";

  import langs_list from "$lib/dict/google_lang_list.json";

  let operatorComponent: Operator = "";

  let tabs = [];

  let chatComponent;

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

  onMount(async () => {
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

  const loadTabs = async () => {
    const titles = ["УРОК", "ЧАТ"];
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
    <Operator
      bind:this={operatorComponent}
      {operator}
      {abonent}
      {name}
      {tabs}
    />
  </div>

  <div class="callbutton">
    <CallButton on:click={operatorComponent.OnClickCallButton}>
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

  .callbutton {
    position: absolute;
    top: 20px;
    width: 25px;
    height: 25px;
    right: 140px;
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
