<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import { langs, llang, dicts } from '$lib/js/stores.js';

  import translate from 'translate';
  translate.engine = 'google';
  translate.from = 'en';

  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import Button from '@smui/button';
  import Paper, { Content } from '@smui/paper';

  let active = 'Content';

  import { slide } from 'svelte/transition';
  let isCollapsed = true;

  function toggleCollapse() {
    isCollapsed.update((n) => !n);
  }

  export let data = {};
  export let ChangeQuizName: any;

  const abonent = getContext('abonent');
  let dict = getContext('dict');

  let content = '',
    new_content = false,
    num = 5;
  let dialog_data = { lang: '', content: [] };
  const name = data.name;

  fetch(`./lesson?listen=${data.name}&owner=${abonent}`)
    .then((response) => response.json())
    .then((data) => {
      dialog_data = data.data.dialog;
      if (data.data.html) {
        dialog_data.html = splitHtmlContent(data.data.html);
      }
      dialog_data.name = name;
    })
    .catch((error) => {
      console.log(error);
      dialog_data = { content: [] };
    });

  let words, dialog_task, dialog_words, dialog_tmplt;

  let system = ``;

  onMount(() => {
    // const storedData = localStorage.getItem('qaData');
    // if (storedData) {
    // 	dialog_data = JSON.parse(storedData);
    // }
  });

  function splitHtmlContent(inputString) {
    // Регулярное выражение для поиска содержимого внутри тегов <html>...</html>
    const regex = /<html>(.*?)<\/html>/gs;

    // Используем matchAll для поиска всех совпадений в строке
    const matches = inputString.matchAll(regex);

    // Преобразуем итератор в массив и извлекаем только содержимое внутри тегов
    const result = Array.from(matches, (match) => match[1]);

    return result;
  }

  // Функция для сохранения текущего состояния в localStorage
  function OnSave() {
    SaveData(name, data.name, dialog_data);
    ChangeQuizName(name, data.name);
  }

  async function SaveData(name, new_name, data) {
    const response = await fetch(`/admin`, {
      method: 'POST',
      body: JSON.stringify({
        func: 'upd_lstn',
        owner: abonent,
        level: '12',
        name: name,
        new_name: new_name,
        data: data,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }

  async function CreateContent() {
    const dialog = dialog_data.content.map((item) => {
      if (item.user1) return item.user1[$langs] + ' - ' + item.user2[$langs];
    });

    let dt = dialog_task.innerHTML.replace(/<[^>]+>/gi, '');
    const response = await fetch(`/chat`, {
      method: 'POST',
      body: JSON.stringify({ topic: name, dialog: dialog }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    new_content = true;
    const data = await response.json();
    // content = data.chat_resp.replace(/\\\"/g, '"');
    content = JSON.stringify(JSON.parse(data.chat_resp).content[0]);
    if (content) {
      dialog_data.content.push(JSON.parse(data.chat_resp).content[0]);
      dialog_data = dialog_data;
    }
  }

  function OnChangeContent(ev) {
    // console.log(ev.currentTarget.value)
    try {
      dialog_data = JSON.parse(ev.currentTarget.value);
    } catch (ex) {
      console.log(ex);
    }
  }

  function CopyPrompt() {
    let dt = dialog_task.innerHTML.replace(/<[^>]+>/gi, '');
    const stringToCopy = task + system + words;
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard
          .writeText(stringToCopy)
          .then(() => {
            console.log('Строка скопирована в буфер обмена');
          })
          .catch((err) => {
            console.error('Ошибка при копировании строки: ', err);
          });
      } else {
        console.error('Доступ к буферу обмена не разрешен.');
      }
    });
  }

  $: if (dict) {
    dict = dict;
  }

  async function Translate(text: string) {
    try {
      translate.from = $llang;

      return (
        ($dicts[text] && $dicts[text][$langs]) ||
        (await translate(text.trim(), $langs))
      );
    } catch (error) {
      console.error('Translation error:', error);
      return text; // или другое подходящее значение по умолчанию
    }
  }
</script>

<main>
  <div class="container">
    <div class="dialog-field">
      {#await translate('Title', $langs) then data}
        <label for="dialog_name">{data}</label>
      {/await}
      <input
        type="text"
        class="dialog_name"
        name="dialog_name"
        bind:value={data.name}
      />
    </div>
    {#if data.level}
      <div class="dialog-field">
        {#await translate('Level', $langs) then data}
          <label for="dialog_name">{data}</label>
        {/await}
        <input
          type="text"
          class="dialog_level"
          name="dialog_level"
          bind:value={data.level}
        />
      </div>
    {/if}

    {#if data.llang}
      <div class="dialog-field">
        {#await translate('Language', $langs) then data}
          <label for="dialog_name">{data}</label>
        {/await}
        <input
          type="text"
          class="dialog_lang"
          name="dialog_lang"
          bind:value={data.llang}
        />
      </div>
    {/if}
  </div>

  <div class="collapsible" in:slide={{ duration: 300 }}>
    <div class="generator_container">
      <TabBar tabs={['Content']} let:tab bind:active>
        <Tab {tab} minWidth>
          <Label>{tab}</Label>
        </Tab>
      </TabBar>
      {#if active === 'Content'}
        <Paper variant="unelevated">
          <Content>
            <textarea rows="20" name="dialog_words" bind:value={content}
            ></textarea>
          </Content>
        </Paper>
      {/if}
    </div>
  </div>

  <div class="container">
    <div class="container">
      <button class="save" on:click={() => OnSave()}>Сохранить</button>
    </div>
  </div>
</main>

<style>
  main {
    margin: 20px;
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

  th {
    background-color: #f2f2f2;
    position: sticky;
    top: 0;
    z-index: 2;
  }
  th,
  td {
    border: 1px solid #ddd;
    padding: 3px;
    text-align: center;
  }
  .system_div {
    margin-left: 10px;
  }

  .dialog-field {
    display: inline-block;
    box-sizing: border-box; /* Учтите ширину и отступы внутри элемента */
    margin-right: 10px; /* Установите нужный вам отступ между полями */
  }

  .dialog-field:first-child {
    width: calc(
      100% - 20% - 10% - 5px
    ); /* 20px - это сумма отступов между полями */
  }

  .dialog-field:nth-last-child(-n + 2) {
    width: calc(
      20% - 20px
    ); /* 5px - это примерный отступ между последними двумя полями */
  }

  /* Для последнего dialog-field может потребоваться сброс правого отступа */
  .dialog-field:last-child {
    margin-right: 0;
  }

  .save {
    margin-top: 10px; /* Отступ для кнопки "Создать" */
  }

  textarea {
    width: 100%;
    resize: none;
  }

  .add-record {
    font-size: larger;
    width: 35px;
    border-radius: 35px;
    border: 0;
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

  .dialog-field {
    display: flex;
    flex-direction: column; /* Устанавливает вертикальное направление потока */
    margin-right: 20px; /* Добавляет небольшой отступ справа для каждого поля, кроме последнего */
  }

  .dialog-field:last-child {
    margin-right: 0; /* Убирает отступ справа у последнего поля */
  }
</style>
