<script lang="ts">
  import QuizEditor from './QuizEditor.svelte';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import IconButton, { Icon } from '@smui/icon-button';

  import _ from 'lodash';

  export let theme:{}, data:{}, t:number, module:{};

  function deleteObjectByName(obj:any, name:string) {
    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key])) {
        // Удаление объектов с заданным id
        obj[key] = obj[key].filter(
          (item:any) => !(item.name && item.name === name)
        );
        // Продолжаем поиск внутри каждого элемента массива
        obj[key].forEach((item:any) => deleteObjectByName(item, name));

        // Преобразование после удаления
        if (obj[key].length === 0) {
          delete obj[key]; // Удаляем пустой массив
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

 
  function OnRemoveItem(ev) {
    deleteObjectByName(module, ev.currentTarget.attributes['name'].nodeValue);
    module = module;
  }

  function findDeep(obj, predicate, path = '') {
    if (predicate(obj, path)) {
      return obj;
    }

    if (_.isObject(obj)) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let found:any = findDeep(obj[key], predicate, `${path}.${key}`);
          if (found) {
            return found;
          }
        }
      }
    }
    return null;
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

  function OnChangeThemeName(ev) {
    const name = ev.currentTarget.attributes['name'].nodeValue;
    const upd = ev.target.innerText;
    let item = findDeep(module, (value) => value.name === name, {
      childrenPath: 'themes',
    });
    if (item) {
      item.name = upd;
    }
    module = module;
  }
</script>

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
                <QuizEditor
                  {theme}
                  {data}
                  {quiz}
                  {t}
                  {module}
                  {OnRemoveItem}
                  {findDeep}
                ></QuizEditor>
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

<style>
  .rem_theme {
    position: absolute;
    right: 0;
    top: 5px;
  }

  .add_quiz,
  .rem_theme {
    display: inline-flex;
    background-color: aliceblue;
    border-radius: 25px;
    width: 25px;
    height: 25px;
    scale: 1.2;
  }

  div > .rem_theme {
    display: flex;
    align-items: center;
  }
</style>
