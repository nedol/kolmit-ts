<script lang="ts">
  import { onMount, onDestroy, setContext, getContext } from 'svelte';

  import moment from 'moment';
  moment.locale('nl-be');

  import { Translate } from '../translate/Transloc.js';

  import pkg from 'lodash';
  const { find, findIndex, remove } = pkg;
  import IconButton, { Icon } from '@smui/icon-button';
  import Badge from '@smui-extra/badge';
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
    signal,
    users,
    langs,
    llang,
    msg,
    dc,
    call_but_status,
    showBottomAppBar,
    OnCheckQU,
  } from '$lib/js/stores.js';

  // import lesson_data from './lesson.json';
  let lesson_data: any;

  export let group;
  const operator = getContext('operator');

  function findPic(operator: any) {
    const oper = find(group, { operator: operator });
    return oper.picture || '/assets/operator.svg';
  }

  let usersPic = group.map((item: any) => ({
    operator: item.operator,
    src: findPic(item.operator),
    name: item.name,
    status: item.status,
  }));

  import tutor_src from '$lib/images/tutor.png';
  import { view } from '$lib/js/stores.js';

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

  export let data;

  $: if ($lesson.data) {
    if ($lesson.data.quiz == '' && data.quiz) {
      SendDataDC({ msg: 'Собеседник вышел из упражнения' });
      data = $lesson.data;
    }
    data = $lesson.data;
  }

  let module, main;

  let panel_disabled = true;

  let checked = { dialog: {}, word: {} };
  let quiz_users = { dialog: {}, word: {} };

  $: if (Array.isArray($msg)) {
    try {
      $msg.map((el) => {
        if (el.add) {
          BuildQuizUsers(el.quiz, el.add, el.type);

          $msg = '';
        } else if (el.rem) {
          RemoveQuizUser(el.rem, el.type, el.quiz);
        }
      });
    } catch (ex) {}
  }

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

  onMount(async () => {
    const lessonData = await fetchLesson(operator.abonent, operator.operator);
    lesson_data = lessonData.data;
    module = lesson_data.module;
    $llang = lesson_data.lang;

    $showBottomAppBar = true;
  });

  function onClickQuiz(type, level, theme, name) {
    try {
      data.theme = theme;
      data.name = name;
      data.llang = $llang;
      data.level = level;
      data.quiz = type;

      // main.scrollIntoView();
      main.scrollTo(0,-200)

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

  $OnCheckQU = function (node, type_, name_) {
    // console.log(node.currentTarget.attributes['name'].value);
    const name = name_ || node.currentTarget.attributes['name'].value;
    const type = type_ || node.currentTarget.attributes['type'].value;
    let par = {};
    par.proj = 'kolmit';
    par.func = 'quiz_users';
    par.abonent = operator.abonent;
    par.quiz = name;
    par.type = type;
    if (checked[type][name] === false || checked[type][name] === null) {
      par.add = operator.operator;
    } else {
      par.rem = operator.operator;
    }

    $signal.SendMessage(par, (data) => {
      console.log(data.resp);
    });
  };

  let RemoveQuizUser = function (user, type, quiz) {
    try {
      let obj = find(quiz_users[type][quiz], { operator: user });
      obj.type = $msg.type;
      remove(quiz_users[type][quiz], obj);
      quiz_users = quiz_users;
      $msg.rem = '';
    } catch (ex) {}
  };

  function BuildQuizUsers(quiz, user, type) {
    let obj = find(usersPic, { operator: user });
    if (obj) obj.type = type;

    if (obj && !find(quiz_users[type][quiz], obj)) {
      quiz_users[type][quiz].push(obj);
      quiz_users[type][quiz] = quiz_users[type][quiz];
      quiz_users = quiz_users;
    }
  }

  function GetSubscribers(node, msg) {
    let par = {};
    par.proj = 'kolmit';
    par.func = 'get_subscribers';
    par.abonent = operator.abonent || msg.abonent;
    par.quiz = node?.attributes['name'].value || msg.quiz;
    par.level = lesson_data.level;
    par.type = node?.attributes['type'].value || msg.type;

    if (!checked[par.type]) return;

    checked[par.type][par.quiz] = false;

    if (!quiz_users[par.type][par.quiz]) quiz_users[par.type][par.quiz] = [];

    $signal.SendMessage(par, (data) => {
      if (data && data.resp) {
        const key = Object.keys(data.resp)[0];
        data.resp[key].subscribers.map((user) => {
          const quiz = data.resp.word?.quiz || data.resp.dialog?.quiz;
          const key = Object.keys(data.resp)[0];
          BuildQuizUsers(quiz, user, key);
          if (user === operator.operator) {
            checked[key][data.resp[key].quiz] = true;
            return;
          }
        });
        if (data.resp[key].operators) console.log(data.resp[key].operators);
      }
    });
  }

  async function OnClickUserCard(user, theme, module, quiz) {
    await new Promise((resolve) => {
      $users[user]['OnClickCallButton'](resolve);
    }) 
    .catch(error => console.error("Ошибка:", error));

    onClickQuiz(
      quiz.type,
      lesson_data.level,
      theme.name[$llang],
      quiz.name[$llang]
    );
  }

  function SendDataDC(data, cb) {
    if ($dc?.dc.readyState === 'open') {
      //  words.content[cur_qa].user2['a_shfl'] = a_shfl;
      $dc.SendData(data, (res) => {
        if (cb) cb(res);
      });
    }
  }

  onDestroy(() => {
    data = '';
    lesson_data = '';
    module = '';
    quiz_users = '';
  });

  async function OnThemeNameInput(theme) {
    theme.name = await Translate(theme.name[$llang], $llang, $langs);
    module = module;
  }
</script>

<main bind:this={main}>
  {#if data.quiz}
    <!-- {@debug data} -->
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

                        {#if quiz.name[$llang] && quiz.published}
                          <div
                            class="quiz-container mdc-typography--caption"
                            type={quiz.type}
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

                            {#if quiz.type === 'dialog' || quiz.type === 'word'}
                              <span
                                style="position: absolute; right:90vw;color:red; top:-2px;"
                              >
                                {Date.now() -
                                  new Date(quiz.published).getTime() <
                                10 * 24 * 60 * 60 * 1000
                                  ? 'new'
                                  : ''}
                              </span>

                              <div class="form-field-container">
                                <FormField>
                                  <Checkbox
                                    on:click={$OnCheckQU}
                                    name={quiz.name[$llang]}
                                    type={quiz.type}
                                    bind:checked={checked[quiz.type][
                                      quiz.name[$llang]
                                    ]}
                                    touch
                                  ></Checkbox>
                                </FormField>
                              </div>
                            {/if}
                          </div>

                          {#if $call_but_status !== 'inactive' && quiz_users[quiz.type] && quiz_users[quiz.type][quiz.name[$llang]]}
                            <div class="user-cards">
                              {#each quiz_users[quiz.type][quiz.name[$llang]] as qu, q}
                                {#if qu.operator !== operator.operator && find( group, { operator: qu.operator } )}
                                  <div
                                    on:click={() => {
                                      OnClickUserCard(
                                        qu.operator,
                                        theme,
                                        module,
                                        quiz
                                      );
                                    }}
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
    position: relative;
    justify-content: start;
    align-items: center;
    padding: 0px; /* Установите желаемый отступ вокруг элемента */
  }

  .form-field-container {
    display: flex;
    justify-content: flex-end;
    align-items: right;
    /*width: 100%;  /*Занимать всю доступную ширину */
    z-index: 2;
  }
</style>
