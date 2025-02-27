<script lang="ts">
  import { setContext, onMount, onDestroy } from 'svelte';

  import { Translate } from '../../translate/Transloc';

  import pkg, { indexOf } from 'lodash';
  const { find, isObject, mapValues } = pkg;



  import Checkbox from '@smui/checkbox';
  import { SortableList } from '@rodrigodagostino/svelte-sortable-list';

  import List, { Item, Separator, Text } from '@smui/list';
  import Button, { Label } from '@smui/button';
  import Menu from '@smui/menu';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import IconButton, { Icon } from '@smui/icon-button';
  import Card, { PrimaryAction, Media, MediaContent } from '@smui/card';
  import {
    mdiAccountMultiple,
    mdiTextBoxOutline,
    mdiCardTextOutline,
    mdiEarHearing,
    mdiFileWordBoxOutline,
    mdiHelp,
  } from '@mdi/js';

  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

  import { langs, llang, dicts } from '$lib/stores.ts';

  import Quiz from '../quiz/Quiz.svelte';

  let value = 'dialog';

  import { view } from '$lib/stores.ts';

  let menu: Menu;

  let disabled = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];

  export let abonent: any;
  setContext('abonent', abonent);

  let llang_input;
  let theme_sort_list, quiz_sort_list, items;

  let lesson_data = { data: { level: '' } };
  let levels: any = [];
  let module_input: any;

  let news;

  const quizes = ['выбери quiz...',  'dialog', 'word', 'bricks'];

  let containerWidth = '100%'; // Исходная ширина - 100% ширины родительского окна
  let containerHeight = '100vh';


  export async function fetchLesson(owner: string, level: string) {
    try {
      const response = await fetch(`/admin/module`, {
        method: 'POST',
          body: JSON.stringify({
            func: 'get_les',
            operator: abonent,
            level: level,
            owner: abonent,
          }),
          headers: { 'Content-Type': 'application/json' },
        });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const resp = await response.json();
      news = resp.news;
      $llang = resp.lang;
      return resp;
    } catch (error) {
      // console.error(error);
      return [];
    }
  }

  onMount(async () => {
    // Получаем ширину родительского окна при загрузке компонента
    const parentWidth = window.innerWidth; // Может потребоваться window.innerWidth - некоторое смещение, если у вас есть другие элементы на странице

    // Устанавливаем ширину контейнера равной ширине родительского окна
    containerWidth = parentWidth + 'px';

    // Получаем высоту родительского окна при загрузке компонента
    const parentHeight = window.innerHeight; // Может потребоваться window.innerHeight - некоторое смещение, если у вас есть другие элементы на странице

    // Устанавливаем высоту контейнера равной высоте родительского окна
    containerHeight = parentHeight + 'px';

    // const modules = JSON.parse(localStorage.getItem('kolmit'))['modules'];
    lesson_data = await fetchLesson(abonent, '');

  });

  $: if (lesson_data.data) {
    levels = lesson_data.levels;
    // $llang = lesson_data.lang.trim();
  }

  onDestroy(() => {});

  async function saveLessonData() {
    try {
      if (!lesson_data.level) {
        module_input.focus();
        return;
      }

      const updatedLessonData = {
        ...lesson_data, // Create a copy of the original lesson_data
        data: JSON.stringify(lesson_data.data), // Stringify the updated data
      };

      const response = await fetch(`/admin`, {
        method: 'POST',
        body: JSON.stringify({
          func: 'upd_lesson',
          lang: $llang,
          level: updatedLessonData.level,
          levels: levels,
          data: updatedLessonData.data,
          owner: abonent,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      //  lesson_data.data = data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  let quiz_data_export;
  
  function onClickQuiz(quiz: any, level: string, theme: string) {  

    quiz_data_export = {quiz:quiz.type,name:quiz.name[$llang],lang:lesson_data.lang,level:lesson_data.level,theme:theme.name[$llang]}

    // lesson_data.data.llang = lesson_data.data.lang;
    // // lesson_data.data.level = level;
    // lesson_data.data.name = quiz.name;
    // lesson_data.data.theme = theme;
    // // lesson_data.data.words = find(lesson_data.module.themes, {
    // // 	name: ev.currentTarget.attributes['name'].value
    // // })['words'];
    // lesson_data.data.quiz = quiz.type;

    // // lesson_data.data.level = lesson_data.level;

    // level = lesson_data.level;

 
    $view = 'quiz';
  }

  function OnClickQuizName(ev) {
    // ev.target.select()
  }

  function disablePanel(node) {
    try {
      let t = node.attributes['t'].value;
      disabled[parseInt(t)] = false;
    } catch (ex) {}
    // disabled = 'disabled';
  }

  export function findDeep(obj: object, predicate: string, path = '') {
    if (predicate(obj, path)) {
      return obj;
    }

    if (isObject(obj)) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let found = findDeep(obj[key], predicate, `${path}.${key}`);
          if (found) {
            return found;
          }
        }
      }
    }
    return null;
  }

  function OnAddTheme() {
    navigator.clipboard
      .readText()
      .then((text) => {
        const quiz_data = JSON.parse(text);
        pushTheme(quiz_data);
      })
      .catch((err) => {
        // console.error('Failed to read clipboard contents: ', err);
        pushTheme({ theme: { name: '' } });
      });

    function pushTheme(quiz_data: object) {
      lesson_data.data.module.themes.push({
        name: {
          [$llang]: quiz_data.theme.name,
        },
        words:
          quiz_data.words instanceof String
            ? quiz_data.words.split(', ')
            : quiz_data.words,
        grammar:
          quiz_data.grammar instanceof String
            ? quiz_data.grammar.split(', ')
            : quiz_data.grammar,
        lessons: [{ quizes: [] }],
      });

      lesson_data = lesson_data;
    }
  }

  function OnRemoveThemeItem(t) {
    lesson_data.data.module.themes.splice(t, 1);
    lesson_data = lesson_data;
  }

  function OnRemoveItem(name: string, t: any) {
    // let quiz = find(
    //   lesson_data.data.module.themes[t].lessons[0].quizes,
    //   (q) => {
    //     return (q[$langs] = name);
    //   }
    // );
    let ind = lesson_data.data.module.themes[t].lessons[0].quizes.findIndex(
      (q) => {
        return q.name[$llang] === name;
      }
    );
    lesson_data.data.module.themes[t].lessons[0].quizes.splice(ind, 1);
    lesson_data = lesson_data;
  }

  async function OnAddQuiz(name, t) {
    lesson_data.data.module.themes[t].lessons[0].quizes.push({
      type: 'quiz',
      name: { [$llang]: '' },
    });
    lesson_data = lesson_data;
  }

  function OnSelectQuiztype(type, t, name) {
    const item = find(
      lesson_data.data.module.themes[t].lessons[0].quizes,
      (quiz) => {
        if (quiz.name[$llang] === name) return quiz;
      }
    );

    // console.log(item);
    if (item) {
      item.type = type;
    }
    lesson_data = lesson_data;
  }

  function ChangeQuizName(name, new_name) {
    let item = findDeep(
      lesson_data.data.module,
      (value) => value.name === name,
      {
        childrenPath: 'quizes',
      }
    );
    if (item) {
      item.name = new_name;
    }
    lesson_data = lesson_data;
  }


  async function ChangeLevel(ev: any) {
    lesson_data.data.module.level = ev.target.attributes['level'].nodeValue;
    lesson_data = await fetchLesson(abonent, lesson_data.data.module.level);

    menu.setOpen(false);
  }

  let level = '';

  async function OnInput(ev) {
    lesson_data.level = ev.target.value;
    module = {
      level: lesson_data.data.module.level,
      themes: [],
    };

    levels.map(async (item) => {
      if (item !== lesson_data.data.module.level) {
        lesson_data.data.module.themes = [];
      } else {
        //  lesson_data = await fetchLesson(abonent, module.level);
      }
    });
  }



  function OnAddModule(ev) {
    menu.getElement().attributes.style.nodeValue = 'display:none';

    lesson_data.level = '';
    lesson_data.data.module.themes = [];
    module_input.focus();
  }

  async function OnRemModule(ev) {
    const rem_level = lesson_data.data.module.level;
    const ind = lesson_data.levels.indexOf(rem_level);
    lesson_data.levels.splice(ind, 1);
    lesson_data = lesson_data;
    lesson_data.data = await fetchLesson(
      abonent,
      lesson_data.data.module.level
    )['data'];
    lesson_data.data.module.level = lesson_data.levels[0];
  }

  function handleSort(event, items) {
    const { oldIndex, newIndex } = event;
    // Array move function (included here)
    function arrayMove(arr, fromIndex, toIndex) {
      const element = arr.splice(fromIndex, 1)[0];
      arr.splice(toIndex, 0, element);
      return arr;
    }

    // Update your lesson.quizes array based on the new order
    items = arrayMove(items, oldIndex, newIndex); // Assuming you have an arrayMove function (see below)
  }

  function OnPublish(quiz, state) {

    quiz.published = state?'': Date.now()

  }

  // async function OnThemeNameInput(t) {
  //   // console.log(theme)
  //   // return;
  //   let theme = lesson_data.data.module;
  //   if (!theme.name[$llang]) {
  //     Object.keys(theme.name).forEach(async (key) => {
  //       console.log(key);
  //       if (key !== $llang) {
  //         // theme.name[$llang] = await Translate(theme.name[key], key, $llang);
  //         // lesson_data = lesson_data;
  //         return;
  //       }
  //     });
  //   }
  // }

  // function OnThemeNameChange(event: Event, t:number) {
  //   let theme = lesson_data.data.module.themes[t];
  //   theme.name[$llang] =
  // }
</script>

<main>
  {#if $view === 'quiz'}
    <Quiz data={quiz_data_export} {ChangeQuizName} />
  {:else if lesson_data.data && lesson_data.data.module}
    <!-- svelte-ignore a11y-missing-content -->

    <div style="height:1500px; margin-top:20px">
      <div class="level_container" style="">
        {#await Translate('Save', 'en', $langs) then data}
          <button class="save" on:click={saveLessonData}>
            {data}
          </button>
        {/await}

        <div>
          <div class="add_module" style="display:inline-flex">
            {#await Translate('Добавить модуль', 'ru', $langs) then data}
              <IconButton
                class="material-icons"
                on:click={OnAddModule}
                title={data}>add</IconButton
              >{/await}
          </div>
          <Textfield
            bind:this={module_input}
            class="module_text"
            style="width:50px; text-align:center"
            value={lesson_data.level}
            label="Module"
            on:input={OnInput}
            on:click={() => menu.setOpen(true)}
          ></Textfield>

          <Textfield
            bind:this={llang_input}
            class="module_text"
            style="display:inline-flex; width:55px;text-align:center"
            bind:value={$llang}
            label="Language"
          ></Textfield>

          <div class="rem_module" style="display:inline-flex">
            {#await Translate('Удалить модуль', 'ru', $langs) then data}
              <IconButton
                class="material-icons rem_module"
                on:click={OnRemModule}
                title={data}>remove</IconButton
              >
            {/await}
          </div>

          <Menu bind:this={menu}>
            <List>
              {#each levels as level}
                <Item
                  on:SMUI:action={ChangeLevel}
                  {level}
                  style="text-align:center"
                >
                  <Text>{level}</Text>
                </Item>
              {/each}
            </List>
          </Menu>
        </div>
      </div>

      <div class="lesson-container" style="">
        <SortableList
          onSort={(ev) => {
            handleSort(ev, lesson_data.data.module.themes);
          }}
          bind:this={theme_sort_list}
        >
          {#each lesson_data.data.module.themes as theme, t}
            <div class="accordion-container">
              <Accordion multiple>
                <Panel class="panel">
                  <Header>
                    <!-- <h4><input value={theme.name[$langs]} /></h4> -->
                    <!-- <Textfield bind:value={theme.name[$langs]} style="width: 368px;">
									<HelperText slot="helper">Helper Text</HelperText>
								</Textfield> -->
                    {#await Translate('Input Theme Name', 'en', $langs) then data}
                      <input
                        placeholder={data}
                        bind:value={theme.name[$llang]}
                        style="font-weight: bold; width:90%"
                      />
                      <!-- {@debug theme, $llang} -->
                    {/await}
                    <div class="rem_theme">
                      {#await Translate('Remove theme', 'en', $langs) then data}
                        <IconButton
                          class="material-icons"
                          title={data}
                          name={theme.name[$llang]}
                          on:click={() => OnRemoveThemeItem(t)}
                          >remove</IconButton
                        >
                      {/await}
                    </div>
                  </Header>
                  <Content>
                    {#if theme.lessons}
                      {#each theme.lessons as lesson}
                        <!-- <div>{lesson.num}.{lesson.title}</div> -->
                        {#if lesson.quizes}
                          <SortableList
                            onSort={(ev) => {
                              handleSort(ev, lesson.quizes);
                            }}
                            bind:this={quiz_sort_list}
                          >
                            {#each lesson.quizes as quiz, q}
                              <!-- {@debug quiz} -->

                              <div class="quiz-container">
                                <Checkbox
                         
                                  on:click={()=>OnPublish(lesson_data.data.module.themes[t].lessons[0].quizes[q], quiz.published)}
    
                                  checked={quiz.published ? 'true' : ''}
                                  touch
                                ></Checkbox>

                                <div 
                                  on:click={() => {
                                    onClickQuiz(
                                      quiz,
                                      level,
                                      theme
                                    );
                                  }}
                                  class="icon"
                                  type={quiz.type}
                                  name={quiz.name[$llang]}
                                  level={lesson_data.data.module.level}
                                  highlight={quiz.highlight || ''}
                                >
                                  {#if quiz.type === 'dialog'}
                                    <Icon
                                      tag="svg"
                                      viewBox="0 0 24 24"
                                      width="30px"
                                      height="30px"
                                    >
                                      <path
                                        fill="grey"
                                        d={mdiAccountMultiple}
                                      />
                                    </Icon>
                                  {:else if quiz.type === 'text'}
                                    <Icon
                                      tag="svg"
                                      viewBox="0 0 24 24"
                                      width="30px"
                                      height="30px"
                                    >
                                      <path fill="grey" d={mdiTextBoxOutline} />
                                    </Icon>
                                  {:else if quiz.type === 'word'}
                                    <Icon
                                      tag="svg"
                                      viewBox="0 0 24 24"
                                      width="30px"
                                      height="30px"
                                    >
                                      <path
                                        fill="grey"
                                        d={mdiFileWordBoxOutline}
                                      />
                                    </Icon>
                                  {:else if quiz.type === 'bricks'}
                                    <Icon
                                      tag="svg"
                                      viewBox="0 0 24 24"
                                      width="30px"
                                      height="30px"
                                    >                          
                                      <rect x="3" y="3" width="8" height="3" />
                                      <rect x="13" y="3" width="8" height="3" />
                                      <rect x="3" y="8" width="4" height="3" />
                                      <rect x="9" y="8" width="6" height="3" />
                                      <rect x="17" y="8" width="4" height="3" />
                                      <rect x="3" y="13" width="8" height="3" />
                                      <rect x="13" y="13" width="8" height="3" />
                                      <rect x="3" y="18" width="4" height="3" />
                                      <rect x="9" y="18" width="6" height="3" />
                                      <rect x="17" y="18" width="4" height="3" />
                                    </Icon>
                  
                                  {:else if quiz.type === 'quiz'}
                                    <select
                                      on:click|preventDefault|once|stopPropagation={() => {}}
                                      on:change={(event) =>
                                        OnSelectQuiztype(
                                          event.target.value,
                                          t,
                                          quiz.name[$llang]
                                        )}
                                      name={quiz.name[$llang]}
                                    >
                                      {#each quizes as quizOption}
                                        <option value={quizOption}
                                          >{quizOption}</option
                                        >
                                      {/each}
                                    </select>
                                  {/if}
                                </div>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                {#if quiz.type === 'quiz'}
                                  {#await Translate('Quiz Name', $llang, $langs) then data}
                                    <input
                                      class="quiz_name"
                                      on:click={OnClickQuizName}
                                      autofocus
                                      contenteditable
                                      {t}
                                      placeholder={data}
                                      name={quiz.name[$langs]}
                                      theme={theme.num}
                                      theme_name={theme.name[$llang]}
                                      bind:value={quiz.name[$langs]}
                                    />
                                  {/await}
                                {:else}
                                  {#await Translate('Quiz Name', $llang, $langs) then data}
                                    <input
                                      on:click={OnClickQuizName}
                                      style="width:80%"
                                      {t}
                                      placeholder={data}
                                      name={quiz.name[$llang]}
                                      level={level}
                                      theme={theme.num}
                                      theme_name={theme.name[$llang]}
                                      bind:value={quiz.name[$llang]}
                                    />
                                  {/await}
                                {/if}

                                <div class="rem_quiz">
                                  {#await Translate('Remove quiz', 'en', $langs) then data}
                                    <IconButton
                                      class="material-icons"
                                      title={data}
                                      name={quiz.name[$llang]}
                                      on:click={() => {
                                        OnRemoveItem(quiz.name[$llang], t);
                                      }}>remove</IconButton
                                    >
                                  {/await}
                                </div>
                              </div>
                            {/each}
                          </SortableList>
                        {/if}
                      {/each}
                      <div class="add_quiz" style="left:10px;top:20px">
                        {#await Translate('Add quiz', 'en', $langs) then data}
                          <IconButton
                            class="material-icons"
                            title={data}
                            name={theme.name[$llang]}
                            on:click={() => {
                              OnAddQuiz(theme.name[$llang], t);
                            }}>add</IconButton
                          >
                        {/await}
                      </div>
                    {/if}
                  </Content>
                </Panel>
              </Accordion>
            </div>
          {/each}
        </SortableList>
        {#if lesson_data.level && $llang !== ' '}
          <div class="add_theme">
            {#await Translate('Add theme', 'en', $langs) then data}
              <IconButton
                class="material-icons"
                on:click={() => OnAddTheme()}
                title={data}>add</IconButton
              >
            {/await}
          </div>
        {/if}
      </div>

      <div style="height:100px"></div>
    </div>
  {/if}
</main>

<style>

:global(.mdc-icon-button) {
    padding: 1px;
    margin: 1px;
    width: 25px;
    height: 25px;
  }

:global(.smui-accordion
  .smui-accordion__panel
  > .smui-accordion__header.smui-accordion__header__title) {
  height: 65px;
  padding: 0x 5px;
} 

:global(.smui-accordion
  .smui-accordion__panel.smui-accordion__panel--open
  > .smui-paper__content) {
  height: auto;
  padding: 8px 5px;
}

main {
    margin-top: 40px;
  }
  .module_level {
    position: fixed;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px;
    bottom: -15px;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .level_container {
    display: flex;
    justify-content: space-between;
    width: 95%;
  }

  .quiz_name {
    width: 80%;
    margin-right: 10px;
  }

  .save {
    position: sticky;
    top: 30px;
    /* width: 15%; */
    margin: 15px;
  }

  .lesson-container {
    height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    max-width: 100%;
    padding-top: 10px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .quiz-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0px;
    margin-top: 5px;
  }

  .icon{
    position: relative;
    top: 10px;
  }

  .add_quiz,
  .add_theme,
  .add_module,
  .rem_quiz,
  .rem_theme,
  .rem_module {
    display: inline-flex;
    position: relative;

    background-color: aliceblue;
    border-radius: 24px;
    width: 24px;
    height: 24px;
    scale: 1.2;
  }

  div > .rem_quiz,
  div > .rem_theme,
  div > .rem_module {
    display: flex;
    align-items: center;
  }

  .rem_theme {
    position: absolute;
    right: 0;
    top: 5px;
  }

  .add_theme {
    position: relative;
    top: 10px;
  }

  select {
    height: 25px;
  }

  input {
    border: 0;
  }
  ::-moz-selection {
    background-color: grey;
    outline: none;
  }

  ::selection {
    background-color: lightblue;
    outline: none;
  }

  ::placeholder {
    font-weight: 400;
  }
  div:focus,
  input:focus {
    /* background: lightcyan; */
    outline: none; /* Убираем также контур */
  }

  select {
    border: 0;
    background-color: lightgray;
  }

  option {
    font-size: larger;
  }
</style>
