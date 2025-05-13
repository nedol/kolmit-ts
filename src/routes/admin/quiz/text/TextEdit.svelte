<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import Accordion, { Panel, Header } from '@smui-extra/accordion';
  import Paper, { Content } from '@smui/paper';
  import IconButton, { Icon } from '@smui/icon-button';
  import {
    mdiPagePreviousOutline,
    mdiChevronDownCircleOutline,
    mdiHelp,
    mdiVolumeHigh,
    mdiPause,
    mdiPlay,
  } from '@mdi/js';

  import { slide } from 'svelte/transition';

  const abonent = getContext('abonent');

  export let data;

  let woorden = data.words,
    orig_text = '',
    text = '',
    prompt = '',
    content = '',
    format = '',
    trans_div;

  let touchStartTime = 0;
  function onTouchStart(event) {
    // Запомните время начала касания
    touchStartTime = new Date().getTime();
  }

  $: if (data.name) {
    init();
  }

  async function init() {
    if (!orig_text)
      fetch(
        `/lesson?text=theme&level=${data.level}&theme=${data.theme}&title=${data.name}&abonent=${abonent}`
      )
        .then((response) => response.json())
        .then((data) => {
          orig_text = text = data.data.text;
          fetchText();
        })
        .catch((error) => {
          console.log(error);
          return [];
        });
  }

  let isCollapsed = true;
  function toggleCollapse() {
    isCollapsed.update((n) => !n);
  }

  let active = 'Words';

  async function onSelectionEnd(event) {
    let x, y;
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - touchStartTime;
    if (touchDuration >= 500) {
      if (selection && selection.toString().trim() !== '') {
        if (event.target.attributes['trans']) {
          x = rect.x;
          y = rect.y - 28 + window.scrollY;
          trans_div.style.top = `${y}px`;
          trans_div.style.left = `${x}px`;
          trans_div.style.visibility = 'visible';
          trans = event.target.attributes['trans'].nodeValue;
          await TTSSpeak(event.target.innerText);
          return;
        }

        // Выделение текста завершено
        const selectedText = selection.toString().trim();
        trans = await Transloc(selectedText);
        x = rect.x;
        y = rect.y - 28 + window.scrollY;

        trans_div.style.top = `${y}px`;
        trans_div.style.left = `${x}px`;
        trans_div.style.visibility = 'visible';
      }
    }
  }

  function CopyPrompt(ev: MouseEvent) {
    // let dt = dialog_task.innerHTML.replace(/<[^>]+>/gi, '');
    const stringToCopy = prompt;
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard
          .writeText(stringToCopy)
          .then(() => {
            console.log('Строка скопирована в буфер обмена');
            active = 'Content';
            content = '';
          })
          .catch((err) => {
            console.error('Ошибка при копировании строки: ', err);
          });
      } else {
        console.error('Доступ к буферу обмена не разрешен.');
      }
    });
  }

  function OnChangeContent(ev: Event) {
    // console.log(ev.currentTarget.value)
    try {
      if (ev.currentTarget.value) {
        data.content = data.content.concat(JSON.parse(ev.currentTarget.value));
        console.log(data.content);
      } else content = '';
    } catch (ex) {
      console.log(ex);
    }
  }

  function PasteContent(ev: MouseEvent) {
    // Вставляем содержимое буфера обмена в <textarea>
    navigator.clipboard
      .readText()
      .then((text) => {
        content = text;
        data.content = data.content.concat(JSON.parse(text));
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }

  async function CreateContent() {}
</script>

<main>
  <div class="container">
    <div class="dialog-field">
      <label for="text_name">Название</label>
      <input
        type="text"
        class="text_name"
        name="text_name"
        bind:value={data.name}
      />
    </div>
    {#if data.level}
      <div class="dialog-field">
        <label for="dialog_level">Уровень</label>
        <div class="dialog_level" name="dialog_level">{data.level}</div>
      </div>
    {/if}

    {#if data.llang}
      <div class="dialog-field">
        <label for="dialog_lang">Язык</label>
        <div type="text" class="dialog_lang" name="dialog_lang">
          {data.llang}
        </div>
      </div>
    {/if}
  </div>

  <div class="accordion-container">
    <Accordion>
      <Panel class="generator_container">
        <Header>
          <h3>Content-generator</h3>
          <IconButton class="material-icons">
            <Icon tag="svg" viewBox="0 0 24 24">
              <path fill="currentColor" d={mdiChevronDownCircleOutline} />
            </Icon>
          </IconButton>
        </Header>
        <Content>
          <TabBar
            tabs={['Format', 'Words', 'Prompt', 'Content']}
            let:tab
            bind:active
          >
            <Tab {tab} minWidth>
              <Label>{tab}</Label>
            </Tab>
          </TabBar>
          {#if active === 'Format'}
            <Paper variant="unelevated">
              <Content>
                <textarea rows="20" name="dialog_grammar" bind:value={format}
                ></textarea></Content
              >
            </Paper>
          {:else if active === 'Words'}
            <Paper variant="unelevated">
              <Content>
                <textarea rows="20" name="dialog_words" bind:value={data.words}
                ></textarea></Content
              >
            </Paper>
          {:else if active === 'Prompt'}
            <Paper variant="unelevated">
              <Content>
                <textarea rows="20" name="dialog_task" bind:value={prompt}
                ></textarea>
                <!-- <div contenteditable="true" bind:this={dialog_task}>
                {@html prompt}
              </div> -->
                <button class="copy_prompt" on:click={CopyPrompt}
                  >Copy Prompt</button
                ></Content
              >
            </Paper>
          {:else if active === 'Content'}
            <Paper variant="unelevated">
              <Content
                ><textarea
                  id="dialog_content"
                  rows="10"
                  name="dialog_content"
                  placeholder="Run your favorite AI chat with the copied prompt and paste result here"
                  on:input={OnChangeContent}
                  bind:value={content}
                ></textarea>
                <button class="paste_content" on:click={PasteContent}
                  >Paste Content</button
                ></Content
              >
            </Paper>
          {/if}
        </Content>
      </Panel>
    </Accordion>
  </div>

  <div class="accordion-container">
    <Accordion>
      <Panel>
        <Header>
          <h3>{data.name}</h3>
          <IconButton class="material-icons">
            <Icon tag="svg" viewBox="0 0 24 24">
              <path fill="currentColor" d={mdiChevronDownCircleOutline} />
            </Icon>
          </IconButton>
        </Header>
        <Content style="line-height: 2.2;">
          <div
            contenteditable
            class="text_container"
            style="height:{window.innerHeight};"
            on:touchend={onSelectionEnd}
            on:mouseup={onSelectionEnd}
          >
            {@html text}
          </div>
        </Content>
      </Panel>
    </Accordion>
  </div>
</main>

<style>
  main {
    text-align: center;
    width: 90%;
    margin: 0 auto;
  }
</style>
