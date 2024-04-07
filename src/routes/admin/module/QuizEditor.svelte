<script>
  import IconButton, { Icon } from '@smui/icon-button';
  import {
    mdiAccountMultiple,
    mdiTextBoxOutline,
    mdiCardTextOutline,
    mdiEarHearing,
    mdiFileWordBoxOutline,
    mdiHelp,
  } from '@mdi/js';

  import _ from 'lodash';

  export let theme, quiz, data, t, module;

  function OnChangeQuizName(ev) {
    const name = ev.currentTarget.attributes['name'].nodeValue;
    const upd = ev.target.innerText;
    let item = findDeep(module, (value) => value.name === name, {
      childrenPath: 'quizes',
    });
    if (item) {
      item.name = upd;
    }
    module = module;
  }

  function onClickQuiz(ev) {
    if (ev.currentTarget.attributes['type'].value !== 'quiz') {
      data.llang = lesson_data.lang;
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

  function OnSelectQuiztype(ev) {
    console.log(ev.target.value);
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
</script>

{#if quiz.name}
  <div class="quiz-container" name={quiz.name}>
    {#if quiz.type === 'dialog'}
      <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px">
        <path fill="grey" d={mdiAccountMultiple} />
      </Icon>
    {:else if quiz.type === 'text'}
      <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px">
        <path fill="grey" d={mdiTextBoxOutline} />
      </Icon>
    {:else if quiz.type === 'word'}
      <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px">
        <path fill="grey" d={mdiFileWordBoxOutline} />
      </Icon>
    {:else if quiz.type === 'listen'}
      <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px">
        <path fill="grey" d={mdiEarHearing} />
      </Icon>
    {:else if quiz.type === 'quiz'}
      <Icon tag="svg" viewBox="0 0 24 24" width="30px" height="30px">
        <path fill="grey" d={mdiHelp} />
      </Icon>
    {/if}
    <!-- svelte-ignore a11y-invalid-attribute -->
    {#if quiz.type === 'quiz'}
      <div
        class="quiz_name"
        autofocus
        contenteditable
        on:blur={OnChangeQuizName}
        on:click={onClickQuiz}
        {t}
        type={quiz.type}
        name={quiz.name}
        level={module.level}
        theme={theme.num}
        theme_name={theme.name}
        title={quiz.title}
        highlight={quiz.highlight || ''}
      >
        {quiz.name}
      </div>
    {:else}
      <a
        href="#"
        on:blur={OnChangeQuizName}
        on:click={onClickQuiz}
        style="width:80%"
        {t}
        type={quiz.type}
        name={quiz.name}
        level={module.level}
        theme={theme.num}
        theme_name={theme.name}
        title={quiz.title}
        highlight={quiz.highlight || ''}
      >
        {quiz.name}
      </a>
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
{/if}

<style>
  .quiz-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px; /* Установите желаемый отступ вокруг элемента */
  }
  .quiz_name {
    width: 80%;
    margin-right: 10px;
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

  .add_theme {
    position: relative;
  }
</style>
