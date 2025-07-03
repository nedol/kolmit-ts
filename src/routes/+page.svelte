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
    showBottomAppBar,
  } from "$lib/stores.ts";

  import ISO6391 from "iso-google-locales";

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
  $view = "module";
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

  let topAppBar;

  let operator: OperatorData | undefined;
  let abonent: string | undefined;
  let name: string | undefined;
  let user_pic: string | undefined;

  let lvl = ""; // = new URL(window.location.href).searchParams.get('lvl')||''

  onMount(async () => {
    if (!operator) {
      view.set("login");
    }
    //  active = await Transloc('УРОК', 'ru', $langs, '');
  });

  $: if ($langs) {
    loadTabs();
  }

  async function loadTabs() {
    tabs = [
      await Transloc("АССИСТЕНТ", "ru", $langs, ""),
      await Transloc("УРОК", "ru", $langs, ""),
      await Transloc("ЧАТ", "ru", $langs, ""),
    ];
  }

  function Init() {
    // Не очищаем весь localStorage, а только нужное
    localStorage.removeItem("kolmit_user");

    const firstOperator = data.operator[0];

    if (data.group[0]?.level) {
      setContext("level", data.group[0].level);
    }

    setContext("operator", firstOperator);
    setContext("abonent", data.abonent);

    operator = firstOperator;
    operator.level = data.group[0].level;
    abonent = firstOperator.abonent;
    name = firstOperator.name;
    user_pic = firstOperator.picture;

    signal.set(new SignalingChannel(firstOperator.operator));

    langs.set(
      data.cookies ? JSON.parse(data.cookies).lang : firstOperator.lang
    );

    ice_conf.set(data.ice_conf);

    lvl = operator?.lvl || "";
  }

  if (data.operator) {
    Init();
  }

  function setLang(ev) {
    let lang = ev.currentTarget.outerText;
    let code = ISO6391.getCode(lang);
    if (code !== "English") {
      $langs = code;
    }
    // console.log($langs);
    lang_menu = false;

    fetch(`./?func=cookie&abonent=${abonent}&lang=${$langs}&lvl=${lvl}`)
      .then(() => console.log())
      .catch((error) => {
        console.log(error);
      });
  }

  async function OnClickTab(tab) {
    if (tab === tabs[1]) {
      $view = "group";
      $showBottomAppBar = true;
    } else if (tab === tabs[2]) {
      if ($view === "module") $lesson.data = { quiz: "" };
      $view = "module";
    } else if (tab === tabs[0]) {
      $view = "chat";
      chatComponent.Init();
      // $lesson.data = { quiz: "" };
    }
  }
</script>

{#if $view === "login"}
  <Login {operator} {abonent} {user_pic} />
{:else}
  <TabBar {tabs} let:tab bind:active>
    <Tab
      {tab}
      minWidth
      on:click={() => {
        OnClickTab(tab);
      }}
    >
      <div style=" text-align: left;">
        <Button class="lvl_span" style="position: relative;" color="secondary">
          <Label>
            {tab}
          </Label>
        </Button>
      </div>
    </Tab>
  </TabBar>

  <div style="display: {$view === 'group' ? 'block' : 'none'}">
    <Operator {operator} {abonent} {name} />
  </div>

  <div style="display: {$view === 'chat' ? 'block' : 'none'}">
    <Chat
      prompt_type={operator?.lvl ? "basic" : "greeting"}
      bind:this={chatComponent}
    />
  </div>

  <div style="display: {$view === 'module' ? 'block' : 'none'}">
    <Module data={operator} />
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
