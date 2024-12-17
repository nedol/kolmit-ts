<script lang="ts">
  import {
    onMount , onDestroy, getContext, 
    setContext,
  } from 'svelte';

  import { page, navigating, updated } from '$app/stores';

  import langs_list from '$lib/dict/google_lang_list.json';

  import ISO6391 from 'iso-google-locales';

  // let langs_list = JSON.parse(localStorage.getItem('langs_list'));
  //ISO6391.getAllNames();

  import { Translate } from './translate/Transloc.ts';

  import List, { Item, Graphic, Separator, Text } from '@smui/list';

  import TopAppBar, {
    Row,
    Section,
    Title,
    AutoAdjust,
  } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';

  import {
    lesson,
    view,
    langs,
    dicts,
    users,
    editable,
    showBottomAppBar,
  } from '$lib/js/stores.js';

  $: if ($editable) {
    edited_display = $editable;
  }

  $:if($users){
    console.log($users)
  }


  let menu = 'menu';

  let topAppBar;
  let abonent = '';

  const lvl = getContext('lvl')||'';

  onMount(async () => {
    let params = new URL(document.location).searchParams;
    abonent = params.get('abonent');
 
  });

  let lang_menu = false;

  $: if ($dicts && !$dicts['CLASS'][$langs]) {
    (async () => {
      try {
        $dicts['CLASS'][$langs] = await Translate(
          $dicts['CLASS']['en'],
          $langs
        );
      } catch (ex) {
        let name = ISO6391.getName($langs);
        let ind = langs_list.indexOf(name);
        if (ind !== -1) {
          let ar = langs_list.splice(ind, 1);
          $langs = 'en';
        }
      }
    })();
  }

  $: if ($dicts && !$dicts['LESSON'][$langs]) {
    (async () => {
      try {
        $dicts['LESSON'][$langs] = await Translate(
          $dicts['LESSON']['en'],
          $langs
        );
      } catch (ex) {
        console.log(ex);
        $langs = 'en';
      }
    })();
  }

  function setLang(ev) {
    let lang = ev.currentTarget.outerText;
    let code = ISO6391.getCode(lang);
    if (code !== 'English') {
      $langs = code;
    }
    // console.log($langs);
    lang_menu = false;

    fetch(`./?func=cookie&abonent=${abonent}&lang=${$langs}`)
      .then(() => console.log())
      .catch((error) => {
        console.log(error);
      });
  }
</script>

{#if $dicts && $langs && $dicts['CLASS'][$langs]}
  <header>
    <div class="top-app-bar-container flexor">
      <TopAppBar bind:this={topAppBar} variant="fixed" dense>
        <span style="position:absolute;font-size:.8em;left:0;bottom:2px;color:white;">{lvl}</span>
        <Row>
          <div class="sec_items">
            {#if $view !== 'login'}
              <Section>
                {#await Translate('Quit the exercise?', 'en', $langs) then data}
                <div class={$view !== 'lesson' ? 'active' : ''}>
              
                  <Title
                    on:click={() => {
                      if ($lesson.data?.quiz) {
                        if (confirm(data)) {
                          $view = 'group';
                          $showBottomAppBar = true;
                        }
                      } else {
                        $view = 'group';
                        $showBottomAppBar = true;
                      }
                    }}
                  >
               
                  {#await Translate('КЛАСС', 'ru', $langs) then data}
                    <span>{data.toUpperCase()}</span>
                  {/await}
                    
                    <span >{Object.keys($users).length>0?`(${Object.keys($users).length})`:''}</span>

                  </Title>
                </div>
                
                <div class={$view === 'lesson' ? 'active' : ''}>
                  <Title
                    on:click={async () => {
                      if ($lesson.data?.quiz) {
                        if (confirm(data)) {
                          $lesson.data = { quiz: '' };
                          $view = 'lesson';
                          $showBottomAppBar = true;
                        }
                      } else {
                        $lesson.data = { quiz: '' };
                        $view = 'lesson';
                        $showBottomAppBar = true;
                      }
                    }}
                  >
                    {#await Translate('УРОК', 'ru', $langs) then data}
                    <span>{data.toUpperCase()}</span>
                  {/await}
                  </Title>
                </div>
                
                {/await}
                <!-- <IconButton class="material-icons" aria-label="Bookmark this page">bookmark</IconButton> -->
              </Section>
            {/if}
      
        </div>

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
              style="color:black; margin:10px;font-size:smaller"
              on:click={setLang}
            >
              {lang}
            </div>
          {/each}
        </div>
      {/if}
    </Row>
      </TopAppBar>
      <div class="flexor-content"></div>
    </div>
  </header>
{/if}

<style>
  header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .active {
  color: #007bff; /* Выбранный цвет */
  font-weight: bold;
}


  .top-app-bar-container {
    top: 0;
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    margin: 0 18px 18px 0;
    background-color: var(--mdc-theme-background, #fff);

    overflow: auto;
    display: inline-block;
  }

  .lang_span {
    font-size: medium;
    position: absolute;
    top:25px;
    right: 25px;
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

  img {
    width: 30px;
    opacity: 100%;
  }

  .sec_items {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }


  button.sec_right {
    left: 100px;
  }

  @media (max-width: 480px) {
    .top-app-bar-container {
      margin-right: 0;
    }
  }

  .flexy {
    display: flex;
    flex-wrap: wrap;
  }

  .flexor {
    display: inline-flex;
    flex-direction: column;
  }

  .flexor-content {
    flex-basis: 0;
    /* height: 100vh; */
    flex-grow: 1;
    overflow: auto;
  }

</style>
