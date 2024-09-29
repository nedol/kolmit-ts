<script lang="ts">
  import { Translate } from '../../../translate/Transloc.js';

  import { getContext, onMount } from 'svelte';

  import { nlang, llang, langs, dicts, view } from '$lib/js/stores.js';

  import List, { Item, Separator, Text } from '@smui/list';
  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import Accordion, { Panel, Header } from '@smui-extra/accordion';
  import Menu from '@smui/menu';
  import Button from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Paper, { Content } from '@smui/paper';
  import { Anchor } from '@smui/menu-surface';

  export let ChangeQuizName: any;

  const abonent = getContext('abonent');
  const data = getContext('quiz_data');

  let content = '',
    new_content = false,
    num = 10;

  let dialog_data = { lang: '', content: [], words: [], html: [''], name: '' };
  const name = data.name;
  let dialog_task: HTMLDivElement, dialog_words, dialog_tmplt;

  let menu: Menu, anchor: HTMLDivElement;
  let anchorClasses: { [k: string]: boolean } = {};

  let viewHTML = false;

  let prompt = ``,
    grammar = '',
    grammar_title = 'Grammar',
    context_title = 'Context',
    prompt_title = 'Prompt',
    words_title = 'Words',
    content_title = 'Content';

  let active = 'Prompt';

  $: if (false && $langs) {
    (async () => {
      grammar_title = await Translate('Grammar', 'en', $langs);
      context_title = await Translate('Context', 'en', $langs);
      // prompt_title = await translate('Prompt', $langs);
      words_title = await Translate('Words', 'en', $langs);
      content_title = await Translate('Content', 'en', $langs);
    })();
  }

  // {@dialogue: ${dlg_content} {There is dlg_content:${dlg_content}}
  $: if (dialog_data && $llang) {
    try {
      const dlg_content = dialog_data.content.map((line) => {
        return JSON.stringify(line);
      });
      let dialog_data_words = dialog_data.words || '';
    } catch (ex) {}
  }

  $: if (dialog_data && $langs) {
    TranslateContentToCurrentLang();
  }

  $: if (dialog_data.content.length > 0 && prompt) {
    let content = JSON.parse(JSON.stringify(dialog_data.content));
    try {
      content?.forEach((item) => {
        item['user1'] = item['user1'][$llang]
          ? item['user1'][$llang]
          : item['user1'];
        item['user2'] = item['user2'][$llang]
          ? item['user2'][$llang]
          : item['user2'];
      });
    } catch (ex) {}
    prompt = prompt.replaceAll('${dialog_content}', JSON.stringify(content));
  }

  fetch(
    `./lesson?dialog=${data.name[$llang]}&owner=${abonent}&level=${data.level}`
  )
    .then((response) => response.json())
    .then(async (resp) => {
      dialog_data = resp.data.dialog;
      if (!dialog_data) dialog_data = { content: [] };
      if (resp.data.html) {
        dialog_data.html = splitHtmlContent(resp.data.html);
      }
      dialog_data.name = name;
      //DB
      fetch(
        `./admin?prompt=dialog.basic&quiz_name=${data.name[$llang]}&prompt_owner=${abonent}&prompt_level=${data.level}&prompt_theme=${data.theme}`
      )
        .then((response) => response.json())
        .then((resp) => {
          prompt = resp.resp.prompt.system + resp.resp.prompt.user;

          // fetch('./src/routes/admin/quiz/prompts/dialog.ru.txt')
          //   .then((response) => response.text())
          //   .then((resp) => {
          // prompt = resp;
          prompt = prompt.replaceAll('${llang}', $llang);
          prompt = prompt.replaceAll('${name[$llang]}', name[$llang]);
          prompt = prompt.replaceAll('${langs}', $langs);
          prompt = prompt.replaceAll('${dialog_data.html}', dialog_data.html);
          prompt = prompt.replaceAll('${data.level}', data.level);
          prompt = prompt.replaceAll('${num}', num);

          // dialog_data.words = JSON.stringify(
          //   resp.resp.words.data
          //     .map((item) => extractWords(item.example[$llang]))
          //     .join(',')
          // );

          if (dialog_data.words)
            prompt = prompt.replaceAll(
              '[${dialog_data_words}]',
              dialog_data.words
            );

          dialog_data.html = resp.resp.words[0]?.context;

          let quiz_grammar = resp.resp.grammar.quizes[data.name[$llang]];

          grammar = resp.resp.grammar.grammar.concat(quiz_grammar);

          if (grammar) prompt = prompt.replaceAll('${grammar}', grammar.map(element => {
            return element
          }));

          prompt = prompt;
        });
    })
    .catch((error) => {
      console.log(error);
      // dialog_data.content = [];
    });

  onMount(async () => {});

  function LoadPrompt(name, data) {
    if (name === 'context') {
      active = `Context`;
    } else if (name === 'grammar') {
      active = `Grammar`;
    }
    fetch(
      `/admin?prompt=dialog.${name}&quiz_name=${data.name[$llang]}&prompt_owner=${abonent}&prompt_level=${data.level}&prompt_theme=${data.theme}`
    )
      .then((response) => response.json())
      .then((data) => {
        prompt = data.resp.prompt.system + data.resp.prompt.user;
        prompt = prompt.replaceAll('${llang}', $llang);
        prompt = prompt.replaceAll('${name[$llang]}', dialog_data.name[$llang]);
        prompt = prompt.replaceAll('${langs}', $langs);
        prompt = prompt.replaceAll('${dialog_data.html}', dialog_data.html);
        prompt = prompt.replaceAll('${data.level}', data.level);
        prompt = prompt.replaceAll('${num}', num);
        prompt = prompt.replaceAll('${grammar}', data.resp.grammar.grammar.map((el)=>{return el}));
        prompt = prompt;
      })
      .catch((error) => {
        console.log(error);
        // dialog_data.content = [];
      });
  }

  function extractWords(text) {
    // Регулярное выражение для поиска слов в угловых скобках
    const regex = /<<(.*?)>>/g;
    // Массив для хранения найденных слов
    let result = [];
    let match;

    // Поиск всех совпадений и добавление их в массив
    while ((match = regex.exec(text)) !== null) {
      result.push(match[1]);
    }

    return result;
  }

  async function TranslateContentToCurrentLang() {
    try {
      await Promise.all(
        dialog_data.content.map(async (item: any) => {
          await Promise.all(
            Object.keys(item).map(async (key: string) => {
              // console.log(key, item);
              if (item[key][$llang] && !item[key][$langs]) {
                let tr = await Translate(item[key][$llang], $llang, $langs);
                item[key][$langs] = tr;
                dialog_data = dialog_data;
              }
            })
          );
        })
      );
    } catch (ex) {}
  }

  function splitHtmlContent(inputString: string) {
    const regex = /<(?:!DOCTYPE html|html(?:\s[^>]*)?)>(.*?)<\/html>/gs;
    const result = [];
    let match;

    // Используем цикл для поиска всех совпадений
    while ((match = regex.exec(inputString)) !== null) {
      result.push(match[0]); // Добавляем найденное совпадение в массив
    }

    return result;
  }

  function addEmptyRecord() {
    let emptyRecord = {
      num: (dialog_data.content.length + 1).toString(), // Пример создания уникального номера записи
      user1: { nl: '', ru: '', uk: '', fr: '', en: '', de: '' },
      user2: { nl: '', ru: '', uk: '', fr: '', en: '', de: '' },
      language: $llang, // Пример начального выбранного языка
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
    SaveDialogData(name, data);
    ChangeQuizName(name, data.name);
  }

  async function SaveDialogData(name: string, data: any) {
    const response = await fetch(`/admin/module`, {
      method: 'POST',
      body: JSON.stringify({
        func: 'upd_dlg',
        owner: abonent,
        level: data.level,
        name: name[$llang],
        new_name: data.name[$llang],
        data: dialog_data,
        lang: $llang,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }

  async function CreateContent() {
    let dt = prompt.replace(/<[^>]+>/gi, '');
    const response = await fetch(`/chat`, {
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

  function OnContextChange() {
    prompt = prompt.replace('${dialog_data_html}', dialog_data.html);
  }

  function OnWordsChange() {
    prompt = prompt.replaceAll('${dialog_data_words}', dialog_data.words);
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
        const parsed = JSON.parse(text);
        const parsed_html = JSON.parse(text).html;
        if (dialog_data && dialog_data.content)
          dialog_data.content = dialog_data.content.concat(parsed.content);
        else {
          dialog_data.content = parsed;
        }
        if (dialog_data && parsed_html) {
          dialog_data.html = parsed_html;
        }
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }

  function OnGrammarChange() {
    if (grammar) prompt = prompt.replace('${grammar}', grammar);
  }
</script>

<main>
  <div class="container">
    <div class="dialog-field">
      {#await Translate('Title', 'en', $langs) then data}
        <label for="dialog_name">{data}</label>
      {/await}

      <input
        type="text"
        class="dialog_name"
        name="dialog_name"
        bind:value={data.name[$llang]}
      />
    </div>
    {#if data.level}
      <div class="dialog-field">
        {#await Translate('Level', 'en', $langs) then data}
          <label for="dialog_level">{data}</label>
        {/await}

        <div class="dialog_level" name="dialog_level">{data.level}</div>
      </div>
    {/if}

    {#if $llang}
      <div class="dialog-field">
        {#await Translate('Language', 'en', $langs) then data}
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
          {#await Translate('Content Builder', 'en', $langs) then data}
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
                <!-- <div style="height: 350px; overflow-y:auto">
                  {@html dialog_data.html}
                </div> -->
                <iframe srcdoc={dialog_data.html} width="100%" height="350px"
                ></iframe>
              {:else}
                <Paper variant="unelevated">
                  <Content>
                    <textarea
                      rows="20"
                      name="dialog_context"
                      bind:value={dialog_data.html}
                      on:change={OnContextChange}
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
                  <textarea
                    rows="20"
                    name="dialog_grammar"
                    bind:value={grammar}
                    on:change={OnGrammarChange}
                  ></textarea>
                </Content>
              </Paper>
            {:else if active === words_title}
              <Paper variant="unelevated">
                <Content>
                  <textarea
                    on:change={() => OnWordsChange()}
                    rows="20"
                    name="dialog_words"
                    bind:value={dialog_data.words}
                  ></textarea>
                </Content>
              </Paper>
            {:else if active === prompt_title}
              <Paper variant="unelevated">
                <Content>
                  <div
                    class={Object.keys(anchorClasses).join(' ')}
                    use:Anchor={{
                      addClass: (className) => {
                        if (!anchorClasses[className]) {
                          anchorClasses[className] = true;
                        }
                      },
                      removeClass: (className) => {
                        if (anchorClasses[className]) {
                          delete anchorClasses[className];
                          anchorClasses = anchorClasses;
                        }
                      },
                    }}
                    bind:this={anchor}
                  >
                    <Button on:click={() => menu.setOpen(true)}>
                      <Label>Выбрать промпт</Label>
                    </Button>
                    <Menu
                      bind:this={menu}
                      anchor={false}
                      bind:anchorElement={anchor}
                      anchorCorner="BOTTOM_LEFT"
                    >
                      <List>
                        <Item on:click={() => LoadPrompt('basic', data)}>
                          <Text>basic</Text>
                        </Item>
                        <Item on:click={() => LoadPrompt('context', data)}>
                          <Text>context</Text>
                        </Item>
                        <Item on:click={() => LoadPrompt('grammar', data)}>
                          <Text>grammar</Text>
                        </Item>
                      </List>
                    </Menu>
                  </div>
                  <textarea rows="20" name="dialog_task" bind:value={prompt}
                  ></textarea>
                  <!-- <div contenteditable="true" bind:this={dialog_task}>
                {@html prompt}
              </div> -->
                  <button class="copy_prompt" on:click={CopyPrompt}>
                    {#await Translate('Copy', 'en', $langs) then data}
                      {data}
                    {/await}
                  </button>
                </Content>
              </Paper>
            {:else if active === content_title}
              <Paper variant="unelevated">
                <Content>
                  {#await Translate('Use chatGPT to run the copied prompt and paste result here', 'en', $langs) then data}
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
                    {#await Translate('Paste Content', 'en', $langs) then data}
                      {data}
                    {/await}
                  </button>
                </Content>
              </Paper>
            {/if}
          </div>

          <div class="container">
            <button class="save" disabled on:click={CreateContent}>
              {#await Translate('Create content', 'en', $langs) then data}
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
        {#await Translate('User 1', 'en', $langs) then data}
          <th>{data}</th>{/await}

        {#await Translate('User 2', 'en', $langs) then data}
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
      {#await Translate('Save', 'en', $langs) then data}
        <button class="save" on:click={() => OnSave()}>{data}</button>{/await}
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
    color: blue;
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
