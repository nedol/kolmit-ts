<script>
  import { onMount, onDestroy } from 'svelte';

  import pkg from 'lodash';
  const { find, findKey, mapValues } = pkg;
  import IconButton, { Icon } from '@smui/icon-button';
  import Card, { PrimaryAction, Media, MediaContent } from '@smui/card';
  import {
    mdiAccountMultiple,
    mdiTextBoxOutline,
    mdiCardTextOutline,
    mdiEarHearing,
    mdiFileWordBoxOutline,
  } from '@mdi/js';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import FormField from '@smui/form-field';
  import Checkbox from '@smui/checkbox';
  import Quiz from './quiz/Quiz.svelte';

  import { operator } from '$lib/js/stores.js';
  import { users } from '$lib/js/stores.js';
  import { msg_oper } from '$lib/js/stores.js';

  import { quiz_users_ } from '$lib/js/stores.js';
  import { users_status } from '$lib/js/stores.js';

  import operator_svg from '$lib/images/operator.svg';

  // import lesson_data from './lesson.json';
  let lesson_data;

  function findPic(email) {
    const pic = find($users[0].pictures, { operator: email });
    return pic ? pic.pictures : operator_svg;
  }

  let usersPic = $users[0].staff.map((item) => ({
    email: item.email,
    src: findPic(item.email),
    name: item.name,
    status: item.status,
  }));

  import tutor_src from '$lib/images/tutor.png';
  // import { view } from '$lib/js/stores.js';
  export let view;

  import { lesson } from '$lib/js/stores.js';

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

  let level;

  export let data;
  let panel_disabled = true;

  let containerWidth = '100%'; // Исходная ширина - 100% ширины родительского окна
  let containerHeight = '100vh';

  let checked = {};
  let quiz_users = {};

  $: if ($users_status) {
    BuildQuizUsers($quiz_users_);
  }

  BuildQuizUsers($quiz_users_);

  $: if ($msg_oper && $msg_oper['quiz_users']) {
    // console.log($msg_oper['quiz_users']);
    BuildQuizUsers($msg_oper.quiz_users);
  }

  function BuildQuizUsers(qu) {
    Object.keys(qu).map((quiz) => {
      quiz_users[quiz] = [
        {
          name: 'Tutor',
          src: tutor_src,
        },
      ];
      qu[quiz].map((user) => {
        if (user === $operator.em) {
          checked[quiz] = true;
          return false;
        }
        let obj = find(usersPic, { email: user });
        let obj_pic = find($users[0].pictures, { operator: user });
        // obj.src = obj_pic.picture;
        // console.log(obj);
        if ($users_status[user] !== 'inactive') quiz_users[quiz].push(obj);
      });
    });
    quiz_users = quiz_users;
  }

  export async function fetchLesson(lessonNumber, owner) {
    try {
      const response = await fetch(
        `./lesson?lesson=${lessonNumber}&owner=${owner}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  onMount(async () => {
    // // Получаем ширину родительского окна при загрузке компонента
    // const parentWidth = window.innerWidth; // Может потребоваться window.innerWidth - некоторое смещение, если у вас есть другие элементы на странице

    // // Устанавливаем ширину контейнера равной ширине родительского окна
    // containerWidth = parentWidth + 'px';

    // // Получаем высоту родительского окна при загрузке компонента
    // const parentHeight = window.innerHeight; // Может потребоваться window.innerHeight - некоторое смещение, если у вас есть другие элементы на странице

    // // Устанавливаем высоту контейнера равной высоте родительского окна
    // containerHeight = parentHeight + 'px';

    const lessonData = await fetchLesson($operator.abonent);
    lesson_data = lessonData.data;
    level = lesson_data.module;
  });

  onDestroy(() => {
    data = '';
    lesson_data = '';
    level = '';
    quiz_users = '';
  });

  function onClickQuiz(ev) {
    if (ev) {
      data.llang = lesson_data.lang;
      data.level = ev.currentTarget.attributes['level'].value.replace('.', '');
      data.name = ev.currentTarget.attributes['name'].value;
      data.theme = ev.currentTarget.attributes['theme_name'].value;
      data.words = find(lesson_data.module.themes, {
        name: ev.currentTarget.attributes['theme_name'].value,
      })['words'];
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

  function OnCheck(node) {
    // console.log(node.currentTarget.attributes['name'].value);
    const name = node.currentTarget.attributes['name'].value;
    let par = {};
    par.proj = 'kolmit';
    par.func = 'quiz_users';
    par.abonent = $operator.abonent;
    par.quiz = name;
    if (!checked[name]) {
      checked[node.currentTarget.attributes['name'].value];
      let obj = find(usersPic, {
        email: $operator.em,
      });

      quiz_users[name].push({
        src: obj.src,
        email: $operator.em,
        name: obj.name,
      });

      par.add = $operator.em;
    } else {
      let el = find(quiz_users[name], { email: $operator.em });
      try {
        // el = '';
        const ind = quiz_users[name].indexOf(el);

        quiz_users[name].splice(ind, 1);
        console.log(quiz_users[name]);
      } catch (ex) {
        console.log(ex);
      }
      par.rem = $operator.em;
    }
    quiz_users = quiz_users;

    fetch('/lesson', {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify({ par }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.resp);
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

  function AddCheck(node) {
    // console.log(node.attributes['name'].value);
    if (!checked[node.attributes['name'].value])
      checked[node.attributes['name'].value] = false;
    if (!quiz_users[node.attributes['name'].value])
      quiz_users[node.attributes['name'].value] = [];
  }

  function OnClickUserCard(ev) {
    if (ev.currentTarget.attributes['email']) {
      const em = ev.currentTarget.attributes['email'].value;
    } else {
      onClickQuiz(ev);
    }
  }
</script>

<!-- svelte-ignore a11y-missing-content -->
<!-- {@debug display} -->
<div style="display:{display}">
  <!-- {@debug data} -->
  {#if data.quiz}
    <Quiz {data} bind:lesson_display={display} />
  {:else if level}
    <div class="lesson-container" style="">
      <div class="module_level">
        <div>Module {level.level}</div>
      </div>

      {#each level.themes as theme, t}
        <div class="accordion-container">
          <Accordion multiple>
            <Panel class="panel" disabled={disabled[parseInt(t)]}>
              <Header><h4>{theme.name}</h4></Header>
              <Content>
                {#if theme.lessons}
                  {#each theme.lessons as lesson}
                    <!-- <div>{lesson.num}.{lesson.title}</div> -->
                    {#if lesson.quizes}
                      {#each lesson.quizes as quiz}
                        <!-- {@debug quiz} -->
                        {#if quiz.name}
                          <div
                            class="quiz-container"
                            use:AddCheck
                            name={quiz.name}
                          >
                            {#if quiz.type === 'dialog'}
                              <Icon
                                tag="svg"
                                viewBox="0 0 24 24"
                                width="50px"
                                height="50px"
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
                            {/if}
                            <!-- svelte-ignore a11y-invalid-attribute -->

                            <a
                              href="#"
                              use:disablePanel
                              on:click={onClickQuiz}
                              style="width:100%"
                              {t}
                              type={quiz.type}
                              name={quiz.name}
                              level={level.level}
                              theme={theme.num}
                              theme_name={theme.name}
                              title={quiz.title}
                              highlight={quiz.highlight || ''}
                              >{quiz.name}
                            </a><span />
                            {#if quiz.type === 'dialog'}
                              <div class="form-field-container">
                                <FormField>
                                  <Checkbox
                                    on:click={OnCheck}
                                    name={quiz.name}
                                    bind:checked={checked[quiz.name]}
                                    touch
                                  ></Checkbox>
                                </FormField>
                              </div>
                            {/if}
                          </div>

                          {#if quiz_users[quiz.name] && quiz_users[quiz.name].length > 0}
                            <!-- {@debug quiz_users} -->
                            <div class="user-cards">
                              {#each quiz_users[quiz.name] as qu, q}
                                {#if qu.email !== $operator.em}
                                  <div
                                    on:click={OnClickUserCard}
                                    email={qu.email}
                                    {t}
                                    type={quiz.type}
                                    name={quiz.name}
                                    level={level.level}
                                    theme={theme.num}
                                    theme_name={theme.name}
                                  >
                                    <Card
                                      style="width:30px;  margin-right:15px"
                                    >
                                      <Media
                                        class="card-media-square"
                                        aspectRatio="square"
                                      >
                                        <MediaContent>
                                          <img
                                            src={qu.src}
                                            alt=""
                                            width="22px"
                                            style="position:relative; left:3px"
                                          />
                                        </MediaContent>
                                      </Media>
                                      <!-- <Content style="color: #888; font-size:smaller">{name}</Content> -->
                                      <h3
                                        class="mdc-typography--subtitle2"
                                        style="margin: -7px; color: #888;font-size:x-small;text-align:center;z-index:1"
                                      >
                                        {#if qu.name}
                                          {qu.name.slice(0, 8)}
                                        {:else}
                                          {qu.email.slice(0, 8)}
                                        {/if}
                                      </h3>
                                    </Card>
                                  </div>
                                {/if}
                              {/each}
                            </div>
                          {/if}
                        {/if}
                      {/each}
                    {/if}
                  {/each}
                {/if}
              </Content>
            </Panel>
          </Accordion>
        </div>
      {/each}
    </div>
    <div style="height:100px"></div>
  {/if}
</div>

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

  .user-cards {
    display: flex;
    justify-content: flex-end;
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
    justify-content: start;
    align-items: center;
    padding: 10px; /* Установите желаемый отступ вокруг элемента */
  }

  .form-field-container {
    display: flex;
    justify-content: flex-end;
    align-items: right;
    width: 100%; /* Занимать всю доступную ширину */
    z-index: 2;
  }
</style>
