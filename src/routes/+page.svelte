<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import Operator from './operator/Operator.svelte';
  import Login from './site/Login.svelte';
  import Chat from './operator/chat/Сhat.svelte';
  import { SignalingChannel } from './signalingChannel.ts';
  import { signal, langs, ice_conf, view, lesson } from '$lib/stores.ts';

  import ISO6391 from 'iso-google-locales';


  import Tab  from '@smui/tab';
  import TabBar from '@smui/tab-bar';

 import { Label } from '@smui/button';
 import{ Icon } from '@smui/icon-button';

 import langs_list from '$lib/dict/google_lang_list.json';

 import Module from './lesson/Module.svelte';

const tabs=[
  'Класс',
  'Урок',
]

  let active = 'Класс';
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

  let lvl  = '';// = new URL(window.location.href).searchParams.get('lvl')||''

  onMount(() => {
    if (!operator) {
      view.set('login');
    }
  });

  function Init() {
    // Не очищаем весь localStorage, а только нужное
    localStorage.removeItem('kolmit_user');

    const firstOperator = data.operator[0];

    if (data.group[0]?.level) {
      setContext('level', data.group[0].level);
    }

    setContext('operator', firstOperator);
    setContext('abonent', data.abonent);

    operator = firstOperator;
    abonent = firstOperator.abonent;
    name = firstOperator.name;
    user_pic = firstOperator.picture;

    signal.set(new SignalingChannel(firstOperator.operator));

    langs.set(data.cookies ? JSON.parse(data.cookies).lang : firstOperator.lang);

    ice_conf.set(data.ice_conf);

    lvl =  operator?.level||'';
  }

  if (data.operator) {
    Init();
  }

  function setLang(ev) {
    let lang = ev.currentTarget.outerText;
    let code = ISO6391.getCode(lang);
    if (code !== 'English') {
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

  function OnClickTab(tab){
    if(tab==='Класс'){
      $view = 'group';
      $lesson.data = { quiz: '' };
    }else if(tab==='Урок'){
      $view = 'lesson'
      $lesson.data = { quiz: '' };
    }
  }
</script>


{#if $view === 'login'}
  <Login {operator} {abonent} {user_pic} />
{:else}

  <TabBar
    {tabs}
    let:tab
    bind:active
  >
    <Tab {tab} minWidth on:click={()=>{OnClickTab(tab)}}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>

    {#if $view === 'group'}
        {#if operator}
          <Operator {operator} {abonent} {name} />
        {/if}

    {:else if $view==='chat'}
      <Chat prompt_type={operator.level?"basic":'greeting'}></Chat>     

    {:else if $view === 'lesson'}
      <Module data={operator}/>   
    {/if}

    <span class="lvl_span">{lvl}</span>
    <span
      class="lang_span"
      on:click={() => {
        lang_menu = !lang_menu;
      }}
      >{(() => {
        return $langs;
      })()}</span
    >
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
  .active {
    color: #007bff; /* Выбранный цвет */
    font-weight: bold;
  }
  .lvl_span{
    font-size: large;
    position: absolute;
    top: 11px;
    right: 80px;
    border: 0px solid aliceblue;
    padding: 5px;
    font-size: .6em;
    color: rgb(148, 35, 35);
  
  }

  .lang_span {
    font-size: medium;
    position: absolute;
    top: 10px;
    right: 20px;
    border: 0px solid aliceblue;
    padding: 5px;
    border-radius: 2px;
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
</style>
