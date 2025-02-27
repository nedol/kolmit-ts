<script lang="ts">
  import {
    onMount /*, onDestroy, getContext, setContext*/,
    setContext,
  } from 'svelte';
  import TopAppBar, { Row, Title, Section } from '@smui/top-app-bar';
  import { dicts, langs, view, lesson } from '$lib/stores.ts';
  import google_langs_list from '$lib/dict/google_lang_list.json';
  import ISO6391 from 'iso-google-locales';
  import { Translate } from '../translate/Transloc';

  let topAppBar;
  let abonent;
  let  lang_menu = false;

  onMount(async () => {
    let params = new URL(document.location).searchParams;
    abonent = params.get('abonent');
  });

  function OnSetLang(ev) {
    let lang = ev.currentTarget.outerText;
    let code = ISO6391.getCode(lang);
    if (code !== 'English') {
      $langs = code;
    }
    // console.log($langs);
    lang_menu = false;


     fetch(`/?func=set_lang&abonent=${abonent}&admin==${abonent}&lang=${$langs}`)
      .then(() => console.log())
      .catch((error) => {
        console.log(error);
      });
  }

</script>

<!-- {#if $dicts && $langs && $dicts['CLASS'][$langs]} -->
<header>
  <div class="top-app-bar-container flexor">
    <TopAppBar bind:this={topAppBar} variant="fixed" dense>
      <Row>
        <div class="sec_items">
          {#if $view !== 'login'}
            <Section>
              {#await Translate('GROUP', 'en', $langs) then data}
                <Title
                  on:click={() => {
                    $view = 'group';
                  }}>{data}</Title
                >
              {/await}
              {#await Translate('LESSON', 'en', $langs) then data}
                <Title
                  on:click={async () => {
                    console.log();
                    $lesson.data = { quiz: '' };
                    $view = 'lesson';
                  }}>{data}</Title
                >
              {/await}
              <!-- <IconButton class="material-icons" aria-label="Bookmark this page">bookmark</IconButton> -->
            </Section>
          {/if}
        </div>

        <Section align="end">
          <span
            class="lang_span"
            on:click={() => {
              lang_menu = !lang_menu;
            }}
            >{(() => {
              return ISO6391.getNativeName($langs);
            })()}</span
          >
          {#if lang_menu}
            <div class="lang_list">
              {#each google_langs_list as lang}
                <div
                  style="color:black; margin:10px;font-size:smaller"
                  on:click={OnSetLang}
                >
                  {lang}
                </div>
              {/each}
            </div>
          {/if}
        </Section>
      </Row>
    </TopAppBar>
    <div class="flexor-content"></div>
  </div>
</header>

<!-- {/if} -->

<style>
  header {
    position: absolute;
    display: flex;
    justify-content: space-between;
    top: 0;
    width: 100%;
  }
  .top-app-bar-container {
    /* max-width: 480px; */
    /* width: 100%; */
    /* height: 100vh; */
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    margin: 0 18px 18px 0;
    background-color: var(--mdc-theme-background, #fff);

    overflow: auto;
    display: inline-block;
  }

  .lang_span {
    font-size: smaller;
    bottom: -15px;
    position: relative;
  }

  .lang_list {
    position: absolute;
    top: 50px;
    height: 75vh;
    overflow: auto;
    justify-content: center; /* Выравниваем содержимое по центру вертикально */
    align-items: center; /* Выравниваем содержимое по центру горизонтально */
    background-color: darkturquoise;
  }
</style>
