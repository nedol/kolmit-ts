<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import { Transloc } from '../../../translate/Transloc';

  import { langs, llang } from '$lib/stores.ts';

  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import Button from '@smui/button';
  import Paper, { Content } from '@smui/paper';

  import { slide } from 'svelte/transition';
  let isCollapsed = true;

  function toggleCollapse() {
    isCollapsed.update((n) => !n);
  }

  // export let data: any;
  export let ChangeQuizName: any;

  const abonent = getContext('abonent');
  const data = getContext('quiz_data');

  let content: any,
    new_content = false,
    words_data: [];
  const name = data.name;
  let words = [],
    prompt,
    dialog_task: any,
    dialog_words,
    dialog_tmplt;

  let  grammar_title = 'Grammar',
    context_title = 'Context',
    prompt_title = 'Prompt',
    words_title = 'Words',
    content_title = 'Content';

  let active = prompt_title;

   $: if ($langs) {
    (async () => {
      // prompt_title = await translate('Prompt', $langs);
      words_title = await Transloc('Words', 'en', $langs);
      content_title = await Transloc('Content', 'en', $langs);
    })();
  }

  const output = `
  {original:'',example:'',translation:{ [${$langs}]: '',  en: '' }}
  `;

  let system = ``;

  $: if ($langs && prompt) {
    prompt = prompt.replaceAll('${output}', output);
    prompt = prompt.replaceAll('${$llang}', $llang);
    prompt = prompt.replaceAll('${$langs}', $langs);
    prompt = prompt.replaceAll('${words}', words);
  }

  fetch(`./lesson?listen=${data.name[$llang]}&owner=${abonent}&lang=${$llang}`)
    .then((response) => response.json())
    .then((data) => {
      words_data = data.data.data;
      if (words_data) {
        words_data.map((item) => {
          words.push(item.original);
        });
      }

      fetch(`./admin?prompt=listen`)
        .then((response) => response.json())
        .then((data) => {
          prompt = data.resp.system;
          prompt = prompt;
        })
        .catch((error) => {
          console.log(error);
          // dialog_data.content = [];
        });
    })
    .catch((error) => {
      console.log(error);
      words_data = { content: [], lang: '' };
    });

  onMount(() => {
    // const storedData = localStorage.getItem('qaData');
    // if (storedData) {
    // 	words_data = JSON.parse(storedData);
    // }
  });

  function addEmptyRecord() {
    const emptyRecord = {
      original: '',
      infinitive: '',
      translation: { nl: '', ru: '', uk: '', fr: '', en: '', de: '' },
    };
    words_data.push(emptyRecord);
    words_data = words_data;
  }

  // Функция для сохранения текущего состояния в localStorage
  function OnSave() {
    SaveData(name, data.name, words_data);
    // ChangeQuizName(name, data.name);
  }

  async function SaveData(name: string, new_name: string, data: any) {
    const response = await fetch(`/admin/module`, {
      method: 'POST',
      body: JSON.stringify({
        func: 'upd_listen',
        owner: abonent,
        level: data.level,
        name: name[$llang],
        new_name: new_name[$llang],
        lang: $llang,
        data: data,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }

  async function CreateContent() {}

  function OnChangeContent(content) {
    // console.log(ev.currentTarget.value)
    try {
      words_data = JSON.parse(content);
    } catch (ex) {
      console.log(ex);
    }
  }

  function CopyPrompt(ev: MouseEvent) {
    // let dt = dialog_task.innerHTML.replace(/<[^>]+>/gi, '');
    ev.target.focus();
    const stringToCopy = prompt;
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard
          .writeText(stringToCopy)
          .then(() => {
            console.log('Строка скопирована в буфер обмена');
            active = content_title;
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

    function PasteContent() {
    // Вставляем содержимое буфера обмена в <textarea>
    navigator.clipboard
      .readText()
      .then((text) => {
        content = text;
        const parsed = JSON.parse(text);
        words_data = parsed;
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }


  function remRecord(ev) {}
</script>

<div class="word_container">
  <div class="container">
    <div class="word_field">
      {#await Transloc('Название', 'ru', $langs) then data}
        <label for="dialog_name">{data}:</label>
      {/await}
      <input
        type="text"
        class="dialog_name"
        name="dialog_name"
        bind:value={data.name[$llang]}
      />
    </div>
    {#if data.level}
      <div class="word_field">
        {#await Transloc('Уровень', 'ru', $langs) then data}
          <label for="dialog_level">{data}:</label>
        {/await}
        <input
          type="text"
          class="dialog_level"
          name="dialog_level"
          bind:value={data.level}
        />
      </div>
    {/if}

    {#if $llang}
      <div class="word_field">
        {#await Transloc('Язык', 'ru', $langs) then data}
          <label for="dialog_lang">{data}:</label>
        {/await}
        <input
          type="text"
          class="dialog_lang"
          name="dialog_lang"
          bind:value={$llang}
        />
      </div>
    {/if}
  </div>

  {#await Transloc('Контент-генератор', 'ru', $langs) then data}
    <button
      class="content_generator"
      on:click={() => (isCollapsed = !isCollapsed)}
    >
      {data}
    </button>
  {/await}

  {#if !isCollapsed}
    <div class="collapsible" in:slide={{ duration: 300 }}>
      <div class="generator_container">
        <TabBar
              tabs={[
                words_title,
                prompt_title,
                content_title,
              ]}
              let:tab
              bind:active
            >
          <Tab {tab} minWidth>
            <Label>{tab}</Label>
          </Tab>
        </TabBar>
        <!-- {#if active === 'Format'}
          <Paper variant="unelevated">
            <Content>
              <div>
                {@html output}
              </div>
            </Content>
          </Paper> -->
        {#if active === words_title}
          <Paper variant="unelevated">
            <Content>
              <textarea rows="20" name="dialog_words" bind:value={words}
              ></textarea>
            </Content>
          </Paper>
        {:else if active === prompt_title}
          <Paper variant="unelevated">
            <Content>
              <textarea rows="20" name="dialog_task" bind:value={prompt}
              ></textarea>
              {#await Transloc('Копировать промпт', 'ru', $langs) then data}
                <button class="copy_prompt" on:click={CopyPrompt}>{data}</button
                >
              {/await}
            </Content>
          </Paper>
        {:else if active === content_title}
          <Paper variant="unelevated">
            <Content>
              {#await Transloc('Use chatGPT to run copied prompt and paste result here', 'en', $langs) then data}
                <textarea
                  id="dialog_content"
                  rows="20"
                  name="dialog_content"
                  placeholder={data}
                  on:input={OnChangeContent} bind:value={content}></textarea
                >
              {/await}
              <button class="paste_content" on:click={()=>{PasteContent()}}>
                {#await Transloc('Paste Content', 'en', $langs) then data}
                  {data}
                {/await}
              </button>
            </Content>
          </Paper>
        {/if}
      </div>

      <div class="container">
        {#await Transloc('Создать', 'ru', $langs) then data}
          <button class="save" on:click={() => CreateContent()} disabled
            >{data}</button
          >
        {/await}
      </div>
    </div>
  {/if}
  <br />

  <table>
    <thead>
      <tr>
        <th class="col-1">{$llang}</th>
        <th class="col-2">Example</th>
        <th class="col-3">{$langs}</th>
      </tr>
    </thead>
    <tbody>
      {#if words_data}
        {#each words_data as item, index (index)}
          <tr>
            <td>
              {#if item.original}
                <textarea rows="1" bind:value={item.original} />
                {#if item.infinitive  && item.infinitive !== item.original}
                  <textarea rows="1" bind:value={item.infinitive}></textarea>
                {/if}
              {:else}
                <textarea rows="1" />
              {/if}
            </td>
            <td>
              {#if item.example}
                <textarea rows="2" bind:value={item.example} />
              {:else}
                <textarea rows="2" />
              {/if}
            </td>
            <td>
              {#if item.translation && item.translation[$langs]}
                <textarea rows="1" bind:value={item.translation[$langs]} />
              {/if}
            </td>
            <td>
              <button class="remrec_but" on:click={remRecord} {index}>-</button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>

  <div class="container">
    <button class="add-record" on:click={addEmptyRecord}>+</button>
    <div class="container">
      {#await Transloc('Сохранить', 'ru', $langs) then data}
        <button class="save" on:click={() => OnSave()}>{data}</button>
      {/await}
    </div>
  </div>
</div>

<style>
  .word_container {
    margin: 10px;
  }
  .content_generator {
    height: 40px;
    margin-top: 25px;
    width: 100%;
  }
  .collapsible {
    overflow: hidden;
    margin-top: 1rem;
    margin-bottom: 3rem;
    margin-left: 1rem;
  }
  ::selection {
    border: 0;
    background-color: lightblue;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    border: 0px solid black;
    padding: 8px;
    text-align: left;
  }
  .col-1 {
    width: 20%;
  }
  .col-2 {
    width: 50%;
  }
  .col-3 {
    width: 30%;
  }

  .remrec_but {
    scale: 2;
    width: 25px;
    border-radius: 35px;
    border: 0;
    background-color: transparent;
    color: blue;
  }

  .word_field {
    display: inline-block;
    box-sizing: border-box; /* Учтите ширину и отступы внутри элемента */
    margin-right: 10px; /* Установите нужный вам отступ между полями */
  }

  .word_field:first-child {
    width: calc(
      100% - 20% - 10% - 5px
    ); /* 20px - это сумма отступов между полями */
  }

  .word_field:nth-last-child(-n + 2) {
    width: calc(
      20% - 20px
    ); /* 5px - это примерный отступ между последними двумя полями */
  }

  /* Для последнего word_field может потребоваться сброс правого отступа */

  .save {
    margin-top: 10px; /* Отступ для кнопки 'Создать' */
  }

  textarea {
    width: 100%;
    resize: none;
  }

  .add-record {
    height:15px;
    border-radius: 35px;
    border: 0;
    scale: 2;
    color: red;
  }
  .dialog_name,
  .dialog_lang,
  .dialog_level {
    border: 0;
  }
  .container {
    display: flex;
    justify-content: space-between; /* Распределяет контейнеры равномерно по горизонтали */
  }

  .word_field {
    display: flex;
    flex-direction: column; /* Устанавливает вертикальное направление потока */
    margin-right: 20px; /* Добавляет небольшой отступ справа для каждого поля, кроме последнего */
  }

  .word_field:last-child {
    margin-right: 0; /* Убирает отступ справа у последнего поля */
  }
</style>
