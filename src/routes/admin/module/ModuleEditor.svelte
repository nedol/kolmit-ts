<script lang="ts">
  import { setContext, onMount, onDestroy } from 'svelte';

  import translate from 'translate';

  import pkg, { indexOf } from 'lodash';
  const { find, findKey, mapValues } = pkg;

  import _ from 'lodash';
  // import deepdash from 'deepdash';
  // deepdash(_);
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

  import { langs, llang, dicts } from '$lib/js/stores.js';

  import Quiz from '../quiz/Quiz.svelte';

  let value = 'dialog';

  import { view } from '$lib/js/stores.js';

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

  let lesson_data = { data: '' };
  let levels: any = [];
  let module_input: any;

  const quizes = ['выбери quiz...', 'listen', 'dialog', 'word'];

  let containerWidth = '100%'; // Исходная ширина - 100% ширины родительского окна
  let containerHeight = '100vh';

  // $: if ($langs && lesson_data.data.module && llang) {

  //   lesson_data.data.module.themes.map(async (theme) => {
  //     if (!theme.name[$langs]) {
  //       theme.name[$langs] = await Translate(theme.name[llang], $langs);
  //     }
  //   });

  // }

  async function Translate(text: string, from_lang: string, to_lang: string) {
    try {
      translate.from = from_lang;

      return (
        ($dicts[text] && $dicts[text][$langs]) ||
        (await translate(text.trim(), to_lang))
      );
    } catch (error) {
      console.error('Translation error:', error);
      return text; // или другое подходящее значение по умолчанию
    }
  }

  export async function fetchLesson(owner: string, level: string) {
    try {
      let lev_str = level ? '&level=' + level : '';
      const response = await fetch(`./lesson?lesson=${abonent}&owner=${abonent}` + lev_str);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
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

  $: if (lesson_data && lesson_data.data) {
    levels = lesson_data.levels;
    $llang = lesson_data.lang.trim();

    translate.engine = 'google';
  }

  onDestroy(() => {});

  async function saveLessonData() {
    try {
      if (!lesson_data.level) {
        module_input.focus();
        return;
      }

      // console.log(lesson_data.data);
      // return;

      const response = await fetch(`/admin`, {
        method: 'POST',
        body: JSON.stringify({
          func: 'upd_lesson',
          lang: $llang,
          level: lesson_data.level,
          levels: levels,
          data: JSON.stringify(lesson_data.data),
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

  function onClickQuiz(quiz: any, level) {
    $view = 'quiz';

    saveLessonData();

    lesson_data.data.llang = lesson_data.data.lang;
    // lesson_data.data.level = level;
    lesson_data.data.name = quiz.name[lesson_data.data.lang];
    // data.theme = ev.currentTarget.attributes['theme'].value;
    // data.words = find(lesson_data.module.themes, {
    // 	name: ev.currentTarget.attributes['theme_name'].value
    // })['words'];
    lesson_data.data.quiz = quiz.type;
  }

  function disablePanel(node) {
    try {
      let t = node.attributes['t'].value;
      disabled[parseInt(t)] = false;
    } catch (ex) {}
    // disabled = 'disabled';
  }

  export function findDeep(obj, predicate, path = '') {
    if (predicate(obj, path)) {
      return obj;
    }

    if (_.isObject(obj)) {
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

  function deleteObjectByName(obj, name) {
    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key][$langs])) {
        // Удаление объектов с заданным id
        obj[key] = obj[key].filter(
          (item) => !(item.name && item.name === name)
        );
        // Продолжаем поиск внутри каждого элемента массива
        obj[key].forEach((item) => deleteObjectByName(item, name));

        // Преобразование после удаления
        if (obj[key].length === 0) {
          // delete obj[key]; // Удаляем пустой массив
        } else if (obj[key].length === 1) {
          obj[key] = [obj[key][0]]; // Преобразуем массив с одним элементом в этот элемент
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if ('name' in obj[key] && obj[key].name === name) {
          delete obj[key]; // Удаляем объект, если найден id
        } else {
          deleteObjectByName(obj[key], name); // Продолжаем поиск, если это объект
        }
      }
    });
  }

  function OnAddTheme() {
    lesson_data.data.module.themes.push({
      name: 'Input Theme Name',
      lessons: [{ quizes: [] }],
    });
    console.log(lesson_data.data.module.level);
    lesson_data = lesson_data;
  }

  function OnRemoveThemeItem(t) {
    lesson_data.data.module.themes.splice(t, 1);
    lesson_data = lesson_data;
  }

  function OnRemoveItem(name, t) {
    let quiz = find(
      lesson_data.data.module.themes[t].lessons[0].quizes,
      (q) => {
        return (q[$langs] = name);
      }
    );
    let ind = lesson_data.data.module.themes[t].lessons[0].quizes.indexOf(quiz);
    lesson_data.data.module.themes[t].lessons[0].quizes.splice(ind, 1);
    lesson_data = lesson_data;
  }

  function OnChangeThemeName(ev) {
    const upd = ev.target.innerText;
    if (name === upd) return;
    let item = findDeep(
      lesson_data.data.module.themes,
      (value) => value[0].name === name,
      {
        childrenPath: 'themes',
      }
    );

    if (item) {
      item[0].name = upd;
    }
    lesson_data = lesson_data;
  }

  async function OnAddQuiz(name, t) {
    lesson_data.data.module.themes[t].lessons[0].quizes.push({
      type: 'quiz',
      name: { [$langs]: await Translate('Quiz Name', 'en', $langs) },
    });
    lesson_data = lesson_data;
  }

  function OnSelectQuiztype(type, t, name) {
    const item = find(
      lesson_data.data.module.themes[t].lessons[0].quizes,
      (quiz) => {
        if (quiz.name[$langs] === name) return quiz;
      }
    );

    console.log(item);
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

  function OnChangeQuizName(ev) {}

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

  function OnClickQuizName(ev) {
    // ev.target.select()
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

  async function OnThemeNameInput(theme) {
    if (!theme.name[$llang]) {
      Object.keys(theme.name).forEach(async (key) => {
        if (key !== $llang) {
          // $langs = key;
          theme.name[$llang] = await Translate(theme.name[key], key, $llang);
          lesson_data = lesson_data;
          return;
        }
      });
    }
  }
</script>

<main>
  {#if $view === 'quiz'}
    <Quiz data={lesson_data.data} {ChangeQuizName} />
  {:else if lesson_data.data && lesson_data.data.module}
    <!-- svelte-ignore a11y-missing-content -->

    <div style="height:1500px; margin-top:20px                              ">
      <div class="level_container" style="">
        <button class="save" on:click={saveLessonData}>
          {#await Translate('Сохранить', 'ru', $langs) then data}
            {data}
          {/await}
        </button>

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
                      :use={theme.name[$llang]
                        ? theme.name[$llang]
                        : ((ev) => {
                            OnThemeNameInput(theme);
                          })()}
                      bind:value={theme.name[$llang]}
                      style="font-weight: bold; width:90%"
                    />
                  {/await}
                  <div class="rem_theme">
                    {#await Translate('Remove theme', 'en', $langs) then data}
                      <IconButton
                        class="material-icons"
                        title={data}
                        name={theme.name[$llang]}
                        on:click={() => OnRemoveThemeItem(t)}>remove</IconButton
                      >
                    {/await}
                  </div>
                </Header>
                <Content>
                  {#if theme.lessons}
                    {#each theme.lessons as lesson}
                      <!-- <div>{lesson.num}.{lesson.title}</div> -->
                      {#if lesson.quizes}
                        {#each lesson.quizes as quiz, q}
                          <!-- {@debug quiz} -->

                          <div class="quiz-container">
                            <div
                              on:click={() => {
                                onClickQuiz(
                                  quiz,
                                  lesson_data.data.module.level
                                );
                              }}
                              type={quiz.type}
                              name={quiz.name[$langs]}
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
                                  <path fill="grey" d={mdiAccountMultiple} />
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
                                  <path fill="grey" d={mdiFileWordBoxOutline} />
                                </Icon>
                              {:else if quiz.type === 'listen'}
                                <Icon
                                  tag="svg"
                                  viewBox="0 0 24 24"
                                  width="30px"
                                  height="30px"
                                >
                                  <path fill="grey" d={mdiEarHearing} />
                                </Icon>
                              {:else if quiz.type === 'quiz'}
                                <Icon
                                  tag="svg"
                                  viewBox="0 0 24 24"
                                  width="30px"
                                  height="30px"
                                >
                                  <path fill="grey" d={mdiHelp} />
                                </Icon>
                              {/if}
                            </div>
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            {#if quiz.type === 'quiz'}
                              <input
                                class="quiz_name"
                                on:click={OnClickQuizName}
                                autofocus
                                contenteditable
                                {t}
                                name={quiz.name}
                                theme={theme.num}
                                theme_name={theme.name[$llang]}
                                bind:value={quiz.name[$langs]}
                              />
                            {:else}
                              <input
                                on:click={OnClickQuizName}
                                style="width:80%"
                                {t}
                                name={quiz.name}
                                level={lesson_data.data.level}
                                theme={theme.num}
                                theme_name={theme.name[$llang]}
                                bind:value={quiz.name[$langs]}
                              />
                            {/if}

                            {#if quiz.type === 'quiz'}
                              <select
                                on:change={(event) =>
                                  OnSelectQuiztype(event.target.value, t, quiz.name[$langs])}
                                name={quiz.name[$langs]}
                              >
                                {#each quizes as quizOption}
                                  <option value={quizOption}
                                    >{quizOption}</option
                                  >
                                {/each}
                              </select>
                            {/if}

                            <div class="rem_quiz">
                              {#await Translate('Remove quiz', 'en', $langs) then data}
                                <IconButton
                                  class="material-icons"
                                  title={data}
                                  name={quiz.name[$langs]}
                                  on:click={() => {
                                    OnRemoveItem(quiz.name[$langs], q);
                                  }}>remove</IconButton
                                >
                              {/await}
                            </div>
                          </div>
                        {/each}
                      {/if}
                    {/each}
                    <div class="add_quiz">
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
    align-items: center;
    padding: 10px; /* Установите желаемый отступ вокруг элемента */
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
