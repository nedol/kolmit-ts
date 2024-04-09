<script lang="ts">
  import { setContext, onMount, onDestroy } from 'svelte';

  import pkg from 'lodash';
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

  // import Select, { Option } from '@smui/select';

  import Quiz from '../quiz/Quiz.svelte';

  import operator_svg from '$lib/images/operator.svg';

  import tutor_src from '$lib/images/tutor.png';
  // import { view } from '$lib/js/stores.js';
  let view = 'lesson';
  let value = 'dialog';

  import { lesson } from '$lib/js/stores.js';
  let menu: Menu;

  let clicked = '';

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

  let display = 'hidden';

  $: if ($lesson.data) {
    // if (view !== 'lesson')
    data = $lesson.data;
  }
  $: if (view === 'lesson') {
    display = 'block';
  } else {
    display = 'none';
    data.quiz = '';
  }

  export let abonent: any;
  setContext('abonent', abonent);

  let llang = ' ',
    llang_input;

  let lesson_data: any;
  let levels: any = [];
  let module_input: any;

  let module = {
    level: ' ',
    themes: [],
  };

  const quizes = ['', 'listen', 'text', 'dialog', 'word'];
  let input_quiz

  let data = {};
  let panel_disabled = true;

  let containerWidth = '100%'; // Исходная ширина - 100% ширины родительского окна
  let containerHeight = '100vh';

  let checked = {};

  export async function fetchLesson(owner: string, level: string) {
    try {
      let lev_str = level ? '&level=' + level : '';
      const response = await fetch(`./lesson?lesson=${abonent}` + lev_str);
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
    lesson_data = await fetchLesson(abonent);
  });

  $: if (lesson_data && lesson_data.data) {
    module = lesson_data.data.module; //lessonData.data.module;
    module.level = lesson_data.level;
    levels = lesson_data.levels;
    llang = lesson_data.lang.trim();
  }

  onDestroy(() => {});

  async function saveLessonData() {
    try {
      if (!module.level) {
        module_input.focus();
        return;
      }

      lesson_data.data = { module: module };

      const response = await fetch(`/admin`, {
        method: 'POST',
        body: JSON.stringify({
          func: 'upd_lesson',
          lang: llang,
          level: module.level,
          levels: levels,
          data: JSON.stringify(lesson_data.data),
          owner: abonent,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      lesson_data = await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function onClickQuiz(ev) {
    if (ev.currentTarget.attributes['type'].value !== 'quiz') {
      data.llang = lesson_data.lang.trim();
      data.level = ev.currentTarget.attributes['level'].value;
      data.name = ev.currentTarget.attributes['name'].value;
      // data.theme = ev.currentTarget.attributes['theme'].value;
      // data.words = find(lesson_data.module.themes, {
      // 	name: ev.currentTarget.attributes['theme_name'].value
      // })['words'];
      data.quiz = ev.currentTarget.attributes['type'].value;
      if (ev.currentTarget.attributes['highlight'])
        data.highlight = ev.currentTarget.attributes['highlight'].value;
    }
  }

  function disablePanel(node) {
    try {
      let t = node.attributes['t'].value;
      disabled[parseInt(t)] = false;
    } catch (ex) {}
    // disabled = 'disabled';
  }

  function OnClickUserCard(ev) {
    if (ev.currentTarget.attributes['email']) {
      const em = ev.currentTarget.attributes['email'].value;
    } else {
      onClickQuiz(ev);
    }
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
      if (Array.isArray(obj[key])) {
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

  function OnAddTheme(ev) {
    lesson_data.data.module = module;
    lesson_data.level = module.level;
    module.themes.unshift({
      name: 'Theme name',
      lessons: [{ quizes: [] }],
    });
    console.log(module.level);
    module = module;
  }

  function OnRemoveThemeItem(ev) {
    find(module.themes, {
      name: ev.currentTarget.attributes['name'].nodeValue,
    });
  }

  function OnRemoveItem(ev) {
    deleteObjectByName(module, ev.currentTarget.attributes['name'].nodeValue);
    module = module;
  }

  function OnChangeThemeName(ev) {
    const name = ev.currentTarget.attributes['name'].nodeValue;
    const upd = ev.target.innerText;
    if (name === upd) return;
    let item = findDeep(module, (value) => value.name === name, {
      childrenPath: 'themes',
    });
    if (item) {
      item.name = upd;
    }
    module = module;
  }

  function OnAddQuiz(ev) {
    const theme = find(module.themes, {
      name: ev.currentTarget.attributes['name'].nodeValue,
    });
    theme.lessons[0].quizes.push({
      type: 'quiz',
      name: 'Quiz name',
    });
    module = module;
  }

  function OnSelectQuiztype(ev) {

    const name = ev.target.parentElement.attributes['name'].nodeValue;
    let item = findDeep(module, (value) => value.name === name, {
      childrenPath: 'quizes',
    });
    if (item) {
      item.type = ev.target.value;
    }
    module = module;
  }

  function ChangeQuizName(name, new_name) {
    let item = findDeep(module, (value) => value.name === name, {
      childrenPath: 'quizes',
    });
    if (item) {
      item.name = new_name;
    }
    module = module;
  }

  function OnChangeQuizName(ev) {}

  async function ChangeLevel(ev: any) {
    module.level = ev.target.attributes['level'].nodeValue.trim();
    lesson_data = await fetchLesson(abonent, module.level);
    menu.setOpen(false)
  }

  let level = '';
  async function OnInput(ev) {
    lesson_data.level = ev.target.value;
    module = {
      level: module.level,
      themes: [],
    };

    levels.map(async (item) => {
      if (item !== module.level) {
        lesson_data.data.module.themes = [];
      } else {
        //  lesson_data = await fetchLesson(abonent, module.level);
      }
    });
  }

  function OnClickQuizName(ev){
    // ev.target.select()
  }

  function OnAddModule(ev) {
    menu.getElement().attributes.style.nodeValue = 'display:none';

    lesson_data.level = '';
    lesson_data.data.module.themes = [];
    module_input.focus();
  }

  async function OnRemModule(ev) {
    const rem_level = module.level;
    const ind = lesson_data.levels.indexOf(rem_level);
    lesson_data.levels.splice(ind, 1);
    module = module;
    lesson_data.data = await fetchLesson(abonent, module.level)['data'];
    module.level = lesson_data.levels[0];
  }
</script>

{#if data.quiz}
  <Quiz bind:data bind:lesson_display={display} {ChangeQuizName} />
{:else if module}
  <!-- svelte-ignore a11y-missing-content -->

  <div style="display:{display}; height:1500px">
    <div class="level_container" style="">
      <button class="save" on:click={saveLessonData}>Сохранить</button>

      <div>
        <div class="add_module" style="display:inline-flex">
          <IconButton class="material-icons" on:click={OnAddModule}
            >add</IconButton
          >
        </div>
        <Textfield
          bind:this={module_input}
          class="module_text"
          style="width:50px; text-align:center"
          value={module.level}
          label="Module"
          on:input={OnInput}
          on:click= {() => menu.setOpen(true)}
        ></Textfield>

        <Textfield
          bind:this={llang_input}
          class="module_text"
          style="display:inline-flex; width:55px;text-align:center"
          bind:value={llang}
          label="Language"
        ></Textfield>

        <div class="rem_module" style="display:inline-flex">
          <IconButton class="material-icons rem_module" on:click={OnRemModule}
            >remove</IconButton
          >
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
      {#each module.themes as theme, t}
        <div class="accordion-container">
          <Accordion multiple>
            <Panel class="panel">
              <Header>
                <!-- <h4><input value={theme.name} /></h4> -->
                <!-- <Textfield bind:value={theme.name} style="width: 368px;">
									<HelperText slot="helper">Helper Text</HelperText>
								</Textfield> -->
                <div
                  contenteditable
                  on:blur={OnChangeThemeName}
                  name={theme.name}
                  style="font-weight: 600;width:90%"
                >
                  {theme.name}
                </div>
                <div class="rem_theme">
                  <IconButton
                    class="material-icons "
                    name={theme.name}
                    on:click={OnRemoveItem}>remove</IconButton
                  >
                </div>
              </Header>
              <Content>
                {#if theme.lessons}
                  {#each theme.lessons as lesson}
                    <!-- <div>{lesson.num}.{lesson.title}</div> -->
                    {#if lesson.quizes}
                      {#each lesson.quizes as quiz}
                        <!-- {@debug quiz} -->

                        <div class="quiz-container" name={quiz.name}>
                          <div
                            on:click={onClickQuiz}
                            type={quiz.type}
                            name={quiz.name}
                            level={module.level}
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
                              theme_name={theme.name}                            
                              bind:value={quiz.name}/>
                        
                          {:else}
                            <input
                              on:click={OnClickQuizName}
                              style="width:80%"
                              {t}
                              name={quiz.name}
                              level={module.level}
                              theme={theme.num}
                              theme_name={theme.name}
                              title={quiz.title}
                              bind:value={quiz.name}
                            />
                          {/if}

                          {#if quiz.type === 'quiz'}
                          
                            <select on:change={OnSelectQuiztype}>
                              {#each quizes as quizOption}
                                <option value={quizOption}>{quizOption}</option>
                              {/each}
                            </select>
                          {/if}

                          <div class="rem_quiz">
                            <IconButton
                              class="material-icons"
                              name={quiz.name}
                              on:click={OnRemoveItem}>remove</IconButton
                            >
                          </div>
                        </div>
                      {/each}
                    {/if}
                  {/each}
                  <div class="add_quiz">
                    <IconButton
                      class="material-icons"
                      name={theme.name}
                      on:click={OnAddQuiz}>add</IconButton
                    >
                  </div>
                {/if}
              </Content>
            </Panel>
          </Accordion>
        </div>
      {/each}
      {#if module.level && llang !== ' '}
        <div class="add_theme">
          <IconButton class="material-icons" on:click={OnAddTheme}
            >add</IconButton
          >
        </div>
      {/if}
    </div>

    <div style="height:100px"></div>
  </div>
{/if}

<style>
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
    /* height: 120vh; */

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
    border-radius: 25px;
    width: 50px;
    height: 50px;
    scale: 0.8;
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

  div:focus,
  input:focus
  {
    /* background: lightcyan; */
    outline: none; /* Убираем также контур */
  }

  select{
    border:0;
    background-color: lightgray ;
  }

  option{
    font-size: larger;
  }
</style>
