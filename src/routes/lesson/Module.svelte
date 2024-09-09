<script lang="ts">
  import { onMount, onDestroy, getContext } from 'svelte';

 import { Translate } from '../translate/Transloc.js';

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

  import {
    users,
    langs,
    llang,
    dicts,
    msg_oper,
    users_status,
  } from '$lib/js/stores.js';

  // import lesson_data from './lesson.json';
  let lesson_data: any;

  const group = getContext('group');
  const operator = getContext('operator');

  function findPic(operator: any) {
    const pic = find(group[0].pictures, { operator: operator });
    return pic ? pic.pictures : '/assets/operator.svg';
  }

  let usersPic = group.map((item: any) => ({
    operator: item.operator,
    src: findPic(item.operator),
    name: item.name,
    status: item.status,
  }));

  import tutor_src from '$lib/images/tutor.png';
  // import { view } from '$lib/js/stores.js';

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

  $: if ($lesson.data) {
    // if (view !== 'lesson')
    data = $lesson.data;
  }

  let module;

  export let data;
  let panel_disabled = true;

  let checked = {};
  let quiz_users = {};

  $: if ($users_status) {
    console.log( quiz_users);
   
    // map((user) => {
    //   BuildQuizUsers(quiz, user);
    // });
  }

  // $: if ($msg_oper)
  //   if($msg_oper['quiz_users']) {
  //   // console.log($msg_oper['quiz_users']);
  //   BuildQuizUsers($msg_oper.quiz_users);
  // }else if ($msg_oper['lesson'] && $msg_oper['lesson']?.level && $msg_oper['lesson']?.name && $msg_oper['lesson'].dialog_data?.name){
  //   onClickQuiz($msg_oper['lesson']?.quiz,  $msg_oper['lesson']?.level, $msg_oper['lesson']?.name, $msg_oper['lesson'].dialog_data?.name);
  // }

  (async () => {
    const lessonData = await fetchLesson(operator.abonent, operator.operator);
    lesson_data = lessonData.data;
    module = lesson_data.module;

    $llang = lesson_data.lang;

    translate.from = lesson_data.lang;
  })();

  export async function fetchLesson(owner, operator) {
    try {
      const response = await fetch(
        `./lesson?lesson=${operator}&owner=${owner}`
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

  onMount(async () => {});

  onDestroy(() => {
    data = '';
    lesson_data = '';
    module = '';
    quiz_users = '';
  });

  function onClickQuiz(type, level, theme, name) {
    try {
      data.theme = theme;
      data.name = name;
      data.llang = $llang;
      data.level = level;
      data.quiz = type;

      // if (ev.currentTarget.attributes['highlight'])
      //   data.highlight = ev.currentTarget.attributes['highlight'].value;
    } catch (ex) {
      console.log(ex);
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
    const type = node.currentTarget.attributes['type'].value;
    let par = {};
    par.proj = 'kolmit';
    par.func = 'quiz_users';
    par.abonent = operator.abonent;
    par.quiz = name;
    if (checked[name] === false) {
      checked[node.currentTarget.attributes['name'].value];
      let obj = find(usersPic, {
        operator: operator.operator,
      });

      if (obj)
        quiz_users[name].push({
          src: obj.src,
          operator: operator.operator,
          name: obj.name,
          type: type
        });

      par.add = operator.operator;
    } else {
      let el = find(quiz_users[name], { operator: operator.operator });
      try {
        // el = '';
        const ind = quiz_users[name].indexOf(el);

        quiz_users[name].splice(ind, 1);
        console.log(quiz_users[name]);
      } catch (ex) {
        console.log(ex);
      }
      par.rem = operator.operator;
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

  function BuildQuizUsers(quiz, user, type) {
    // Object.keys(qu).map((quiz) => {
    //   quiz_users[quiz] = [
    //     {
    //       name: 'Tutor',
    //       src: tutor_src,
    //     },
    //   ];

    if (user === operator.operator) {
      checked[quiz] = true;
      return;
    }

    let obj = find(usersPic, { operator: user });
    obj.type = type;


   quiz_users[quiz].push(obj);

    quiz_users = quiz_users;
  }

  function GetSubscribers(node) {
 
    let par = {};
    par.proj = 'kolmit';
    par.func = 'get_subscribers';
    par.abonent = operator.abonent;
    par.quiz = node.attributes['name'].value;
    par.level = lesson_data.level;
    par.type = node.attributes['type'].value;

    fetch('/lesson', {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify({ par }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.resp) {
          checked[par.quiz] = false;
          quiz_users[par.quiz] = [];
          data.resp.map((user) => {
            BuildQuizUsers(par.quiz, user, node.attributes['type'].value);
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
    // if (!checked[node.attributes['name'].value])
    //   checked[node.attributes['name'].value] = false;
    // if (!quiz_users[node.attributes['name'].value])
    //   quiz_users[node.attributes['name'].value] = [];
  }

  function OnClickUserCard(user,theme, module, quiz) {
    console.log(user, quiz.name[$llang])
  }



  async function OnThemeNameInput(theme) {
    theme.name = await Translate(theme.name[$llang], $llang, $langs);
    module = module;
  }
</script>

<main>
  {#if data.quiz}
    <Quiz {data} />
  {:else if module}
    <div class="lesson-container">
      <div class="module_level">
        <div class="mdc-typography--caption">{lesson_data.level}</div>
      </div>

      {#each module.themes as theme, t}
        <br />
        <div class="accordion-container">
          <Accordion multiple>
            <Panel class="panel" disabled={disabled[parseInt(t)]}>
              {#await Translate(theme.name[$llang], $llang, $langs) then data}
                <Header
                  :use={theme.name[$llang]
                    ? theme.name[$llang]
                    : (() => {
                        OnThemeNameInput(theme);
                      })()}
                  ><div class="mdc-typography--subtitle2">
                    {theme.name[$llang]}<br /><small>({data})</small>
                  </div></Header
                >{/await}
              <Content>
                {#if theme.lessons}
                  <!-- {@debug theme} -->
                  {#each theme.lessons as lesson}
                    <!-- <div>{lesson.num}.{lesson.title}</div> -->
                    {#if lesson.quizes}
                      {#each lesson.quizes as quiz}
                        <!-- {@debug quiz} -->
                        {#if quiz.name[$llang]}
                          <div
                            class="quiz-container mdc-typography--caption"
                            type= {quiz.type}
                            use:GetSubscribers
                            name={quiz.name[$llang]}
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
                            {/if}
                            <!-- svelte-ignore a11y-invalid-attribute -->

                            <a
                              href="#"
                              use:disablePanel
                              on:click={() => {
                                onClickQuiz(
                                  quiz.type,
                                  lesson_data.level,
                                  theme.name[$llang],
                                  quiz.name[$llang]
                                );
                              }}
                              style="width:100%"
                              {t}
                              type={quiz.type}
                              name={quiz.name[$llang]}
                              level={module.level}
                              theme={theme.name[$llang]}
                              title={quiz.title}
                              highlight={quiz.highlight || ''}
                              >{quiz.name[$llang]}
                            </a><span />
                            {#if quiz.type === 'dialog'}
                              <div class="form-field-container">
                                <FormField>
                                  <Checkbox
                                    on:click={OnCheck}
                                    name={quiz.name[$llang]}
                                    type = {quiz.type}
                                    bind:checked={checked[quiz.name[$llang]]}
                                    touch
                                  ></Checkbox>
                                </FormField>
                              </div>
                            {/if}
                          </div>

                          {#if quiz_users[quiz.name[$llang]] && quiz_users[quiz.name[$llang]].length > 0}
                          
                            <div class="user-cards">
                              {#each quiz_users[quiz.name[$llang]] as qu, q}
                          
                                {#if 
                                  quiz.type === qu.type && 
                                  qu.operator !== operator.operator && 
                                  $users_status[qu.operator] !== 'inactive'
                                }
                                  <div
                                    on:click={()=>{OnClickUserCard(qu.operator,theme, module, quiz)}}
                                    operator={qu.operator}
                                    {t}                                
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
                                          {qu.operator.slice(0, 8)}
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
</main>

<style>
  main {
    position: fixed;
    top: 20px;
    left: 0;
    height: 100vh;
    overflow-y: auto;
    width: 100vw;
    margin: 0 auto;
    background-color: #fff;
    /*transition: transform 0.3s ease-in-out;

    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s; */

    /* margin-top: 40px; */
  }
  .module_level {
    position: fixed;
    color: white;
    background-color: rgba(225, 55, 55, 0.8);
    top: 60px;
    left: 10px;
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
    /*width: 100%;  /*Занимать всю доступную ширину */
    z-index: 2;
  }
</style>
