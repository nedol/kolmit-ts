<script lang='ts'>
  import { getContext, onMount } from 'svelte';

  import { langs } from '$lib/js/stores.js';

  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import Button from '@smui/button';
  import Paper, { Content } from '@smui/paper';

  let active = 'Words';

  import { slide } from 'svelte/transition';
  let isCollapsed = true;

  function toggleCollapse() {
    isCollapsed.update((n) => !n);
  }

  export let data:any;
  export let ChangeQuizName: any;

  const abonent = getContext('abonent');


  let content:any,
    new_content = false,
    words_data = { lang: '', content: []  };
  const name = data.name;
  const llang = data.llang

  fetch(`./lesson?words=${data.name}&owner=${abonent}`)
    .then((response) => response.json())
    .then((data) => {
      words_data = data.data.dialog;
      if (data.data.html) {
        words_data.html = splitHtmlContent(data.data.html);
      }
      words_data.name = name;
    })
    .catch((error) => {
      console.log(error);
      words_data = { content: [], lang:'' };
    });

  let words:any, dialog_task:any, dialog_words, dialog_tmplt;

  const tmplt = 
  `'words':{  'nl': '', 'ru': '', 'uk': '', 'fr': '', 'en': '', 'de': ''},
  'example':{  '${llang}': ''}
  `;

  let system = ``;

  onMount(() => {
    // const storedData = localStorage.getItem('qaData');
    // if (storedData) {
    // 	words_data = JSON.parse(storedData);
    // }
  });

  function splitHtmlContent(inputString:string) {
    // Регулярное выражение для поиска содержимого внутри тегов <html>...</html>
    const regex = /<html>(.*?)<\/html>/gs;

    // Используем matchAll для поиска всех совпадений в строке
    const matches = inputString.matchAll(regex);

    // Преобразуем итератор в массив и извлекаем только содержимое внутри тегов
    const result = Array.from(matches, (match) => match[1]);

    return result;
  }

  function addEmptyRecord() {
    const emptyRecord = { nl: '', ru: '', uk: '', fr: '', en: '', de: ''  };
    words_data.content.push(emptyRecord);
    words_data = words_data;
  }

  // Функция для сохранения текущего состояния в localStorage
  function saveToLocalStorage() {
    SaveData(name, data.name, words_data);
    ChangeQuizName(name, data.name);
  }

  async function SaveData(name:string, new_name:string, data:any) {
    const response = await fetch(`/admin`, {
      method: 'POST',
      body: JSON.stringify({
        func: 'upd_words',
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
    const words = words_data.content.map((item:any) => {
      if (item.user1) return item.user1[$langs] + ' - ' + item.user2[$langs];
    });
    const response = await fetch(`/chatGPT`, {
      method: 'POST',
      body: JSON.stringify({ topic: name, words: words }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    new_content = true;
    const data = await response.json();
    // content = data.chat_resp.replace(/\\\'/g, ''');
    content = JSON.stringify(JSON.parse(data.chat_resp).content[0]);
    if (content) {
      words_data.content.push(JSON.parse(data.chat_resp).content[0]);
      words_data = words_data;
    }
  }

  function OnChangeContent(ev:any) {
    // console.log(ev.currentTarget.value)
    try {
      words_data = JSON.parse(ev.currentTarget.value);
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
</script>

<div class='dialog_container'>
  <div class='container'>
    <div class='dialog-field'>
      <label for='dialog_name'>Название:</label>
      <input
        type='text'
        class='dialog_name'
        name='dialog_name'
        bind:value={data.name}
      />
    </div>
    {#if data.level}
      <div class='dialog-field'>
        <label for='dialog_level'>Уровень:</label>
        <input
          type='text'
          class='dialog_level'
          name='dialog_level'
          bind:value={data.level}
        />
      </div>
    {/if}

    {#if data.llang}
      <div class='dialog-field'>
        <label for='dialog_lang'>Язык:</label>
        <input
          type='text'
          class='dialog_lang'
          name='dialog_lang'
          bind:value={data.llang}
        />
      </div>
    {/if}
  </div>

  <button
    class='content_generator'
    on:click={() => (isCollapsed = !isCollapsed)}
  >
    {isCollapsed ? 'Контент-генератор' : 'Контент-генератор'}
  </button>

  {#if !isCollapsed}
    <div class='collapsible' in:slide={{ duration: 300 }}>
      <div class='generator_container'>
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
          <Paper variant='unelevated'>
            <Content>
              <div>
                {@html tmplt}
              </div>
            </Content>
          </Paper>
        {:else if active === 'Words'}
          <Paper variant='unelevated'>
            <Content>
              <textarea rows='20' name='dialog_words' bind:value={words}
              ></textarea>
            </Content>
          </Paper>
        {:else if active === 'Prompt'}
          <Paper variant='unelevated'>
            <Content>
              <!-- <textarea  rows='20' name='dialog_task' bind:value={task}></textarea> -->
              <div contenteditable='true' bind:this={dialog_task}>
                <div>
                  <b>Create a learning dialogue on the topic: {data.name} </b>
                </div>
                <div><b>Use System Prompts.</b></div>
                <div><b>Language learning level:</b>A1.</div>
                <div>
                  <b>Make translations into the appropriate languages.</b>
                </div>
                <div>
                  <b
                    >Without confirmation words transition, comments or
                    additional content.</b
                  >
                </div>
                <div><b>Output only 1 sentence at time.</b></div>
              </div>

              <button class='copy_prompt' on:click={() => CopyPrompt()}
                >Copy Prompt</button
              >
            </Content>
          </Paper>
        {:else if active === 'Content'}
          <Paper variant='unelevated'>
            <Content>
              <textarea
                id='dialog_content'
                rows='20'
                name='dialog_content'
                on:input={OnChangeContent}>{content}</textarea
              >
            </Content>
          </Paper>
        {/if}
      </div>

      <div class='container'>
        <button class='save' on:click={() => CreateContent()}>Создать</button>
      </div>
    </div>
  {/if}

  <table>
    <thead>
      <tr>
        <th>{llang}</th>
        <th>{$langs}</th>
      </tr>
    </thead>
    <tbody>
      {#if words_data}
        {#each words_data.content as item, index}
          <tr>
            <td>
              {#if item.user1 && item.user1[$langs]}
                <textarea
                  rows='1'            
                  bind:value={item.user1[$langs]}
                />
              {:else}
                <textarea rows='1'  />
              {/if}
            </td>
            <td>
              {#if item.user2 && item.user2[$langs]}
                <textarea
                  rows='1'
              
                  bind:value={item.user2[$langs]}
                />
              {:else}
                <textarea rows='1' />
              {/if}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>

  <div class='container'>
    <button class='add-record' on:click={addEmptyRecord}>+</button>
    <div class='container'>
      <button class='save' on:click={() => saveToLocalStorage()}
        >Сохранить</button
      >
    </div>
  </div>
</div>

<style>
  .dialog_container {
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


  .save {
    margin-top: 10px; /* Отступ для кнопки 'Создать' */
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
