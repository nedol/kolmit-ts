<script lang="ts">
  import { Transloc } from '../../../translate/Transloc.js';

  import { getContext, onMount } from 'svelte';

  import { nlang, llang, langs, dicts, view } from '$lib/stores.ts';

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
    num = 5;

  let bricks_data = { lang: '', content: [], words: [], data: [''], name: '', prompt_type:'' , original:'' };
  const name = data.name;
  let dialog_task: HTMLDivElement, dialog_words, dialog_tmplt;

  let menu: Menu, anchor: HTMLDivElement;
  let anchorClasses: { [k: string]: boolean } = {};

  let viewHTML = false;

  let prompt = ``,
    grammAr = '',
    grammar_title = 'Grammar',
    context_title = 'Context',
    prompt_title = 'Prompt',
    words_title = 'Words',
    content_title = 'Content';

  let active = 'Prompt';

  $: if (false && $langs) {
    (async () => {
      grammar_title = await Transloc('Grammar', 'en', $langs);
      context_title = await Transloc('Context', 'en', $langs);
      // prompt_title = await translate('Prompt', $langs);
      words_title = await Transloc('Words', 'en', $langs);
      content_title = await Transloc('Content', 'en', $langs);
    })();
  }

  // {@dialogue: ${dlg_content} {There is dlg_content:${dlg_content}}
  $: if (bricks_data && $llang) {
    try {
      const dlg_content = bricks_data.content.map((line) => {
        return JSON.stringify(line);
      });
      let bricks_data_words = bricks_data.words || '';
    } catch (ex) {}
  }

  $: if (bricks_data && $langs) {
    TranslocContentToCurrentLang();
  }

  $: if (bricks_data.content.length > 0 && prompt) {
    let content = JSON.parse(JSON.stringify(bricks_data.content));
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
    `./lesson?bricks=${data.name}&owner=${abonent}&level=${data.level}&theme=${data.theme}`
  )
    .then((response) => response.json())
    .then(async (resp) => {

      if (resp?.data) {
        bricks_data.data = resp.data?.data;      
        bricks_data.name = data.name;
        bricks_data.prompt_type = resp.data.prompt_type?resp.data.prompt_type:(data.type?data.type:data.name.includes('Nieuws')?'news':'');
        bricks_data.context = resp.data.context;
      }
      content  = bricks_data?.data;
      //DB
      fetch(
        `./admin?prompt=bricks.${bricks_data.prompt_type}.${$langs}&quiz_name=${data.name}&prompt_owner=${abonent}&prompt_level=${data.level}&prompt_theme=${data.theme}`
      )
        .then((response) => response.json())
        .then((resp) => {
          prompt = resp.resp.prompt.system + resp.resp.prompt.user;

          prompt = prompt.replaceAll('${lang}', $llang);
          prompt = prompt.replaceAll('${text}', '```text\n'+bricks_data.context+'\n```');
          prompt = prompt.replaceAll('${level}', `${data.level}`);
          prompt = prompt.replaceAll('${qnty}', num);

          bricks_data.words = JSON.stringify(
            resp.resp.words[0]?.data//resp.words[0].data
              .map((item) => extractWords(item.example[$llang]))
              .join(',')
          );

          function extractContent(str) {
            const match = str.match(/<<(.*?)>>/); // Ищем содержимое между << и >>
            return match ? match[1] : null; // Возвращаем содержимое или null, если нет совпадений
          }

          if (resp.resp.words[0]?.data){            

            prompt = prompt.replaceAll(
              '[${bricks_data_words}]',
              resp.resp.words[0].data.map(item => extractContent(item.example[$llang]))
            );
          }

          bricks_data.data = resp.resp.words[0]?.context;

          if (data.theme.grammar) prompt = prompt.replaceAll('${grammar}', JSON.stringify(data.theme.grammar)) 

          prompt = prompt;
        });
    })
    .catch((error) => {
      console.log(error);
      // bricks_data.content = [];
    });

  onMount(async () => {});

  function LoadPrompt(name, data) {
    if (name === 'context') {
      active = `Context`;
    } else if (name === 'grammar') {
      active = `Grammar`;
    }
    fetch(
      `/admin?prompt=bricks.${name}.${$langs}&quiz_name=${data.name[$llang]}&prompt_owner=${abonent}&prompt_level=${data.level}&prompt_theme=${data.theme}`
    )
      .then((response) => response.json())
      .then((resp) => {
        bricks_data.prompt_type = name;
        prompt = resp.resp.prompt.system + (resp.resp.prompt.user?resp.resp.prompt.user:'');
        prompt = prompt.replaceAll('${lang}', $llang);
        prompt = prompt.replaceAll('${name}', bricks_data.name);
        prompt = prompt.replaceAll('${text}', bricks_data.context);
        prompt = prompt.replaceAll('${level}', data.level);
        prompt = prompt.replace('${qnty}', num);
        prompt = prompt.replaceAll('${grammar}', '${grammar}:[' + grammAr+']');
        prompt = prompt;
      })
      .catch((error) => {
        console.log(error);
        // bricks_data.content = [];
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

  async function TranslocContentToCurrentLang() {
    try {
      await Promise.all(
        bricks_data.content.map(async (item: any) => {
          await Promise.all(
            Object.keys(item).map(async (key: string) => {
              // console.log(key, item);
              if (item[key][$llang] && !item[key][$langs]) {
                let tr = await Transloc(item[key][$llang], $llang, $langs, bricks_data.name);
                item[key][$langs] = tr;
                bricks_data = bricks_data;
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
      num: (bricks_data.content.length + 1).toString(), // Пример создания уникального номера записи
      user1: { nl: '', ru: '', uk: '', fr: '', en: '', de: '' },
      user2: { nl: '', ru: '', uk: '', fr: '', en: '', de: '' },
      language: $llang, // Пример начального выбранного языка
    };
    bricks_data.content.push(emptyRecord);
    bricks_data = bricks_data;
  }

  function remRecord(ev) {
    const index = ev.currentTarget.attributes.index.nodeValue;
    bricks_data.content.splice(index, 1);
    bricks_data = bricks_data;
  }

  // Функция для сохранения текущего состояния в localStorage
  function OnSave() {
    SaveData(name, data);
    ChangeQuizName(name, data.name);
  }



  async function SaveData(name: string, data: any) {
    const response = await fetch(`/admin/module`, {
      method: 'POST',
      body: JSON.stringify({
        func: 'upd_brks',
        owner: abonent,
        level: data.level,
        name: name,
        new_name: data.name,
        data: content,
        lang: $llang,
        theme: data.theme,
        prompt_type: bricks_data.prompt_type 
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
        dialog: JSON.stringify(bricks_data.content),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data.content[0]) {
          bricks_data.content = bricks_data.content.concat(data.data.content);
          if (data.data.data) {
            bricks_data.data = splitHtmlContent(data.data.data);
          }
          bricks_data.name = name;
          new_content = true;
        }
      })
      .catch((error) => {
        console.log(error);
        // bricks_data = { content: [] };
      });

    // content = data.replace(/\\\"/g, '"');
    // content = JSON.stringify(JSON.parse(data)[0]);
    // if (content) {
    //   bricks_data.content.push(JSON.parse(data)[0]);
    //   bricks_data = bricks_data;
    // }
  }

  function OnContextChange() {
    prompt = prompt.replace('${text}', bricks_data.context);
  }

  function OnWordsChange() {
    prompt = prompt.replaceAll('${words}', bricks_data.words);
  }

  function OnChangeContent(ev: Event) {
    // console.log(ev.currentTarget.value)
    try {
      if (ev.currentTarget.value) {
        bricks_data.content = bricks_data.content.concat(
          JSON.parse(ev.currentTarget.value)
        );
        console.log(bricks_data.content);
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
        // const parsed = JSON.parse(text);
        // const parsed_html = JSON.parse(text).html;
        // content = parsed;
        // if (bricks_data && bricks_data.content)
        //   bricks_data.content = bricks_data.content.concat(parsed.content);
        // else {
        //   bricks_data.content = parsed;
        // }
        // if (bricks_data && parsed_html) {
        //   bricks_data.html = parsed_html;
        // }
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }

  function OnCopyContent() {
    const stringToCopy = JSON.stringify(bricks_data.content);
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard
          .writeText(stringToCopy)
          .then(() => {
            console.log('Контент скопирован в буфер обмена');
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

  function OnGrammarChange() {
    if (grammAr) prompt = prompt.replace('${grammar}', '${grammar}:['+grammAr+']');
    prompt=prompt;
  }
</script>

<main>
  <div class="container">
    <div class="dialog-field">
      {#await Transloc('Title', 'en', $langs,bricks_data.name) then data}
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
        {#await Transloc('Level', 'en', $langs,bricks_data.name) then data}
          <label for="dialog_level">{data}</label>
        {/await}

        <div class="dialog_level" name="dialog_level">{data.level}</div>
      </div>
    {/if}

    {#if $llang}
      <div class="dialog-field">
        {#await Transloc('Language', 'en', $langs,bricks_data.name) then data}
          <label for="dialog_lang">{data}</label>
        {/await}

        <div type="text" class="dialog_lang" name="dialog_lang">
          {$llang}
        </div>
      </div>
    {/if}
  </div>

  <Accordion
    style="margin-top: 20px;margin-bottom: 20px;"
  >
    <Panel>
      <Header
        ><b>
          {#await Transloc('Content Builder', 'en', $langs,bricks_data.name) then data}
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
                  {@html bricks_data.html}
                </div> -->
                <iframe srcdoc={bricks_data.context} width="100%" height="350px"
                ></iframe>
              {:else}
                <Paper variant="unelevated">
                  <Content>
                    <textarea
                      rows="20"
                      name="dialog_context"
                      bind:value={bricks_data.context}
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
                    bind:value={grammAr}
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
                    bind:value={bricks_data.words}
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
                        <Item on:click={() => LoadPrompt('news', data)}>
                          <Text>news</Text>
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
                    {#await Transloc('Copy', 'en', $langs) then data}
                      {data}
                    {/await}
                  </button>
                </Content>
              </Paper>
            {:else if active === content_title}
              <Paper variant="unelevated">
                <Content>
                  {#await Transloc('Use chatGPT to run the copied prompt and paste result here', 'en', $langs,bricks_data.name) then data}
                    <!-- <textarea
                      id="dialog_content"
                      rows="20"
                      name="dialog_content"
                      placeholder={data}
                      on:input={OnChangeContent}
                      bind:value={content}
                    ></textarea> -->
                    <iframe srcdoc={content}  width="100%" height="350px"
                    ></iframe>
                    <!-- <div 
                      contenteditable="true"
                      placeholder={data}
                      bind:innerHTML={content}
                      style="min-height: 300px; max-height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; font-family: Arial, sans-serif; font-size: 14px;"
                    ></div> -->
                  {/await}
                  <button class="paste_content" on:click={PasteContent}>
                    {#await Transloc('Paste Content', 'en', $langs,bricks_data.name) then data}
                      {data}
                    {/await}
                  </button> 
                </Content>
              </Paper>
            {/if}
          </div>

          <div class="container">
            <button class="save" disabled on:click={CreateContent}>
              {#await Transloc('Create content', 'en', $langs,bricks_data.name) then data}
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
        {#await Transloc('User 1', 'en', $langs,bricks_data.name) then data}
          <th>{data}</th>{/await}

        {#await Transloc('User 2', 'en', $langs,bricks_data.name) then data}
          <th>{data}</th>{/await}
      </tr>
    </thead>
    <tbody>
      {#if bricks_data}
        {#each bricks_data.content as item, index}
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
      {#await Transloc('Copy data', 'en', $langs,bricks_data.name) then data}
        <button class="copy_content" on:click={() => OnCopyContent()}>{data}</button>
      {/await}
      {#await Transloc('Save', 'en', $langs,bricks_data.name) then data}
        <button class="save_content" on:click={() => OnSave()}>{data}</button>
      {/await}
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

  .container {
    display: flex;
    justify-content: space-between; /* Распределяет контейнеры равномерно по горизонтали */
  }
  .save_content {
    position: fixed;
    right: 20px;
    bottom:5px;
    margin-top: 10px; /* Отступ для кнопки "Создать" */
  }

  
  .copy_content {
    position: fixed;
    right: 120px;
    bottom:5px;
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

  .dialog-field {
    display: flex;
    flex-direction: column; /* Устанавливает вертикальное направление потока */
    margin-right: 20px; /* Добавляет небольшой отступ справа для каждого поля, кроме последнего */
  }

  .dialog-field:last-child {
    margin-right: 0; /* Убирает отступ справа у последнего поля */
  }
</style>
