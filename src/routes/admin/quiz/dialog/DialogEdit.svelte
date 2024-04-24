<script lang="ts">
  import translate from 'translate';

  import { getContext, onMount } from 'svelte';

  import { llang, langs, dicts } from '$lib/js/stores.js';

  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import Accordion, { Panel, Header } from '@smui-extra/accordion';

  import Button from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Paper, { Content } from '@smui/paper';

  export let ChangeQuizName: any;

  const abonent = getContext('abonent');
  const data = getContext('quiz_data');

  let content = '',
    new_content = false,
    num = 5;

  translate.from = 'en';
  translate.engine = 'google';

  let dialog_data = { lang: '', content: [], words: [], html: [''], name: '' };
  const name = data.name;
  let dialog_task: HTMLDivElement, dialog_words, dialog_tmplt;

  let viewHTML = false;

  let prompt = ``,
    grammar = '',
    grammar_title = 'Grammar',
    context_title = 'Context',
    prompt_title = 'Prompt',
    words_title = 'Words',
    content_title = 'Content';

  let active = 'Prompt';

  $: if (active) {
    (async () => {})();
  }

  $: if ($langs) {
    (async () => {
      grammar_title = await translate('Grammar', $langs);
      context_title = await translate('Context', $langs);
      // prompt_title = await translate('Prompt', $langs);
      words_title = await translate('Words', $langs);
      content_title = await translate('Content', $langs);
    })();
  }

  $: if (dialog_data && $llang)
    prompt = `
[Act as a teaching methodologist of Dutch]     
{dialogue:${JSON.stringify(dialog_data && dialog_data.content[dialog_data.content.length - 1] ? dialog_data.content[dialog_data.content.length - 1] : '')}}   
->[[Continue the dialogue by adding ${num} of participants' lines]
{Use the words:${dialog_data.words}}
{no repeats}
{Topic=${name}}{language:${$llang} , language learning level: A2}
{participants: user1, user2}]*${num}
->[Translate to:${$langs} and to 'en']
->[Output]{output format:json}{output example: 
  [
    {
     "user1": { "en":"...","${$llang}": "..." , "${$langs}":"..."}, 
     "user2": { "en":"...","${$llang}": "..." , "${$langs}":"..."} 
    },
    ...
]
`;

  $: if (dialog_data && $langs) {
    TranslateContentToCurrentLang();
  }

  fetch(`./lesson?dialog=${data.name}&owner=${abonent}`)
    .then((response) => response.json())
    .then((data) => {
      dialog_data = data.data.dialog;
      if (data.data.html) {
        dialog_data.html = splitHtmlContent(data.data.html);
      }
      dialog_data.name = name;
      prompt = prompt;
    })
    .catch((error) => {
      console.log(error);
      // dialog_data.content = [];
    });



  onMount(() => {});

  async function Translate(text: string) {
    try {
      translate.from = $llang;

      return ($dicts[text] && $dicts[text][$langs]) ?? await translate(text.trim(), $langs);
    } catch (error) {
      console.error('Translation error:', error);
      return text; // или другое подходящее значение по умолчанию
    }
  }

  function TranslateContentToCurrentLang() {
    dialog_data.content.map((item: any, i) => {
      Object.keys(item).map(async (key: string) => {
        if (item[key][$llang] && !item[key][$langs]) {
          let tr = await Translate(item[key][$llang]);
          item[key][$langs] = tr;
          dialog_data = dialog_data;
        }
      });
    });
  }

  function splitHtmlContent(inputString: string) {
    // Регулярное выражение для поиска содержимого внутри тегов <html>...</html>
    const regex = /<html>(.*?)<\/html>/gs;

    // Используем matchAll для поиска всех совпадений в строке
    const matches = inputString.matchAll(regex);

    // Преобразуем итератор в массив и извлекаем только содержимое внутри тегов
    const result = Array.from(matches, (match) => match[1]);

    return result;
  }

  function addEmptyRecord() {
    let emptyRecord = {
      num: (dialog_data.content.length + 1).toString(), // Пример создания уникального номера записи
      user1: { nl: '', ru: '', uk: '', fr: '', en: '', de: '' },
      user2: { nl: '', ru: '', uk: '', fr: '', en: '', de: '' },
      language: 'nl', // Пример начального выбранного языка
    };
    dialog_data.content.push(emptyRecord);
    dialog_data = dialog_data;
  }

  function remRecord(ev) {
    const index = ev.currentTarget.attributes.index.nodeValue;
    dialog_data.content.splice(index, 1);
    dialog_data = dialog_data;
  }

  // Функция для сохранения текущего состояния в localStorage
  function OnSave() {
    SaveDialogData(name, data.name, dialog_data);
    ChangeQuizName(name, data.name);
  }

  async function SaveDialogData(name: string, new_name: string, data: any) {
    const response = await fetch(`/admin`, {
      method: 'POST',
      body: JSON.stringify({
        func: 'upd_dlg',
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
    let dt = prompt.replace(/<[^>]+>/gi, '');
    const response = await fetch(`/chatGPT`, {
      method: 'POST',
      body: JSON.stringify({
        topic: name,
        dialog: JSON.stringify(dialog_data.content),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data.content[0]) {
          dialog_data.content = dialog_data.content.concat(data.data.content);
          if (data.data.html) {
            dialog_data.html = splitHtmlContent(data.data.html);
          }
          dialog_data.name = name;
          new_content = true;
        }
      })
      .catch((error) => {
        console.log(error);
        // dialog_data = { content: [] };
      });

    // content = data.replace(/\\\"/g, '"');
    // content = JSON.stringify(JSON.parse(data)[0]);
    // if (content) {
    //   dialog_data.content.push(JSON.parse(data)[0]);
    //   dialog_data = dialog_data;
    // }
  }

  function OnChangeContent(ev: Event) {
    // console.log(ev.currentTarget.value)
    try {
      if (ev.currentTarget.value) {
        dialog_data.content = dialog_data.content.concat(
          JSON.parse(ev.currentTarget.value)
        );
        console.log(dialog_data.content);
      } else content = '';
    } catch (ex) {
      console.log(ex);
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

  function PasteContent(ev: MouseEvent) {
    // Вставляем содержимое буфера обмена в <textarea>
    navigator.clipboard
      .readText()
      .then((text) => {
        content = text;
        dialog_data.content = dialog_data.content.concat(JSON.parse(text));
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }
</script>

<div class="dialog_container">
  <div class="container">
    <div class="dialog-field">
      {#await Translate('Title', $langs) then data}
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
        {#await Translate('Level', $langs) then data}
          <label for="dialog_level">{data}</label>
        {/await}

        <div class="dialog_level" name="dialog_level">{data.level}</div>
      </div>
    {/if}

    {#if $llang}
      <div class="dialog-field">
        {#await Translate('Language', $langs) then data}
          <label for="dialog_lang">{data}</label>
        {/await}

        <div type="text" class="dialog_lang" name="dialog_lang">
          {$llang}
        </div>
      </div>
    {/if}
  </div>

  <Accordion
    style="  margin-top: 20px;
  margin-bottom: 20px;"
  >
    <Panel>
      <Header
        ><b>
          {#await Translate('content_builder',$langs)  then data}
            {data}
          {/await}
        </b></Header
      >

      <Content>
        <div class="collapsible">
          <div class="generator_container">
            <!-- {@debug grammar_title} -->
            <TabBar
              tabs={[
                context_title,
                grammar_title,
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
            {#if active === context_title}
              {#if viewHTML}
                <div style="height: 350px; overflow-y:auto">
                  {@html dialog_data.html}
                </div>
              {:else}
                <Paper variant="unelevated">
                  <Content>
                    <textarea
                      rows="20"
                      name="dialog_context"
                      bind:value={dialog_data.html}
                    ></textarea>
                  </Content>
                </Paper>
              {/if}
              <button
                class="paste_content"
                on:click={() => {
                  viewHTML = !viewHTML;
                }}>HTML</button
              >
            {:else if active === grammar_title}
              <Paper variant="unelevated">
                <Content>
                  <textarea rows="20" name="dialog_grammar" bind:value={grammar}
                  ></textarea>
                </Content>
              </Paper>
            {:else if active === words_title}
              <Paper variant="unelevated">
                <Content>
                  <textarea
                    rows="20"
                    name="dialog_words"
                    bind:value={dialog_data.words}
                  ></textarea>
                </Content>
              </Paper>
            {:else if active === prompt_title}
              <Paper variant="unelevated">
                <Content>
                  <textarea rows="20" name="dialog_task" bind:value={prompt}
                  ></textarea>
                  <!-- <div contenteditable="true" bind:this={dialog_task}>
                {@html prompt}
              </div> -->
                  <button class="copy_prompt" on:click={CopyPrompt}>
                    {#await Translate('Copy Prompt', $langs) then data}
                      {data}
                    {/await}
                  </button>
                </Content>
              </Paper>
            {:else if active === content_title}
              <Paper variant="unelevated">
                <Content>
                  {#await Translate('Run your favorite AI chat with the copied prompt and paste result here', $langs) then data}
                    <textarea
                      id="dialog_content"
                      rows="20"
                      name="dialog_content"
                      placeholder={data}
                      on:input={OnChangeContent}
                      bind:value={content}
                    ></textarea>
                  {/await}
                  <button class="paste_content" on:click={PasteContent}>
                    {#await Translate('Paste Content', $langs) then data}
                      {data}
                    {/await}
                  </button>
                </Content>
              </Paper>
            {/if}
          </div>

          <div class="container">
            <button class="save" disabled on:click={CreateContent}>
              {#await Translate('Create content', $langs) then data}
                {data}
              {/await}
            </button>
          </div>
        </div>
      </Content>
    </Panel>
  </Accordion>

  <table>
    <thead>
      <tr>
        {#await Translate('User 1', $langs) then data}
          <th>{data}</th>{/await}

        {#await Translate('User 2', $langs) then data}
          <th>{data}</th>{/await}
      </tr>
    </thead>
    <tbody>
      {#if dialog_data}
        {#each dialog_data.content as item, index}
          <tr>
            <td>
              {#if item.user1}
                <textarea
                  rows="3"
                  type="text"
                  bind:value={item.user1[$langs]}
                />
              {:else}
                <textarea rows="3" type="text" />
              {/if}
            </td>
            <td>
              {#if item.user2}
                <textarea
                  rows="3"
                  type="text"
                  bind:value={item.user2[$langs]}
                />
              {:else}
                <textarea rows="3" type="text" />
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
    <IconButton class="material-icons add-record" on:click={addEmptyRecord}
      >add</IconButton
    >
    <div class="container">
      {#await Translate('Save', $langs) then data}
        <button class="save" on:click={() => OnSave()}>{data}</button>{/await}
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
    /* background-color: #f2f2f2; */
    position: sticky;
    top: 0;
    z-index: 2;
  }
  th,
  td {
    border: 1px solid #ddd;
    padding: 1px;
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
    margin-top: 10px; /* Отступ для кнопки "Создать" */
  }

  textarea {
    width: 100%;
    resize: none;
  }

  .remrec_but {
    scale: 2;

    width: 25px;
    border-radius: 35px;
    border: 0;
    background-color: transparent;
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
