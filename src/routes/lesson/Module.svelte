<script lang="ts">
  import { onMount, onDestroy, setContext, getContext } from 'svelte';

  import moment from 'moment';
  moment.locale('nl-be');

  import { Translate } from '../translate/Transloc.js';

  // import Assistant from '../operator/chat/Assistant.svelte';

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
  // import FormField from '@smui/form-field';
  import Textfield from '@smui/textfield';
  import Autocomplete from '@smui-extra/autocomplete';
  import Checkbox from '@smui/checkbox';
  import Quiz from './quiz/Quiz.svelte';

  const bricks_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
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
</svg>`

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
  } from '$lib/stores.ts';

  // import lesson_data from './lesson.json';
  let lesson_data: any;

  export let group;
  let gr_field = '';
  const operator = getContext('operator');

  function findPic(operator: any) {
    const oper = find(group, { operator: operator });
    return oper.picture || '/assets/operator.svg';
  }


  import tutor_src from '$lib/images/tutor.png';
  import { view } from '$lib/stores.ts';

  import { lesson } from '$lib/stores.ts';


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

  let news = [],archive_news= [], news_=[];
  
  const icons = {
    dialogs: mdiAccountMultiple,
    text: mdiTextBoxOutline,
    words: mdiFileWordBoxOutline,
    listen: mdiEarHearing,
  };


  $: if ($lesson.data) {
    if ($lesson.data.quiz === '' && data.quiz) {
      // Define an async function inside the reactive block
      const updateMessage = async () => {
        const msg = await Translate('Собеседник вышел из упражнения', 'ru', $langs, 'module');
        SendDataDC({ msg: msg });
        data = $lesson.data;  // Ensure data is updated with new lesson data
      };

      // Call the async function
      updateMessage();
    } else {
      data = $lesson.data;  // Update data if no condition is met
    }
  }

  let module, main;

  let panel_disabled = true;

  let checked = { dialog: {}, word: {} };
  let quiz_users = { dialog: {}, word: {} };

  $: if (Array.isArray($msg)) {
    try {
      $msg.map((el) => {
        if (el.add && $users[el.add]) {
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
    module = lesson_data. module;
    $llang = lesson_data.lang;
    $showBottomAppBar = true;
    news = lessonData.data.module.themes[0].lessons[0].quizes;
    const oneWeekAgo = Date.now() - 1 * 24 * 60 * 60 * 1000; // Получаем временную метку, соответствующую одной неделе наз    
    const tmp = [];
    news?.forEach((quiz) => {
      const isOlderThanOneWeek = quiz.published < oneWeekAgo;

        if(isOlderThanOneWeek){
          archive_news.push(quiz);
        } else {
          tmp.push(quiz);
        }      
    });
      // Сортировка по убыванию (DESC) по published
    news = tmp.sort((a, b) => b.published - a.published);
    archive_news = archive_news.sort((a, b) => b.published - a.published);

    news = tmp;
  })
  

  function onClickQuiz(type, level, theme, name) {
    try {
      data.theme = theme.name[$llang];
      lesson_data?.module.themes.map((theme)=>{
        theme.new_cnt=0;
      })
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
      console.log(data);
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
    let usersPic = group.map((item: any) => ({
      operator: item.operator,
      src: findPic(item.operator),
      name: item.name,
      status: item.status,
    }));
    let obj = find(usersPic, { operator: user });
    if (obj) obj.type = type;

    if (obj && quiz_users[type][quiz] && !find(quiz_users[type][quiz], obj)) {
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
        data.resp[key].subscribers?.map((user) => {
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
      theme,
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
    theme.name = await Translate(theme.name[$llang], $llang, $langs, 'module');
    module = module;
  }

  function isNew(publishedDate,theme) {

    if(Date.now() - new Date(publishedDate).getTime() < 5 * 24 * 60 * 60 * 1000){
      if(!theme.new_cnt)
        theme.new_cnt = 0;
      theme.new_cnt++;
      return true;
    }
    return false;
  }
</script>

<main bind:this={main}>
  {#if data.quiz}
    <!-- {@debug data} -->
    <Quiz {data} />
  {:else if module}

      {#each module.themes as theme, t}
        <br />
        <div class="accordion-container">
          <Accordion multiple>
            <Panel class="panel" disabled={disabled[parseInt(t)]}>
              {#await Translate(theme.name[$llang], $llang, $langs,'module') then data}
                <Header
                  :use={theme.name[$llang]
                    ? theme.name[$llang]
                    : (() => {
                        OnThemeNameInput(theme);
                      })()}
                  ><div class="mdc-typography--subtitle2">
                    {theme.name[$llang]}
                    {#if theme.new_cnt>0}
                    <span style="color:red">({theme.new_cnt})</span>
                    {/if}<br />

                  </div>
                  </Header
                >{/await} 
              <Content>

                  {#if theme.grammar}  
                   <div>
                      <Autocomplete  label="grammatica" style="pointer-events: none;font-size:small;margin-left:30px"/>                
                      
                        {#each theme.grammar as theme}          
                          <div class="grammar">{theme}</div>
                        {/each}
                      
                    </div>  
                  {/if}

                {#if theme.lessons}
                  {#each theme.lessons as lesson}
                    {#if lesson.quizes}
                    
                      {#if theme.name[$llang].includes('Nieuws')}
                           <Accordion>
                            <Panel  style="margin-left:10px; width: 98%;">
                              <Header>
                                <div class="mdc-typography--subtitle2 arc_panel">
                                {theme.name[$llang]+' Archive'}                                
                                </div>
                              </Header>
                              <Content>
                                {#each archive_news as quiz}                           
                                  {#if $dc?.dc.readyState === 'open' && (quiz.type==='dialogs' || quiz.type==='words') } 
                                      {#if quiz.name && quiz.published}
                                        <div
                                          class="quiz-container mdc-typography--caption"
                                          type={quiz.type}
                                          use:GetSubscribers
                                          name={quiz.name[$llang]}
                                        >
                                        <div class="icon-wrapper">
                                          <div>
                                            {#if isNew(quiz.published, theme)}
                                            {#await Translate('новый', 'ru', $llang,'module') then data}
                                              <span  class="new-badge">{data}</span>
                                              {/await}
                                            {/if}
                                          </div>
                                    
                                        
                                          {#if quiz.type==='bricks'}
                                            <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px"  fill="grey" scale='.5'>
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

              
                                          {:else if icons[quiz.type]}
                                            <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px">
                                              <path fill="grey" d={icons[quiz.type]} />
                                            </Icon>
                                          {/if}
                                        </div>                        
                                          <a
                                            href="#"
                                            use:disablePanel
                                            on:click={() => {
                                              onClickQuiz(
                                                quiz.type,
                                                lesson_data.level,
                                                theme,
                                                quiz.name[$llang]
                                              );
                          
                                            }}
                                            style="width:100%;font-size:medium;"
                                            {t}
                                            type={quiz.type}
                                            name={quiz.name[$llang]}
                                            level={module.level}
                                            theme={theme.name[$llang]}
                                            title={quiz.title}
                                            highlight={quiz.highlight || ''}
                                            >{quiz.name[$llang]}
                                          </a><span />
                                          
                                          {#if $call_but_status!=='inactive' && (quiz.type === 'dialogs' || quiz.type === 'words')}
              
                                            <div class="form-field-container">
                                      
                                                <Checkbox
                                                  on:click={$OnCheckQU}
                                                  name={quiz.name[$llang]}
                                                  type={quiz.type}
                                                  bind:checked={checked[quiz.type][
                                                    quiz.name[$llang]
                                                  ]}
                                                  touch
                                                ></Checkbox>
                                    
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
                                    {:else}
                                      {#if quiz.name && quiz.published}
                                      <div
                                        class="quiz-container mdc-typography--caption"
                                        type={quiz.type}
                                        use:GetSubscribers
                                        name={quiz.name[$llang]}
                                      >
                                      <div class="icon-wrapper">
                                        <div>
                                          {#if isNew(quiz.published, theme)}
                                          {#await Translate('новый', 'ru', $llang,'module') then data}
                                            <span  class="new-badge">{data}</span>
                                            {/await}
                                          {/if}
                                        </div>
                                  
                                      
                                        {#if quiz.type==='bricks'}
                                          <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px"  fill="grey" scale='.5'>
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
            
                                        {:else if icons[quiz.type]}
                                          <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px">
                                            <path fill="grey" d={icons[quiz.type]} />
                                          </Icon>
                                        {/if}
                                      </div>                        
                                        <a
                                          href="#"
                                          use:disablePanel
                                          on:click={() => {
                                            onClickQuiz(
                                              quiz.type,
                                              lesson_data.level,
                                              theme,
                                              quiz.name[$llang]
                                            );
                        
                                          }}
                                          style="width:100%;font-size:medium;"
                                          {t}
                                          type={quiz.type}
                                          name={quiz.name[$llang]}
                                          level={module.level}
                                          theme={theme.name[$llang]}
                                          title={quiz.title}
                                          highlight={quiz.highlight || ''}
                                          >{quiz.name[$llang]}
                                        </a><span />
            
                                        {#if $call_but_status!=='inactive' && (quiz.type === 'dialogs' || quiz.type === 'words')}
            
                                          <div class="form-field-container">
                                    
                                              <Checkbox
                                                on:click={$OnCheckQU}
                                                name={quiz.name[$llang]}
                                                type={quiz.type}
                                                bind:checked={checked[quiz.type][
                                                  quiz.name[$llang]
                                                ]}
                                                touch
                                              ></Checkbox>
                                  
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
                                    {/if}
                                {/each}

                              </Content>
                            </Panel>
                          </Accordion>
                        {#each news as quiz}
                        
                          {#if $dc?.dc.readyState === 'open' && (quiz.type==='dialogs' || quiz.type==='words') } 
                            {#if quiz.name && quiz.published}
                            <div
                              class="quiz-container mdc-typography--caption"
                              type={quiz.type}
                              use:GetSubscribers
                              name={quiz.name[$llang]}
                            >
                            <div class="icon-wrapper">
                              <div>
                                {#if isNew(quiz.published, theme)}
                                {#await Translate('новый', 'ru', $llang,'module') then data}
                                  <span  class="new-badge">{data}</span>
                                  {/await}
                                {/if}
                              </div>
                        
                            
                              {#if quiz.type==='bricks'}
                                <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px"  fill="grey" scale='.5'>
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

                              {:else if icons[quiz.type]}
                                <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px">
                                  <path fill="grey" d={icons[quiz.type]} />
                                </Icon>
                              {/if}
                            </div>                        
                              <a
                                href="#"
                                use:disablePanel
                                on:click={() => {
                                  onClickQuiz(
                                    quiz.type,
                                    lesson_data.level,
                                    theme,
                                    quiz.name[$llang]
                                  );
              
                                }}
                                style="width:100%;font-size:medium;"
                                {t}
                                type={quiz.type}
                                name={quiz.name[$llang]}
                                level={module.level}
                                theme={theme.name[$llang]}
                                title={quiz.title}
                                highlight={quiz.highlight || ''}
                                >{quiz.name[$llang]}
                              </a><span />

                              {#if $call_but_status!=='inactive' && (quiz.type === 'dialogs' || quiz.type === 'words')}

                                <div class="form-field-container">                      
                                    <Checkbox
                                      on:click={$OnCheckQU}
                                      name={quiz.name[$llang]}
                                      type={quiz.type}
                                      bind:checked={checked[quiz.type][
                                        quiz.name[$llang]
                                      ]}
                                      touch
                                    ></Checkbox>                    
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
                          {:else}
                            {#if quiz.name && quiz.published}
                            <div
                              class="quiz-container mdc-typography--caption"
                              type={quiz.type}
                              use:GetSubscribers
                              name={quiz.name[$llang]}
                            >
                          
                            <div class="icon-wrapper">
                              <div>
                                {#if isNew(quiz.published, theme)}
                                {#await Translate('новый', 'ru', $llang,'module') then data}
                                  <span  class="new-badge">{data}</span>
                                  {/await}
                                {/if}
                              </div>
                        
                            
                              {#if quiz.type==='bricks'}
                                <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px"  fill="grey" scale='.5'>
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

                              {:else if icons[quiz.type]}
                                <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px">
                                  <path fill="grey" d={icons[quiz.type]} />
                                </Icon>
                              {/if}
                     
                            </div>                        
                              <a
                                href="#"
                                use:disablePanel
                                on:click={() => {
                                  onClickQuiz(
                                    quiz.type,
                                    lesson_data.level,
                                    theme,
                                    quiz.name[$llang]
                                  );
              
                                }}
                                style="width:100%;font-size:medium;"
                                {t}
                                type={quiz.type}
                                name={quiz.name[$llang]}
                                level={module.level}
                                theme={theme.name[$llang]}
                                title={quiz.title}
                                highlight={quiz.highlight || ''}
                                >{quiz.name[$llang]}
                              </a><span />

                              {#if $call_but_status!=='inactive' && (quiz.type === 'dialogs' || quiz.type === 'words')}

                                <div class="form-field-container">                      
                                    <Checkbox
                                      on:click={$OnCheckQU}
                                      name={quiz.name[$llang]}
                                      type={quiz.type}
                                      bind:checked={checked[quiz.type][
                                        quiz.name[$llang]
                                      ]}
                                      touch
                                    ></Checkbox>                    
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
                          {/if}
              
                        {/each}
                      {/if}

                      {#each lesson.quizes as quiz}  
                                 
                        {#if !theme.name[$llang].includes('Nieuws')}
                          {#if $dc?.dc.readyState === 'open' && (quiz.type==='dialogs' || quiz.type==='words') } 
                            <Panel class="panel">                                            
                                {#if quiz.name[$llang] && quiz.published}
                                  <div
                                    class="quiz-container mdc-typography--caption"
                                    type={quiz.type}
                                    use:GetSubscribers
                                    name={quiz.name[$llang]}
                                  >
                                  <div class="icon-wrapper">
                                    <div>
                                      {#if isNew(quiz.published, theme)}
                                      {#await Translate('новый', 'ru', $llang,'module') then data}
                                        <span  class="new-badge">{data}</span>
                                        {/await}
                                      {/if}
                                    </div>
                              
                                  
                                    {#if quiz.type==='bricks'}
                                      <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px"  fill="grey" scale='.5'>
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

                                    {:else if icons[quiz.type]}
                                      <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px">
                                        <path fill="grey" d={icons[quiz.type]} />
                                      </Icon>
                                    {/if}
                                  </div>                        
                                    <a
                                      href="#"
                                      use:disablePanel
                                      on:click={() => {
                                        onClickQuiz(
                                          quiz.type,
                                          lesson_data.level,
                                          theme,
                                          quiz.name[$llang]
                                        );
                    
                                      }}
                                      style="width:100%;font-size:medium;"
                                      {t}
                                      type={quiz.type}
                                      name={quiz.name[$llang]}
                                      level={module.level}
                                      theme={theme.name[$llang]}
                                      title={quiz.title}
                                      highlight={quiz.highlight || ''}
                                      >{quiz.name[$llang]}
                                    </a><span />

                                    {#if $call_but_status!=='inactive' && (quiz.type === 'dialogs' || quiz.type === 'words')}
        
                                      <div class="form-field-container">
                                
                                          <Checkbox
                                            on:click={$OnCheckQU}
                                            name={quiz.name[$llang]}
                                            type={quiz.type}
                                            bind:checked={checked[quiz.type][
                                              quiz.name[$llang]
                                            ]}
                                            touch
                                          ></Checkbox>
                              
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
                            </Panel>
                          {:else if $dc?.dc.readyState !== 'open' }
                            <Panel class="panel">                                            
                              {#if quiz.name[$llang] && quiz.published}
                                <div
                                  class="quiz-container mdc-typography--caption"
                                  type={quiz.type}
                                  use:GetSubscribers
                                  name={quiz.name[$llang]}
                                >
                                <div class="icon-wrapper">
                                  <div>
                                    {#if isNew(quiz.published, theme)}
                                    {#await Translate('новый', 'ru', $llang,'module') then data}
                                      <span  class="new-badge">{data}</span>
                                      {/await}
                                    {/if}
                                  </div>
                            
                                
                                  {#if quiz.type==='bricks'}
                                    <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px"  fill="grey" scale='.5'>
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

                                  {:else if icons[quiz.type]}
                                    <Icon tag="svg" viewBox="0 0 24 24" width="20px" height="20px">
                                      <path fill="grey" d={icons[quiz.type]} />
                                    </Icon>
                                  {/if}
                                </div>                        
                                  <a
                                    href="#"
                                    use:disablePanel
                                    on:click={() => {
                                      onClickQuiz(
                                        quiz.type,
                                        lesson_data.level,
                                        theme,
                                        quiz.name[$llang]
                                      );
                  
                                    }}
                                    style="width:100%;font-size:medium;"
                                    {t}
                                    type={quiz.type}
                                    name={quiz.name[$llang]}
                                    level={module.level}
                                    theme={theme.name[$llang]}
                                    title={quiz.title}
                                    highlight={quiz.highlight || ''}
                                    >{quiz.name[$llang]}
                                  </a><span />

                                  {#if $call_but_status!=='inactive' && (quiz.type === 'dialogs' || quiz.type === 'words')}
      
                                    <div class="form-field-container">
                              
                                        <Checkbox
                                          on:click={$OnCheckQU}
                                          name={quiz.name[$llang]}
                                          type={quiz.type}
                                          bind:checked={checked[quiz.type][
                                            quiz.name[$llang]
                                          ]}
                                          touch
                                        ></Checkbox>
                            
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
                            </Panel>
                          {/if}
                        {/if}
                        
                      {/each}  
                            
                      <div  style="height:30px"></div>
                    {/if}
                  {/each}
                {/if}
              </Content>
            </Panel>
          </Accordion>
        </div>
      {/each}

    <div style="height:50px"></div>
  {/if}
</main>

<style>
  :root {
    --accent-color: rgba(225, 55, 55, 0.8);
  }

  :global(.mdc-typography--subtitle2){
    font-size: large;
  }
  
  .icon-wrapper {
    position: relative;
    display: inline-block; /* Позволяет корректно позиционировать вложенные элементы */
    width: 20px;
    height: 20px;
    left:-5px;
  }

  .new-badge {
    position: absolute;
    color: red;
    font-size: 10px; /* Подбирайте размер шрифта для лучшей читаемости */
    top: -12px; /* Расположение над иконкой */
    left: -5px; /* Расположение справа */
    background-color: transparent; /* Для контраста, опционально */
    border-radius: 3px; /* Слегка закругляем для стилистики */
    padding: 1px 1px; /* Отступы для лучшего внешнего вида */
    z-index: 1; /* Чтобы текст отображался поверх иконки */
  }
  main {
    position: fixed;
    top: 50px;
    left: 0;
    bottom:0;
    overflow-y: auto;
    width: 100vw;
    margin: 0 auto;
    background-color: #fff;
    font-size: large;
  }
  .module_level {
    position: fixed;
    color: white;
    background-color: var(--accent-color);
    top: 60px;
    left: 20px;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .user-cards {
    display: flex;
    justify-content: flex-start;
    margin-left: 20px;
    border: #80808047  solid 0px;
    border-radius: 5px;
    width: 88vw;
    overflow-x: auto;
  }
  

  .lesson-container {
    /* height: 120vh; */

    overflow-y: auto;
    overflow-x: hidden;
    max-width: 100%;
    padding-top: 10px;
    height: 120vh;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .quiz-container {
    display: flex;
    position: relative;
    justify-content: start;
    align-items: center;
    padding: 5px; /* Установите желаемый отступ вокруг элемента */
    margin-top: 10px;
  }

  .grammar{
    margin-left:30px;
    font-style: italic;
    font-size: small;
    font-weight: 400;
  }


  .form-field-container {
    margin-left: auto;

  }

  .arc_panel{
    position: absolute;
    font-size: small;
    right: 30px;
    bottom: 2px;
  }

  @media screen and (min-width: 768px) {
		/* Ваши стили для более крупных экранов здесь */
    .mdc-typography--subtitle2 {
     font-size: 1.2em;
    }
    a{
      font-size: 1.4em;
    }
	}

</style>
