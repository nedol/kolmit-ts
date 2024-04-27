<script lang="ts">
  import { onMount, setContext, getContext } from 'svelte';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

  import pkg from 'lodash';
  const { forEach, findIndex, remove } = pkg;

  import '$lib/css/Elevation.scss';

  import Textfield from '@smui/textfield';

  import operator_svg from '$lib/images/operator.svg';
  import ImageList, {
    Item,
    ImageAspectContainer,
    Image,
    Supporting,
  } from '@smui/image-list';

  import Card, {
    PrimaryAction,
    Actions,
    ActionButtons,
    ActionIcons,
  } from '@smui/card';

  import Button, { Label } from '@smui/button';

  import IconButton, { Icon } from '@smui/icon-button';

  export let data: any;

  let groups = data.groups;
  const abonent = data.abonent;

  let card_display = '';

  let clicked = 0;
  let name = '',
    operator = '',
    email = '',
    picture = '';

  import { llang, langs, dicts } from '$lib/js/stores.js';
  import translate from 'translate';
  translate.engine = 'google';

  let user_lang = 'en';

  const headers = {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`
  };

  function OnClickUser(user: any) {
    // console.log(user);
    name = user.operator.name;
    operator = user.operator.operator;
    email = user.operator.email;
    picture = user.operator.picture ? user.operator.picture : operator_svg;
    user_lang = user.operator.lang;
  }

  onMount(async () => {
    // OperatorWaiting({ type: 'user', abonent: data.abonent, operator: data.operator });
    // SendCheck({ func: 'check', type: 'user', abonent: operator.abonent, operator: operator.operator });
  });

  let edited_display = false;
  let display = 'none';

  function saveClassData() {}

  async function OnSaveUser(class_name: string) {
    card_display = '';
    const par = {
      func: 'add_user',
      role: 'operator',
      class_name: class_name,
      name: name,
      email:email,
      operator: operator,
      abonent: abonent,
      lang: user_lang,
    };

    const prom = fetch(`/admin/group`, {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify(par),
      headers: headers,
    });

    let resp = await (await prom).json();

    if (resp.resp.length > 0) {
      data.operators.push({
        role: 'operator',
        class: class_name,
        operator: operator,
        name: name,
      });
      data = data;
    }
  }

  function OnDeleteUser(operator: string) {
    const par = {
      func: 'del_user',
      name: name,
      operator: operator,
      abonent: abonent,
    };

    fetch(`/admin/group`, {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify(par),
      headers: headers,
    })
      .then((response) => response.json())
      .then((resp) => {
        card_display = '';
        remove(data.operators, (obj: any) => {
          return obj.operator === operator;
        });

        console.log(resp);
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

  function OnAddClass() {
    groups.push({ name: 'New Class' });
    groups = groups;
  }

  function OnAddUser(ev: any) {
    name = '';
    operator = '';
    picture = '';
    email = '';
    user_lang = '';
  }

  function OnClose() {
    card_display = '';
  }

  async function Translate(text: string) {
    try {
      translate.from = $llang;

      return (
        ($dicts[text] && $dicts[text][$langs]) ||
        (await translate(text.trim(), $langs))
      );
    } catch (error) {
      console.error('Translation error:', error);
      return text; // или другое подходящее значение по умолчанию
    }
  }
</script>

<div style="margin-top:50px">
  {#each groups as item}
    <div class="accordion-container">
      <Accordion multiple>
        <Panel class="panel">
          <Header><b>{item.name}</b></Header>
          <Content>
            {#if card_display === item.name}
              <div class="card-container">
                <!-- {#if name} -->
                <Card style="width:100%">
                  <div style="display:inline-flex">
                    <div style="display:block;">
                      <Content>
                        {#await Translate('Language', $langs) then data}
                          <Textfield
                            class="shaped-filled"
                            variant="filled"
                            bind:value={user_lang}
                            label={data}
                          ></Textfield>
                        {/await}
                      </Content>
                      <Content>
                        {#await Translate('Name', $langs) then data}
                          <Textfield
                            class="shaped-filled"
                            variant="filled"
                            bind:value={name}
                            label={data}
                          ></Textfield>
                        {/await}
                      </Content>
                      <Content>
                        <Textfield
                          class="shaped-filled"
                          variant="filled"
                          bind:value={email}
                          label="E-mail"
                        ></Textfield>
                      </Content>
                    </div>
                    {#if picture}
                      <Image
                        style="
                    display: block;
                    flex:1;
                    margin-left: auto;
                    margin-right: auto;
                    max-height: 100px;
                    max-width:max-content
                  "
                        src={picture}
                      />
                    {/if}
                  </div>

                  <Actions>
                    <Button on:click={() => OnSaveUser(item.name)}>
                      <Label>{data.dict[0]['Save and Close'][$langs]}</Label>
                    </Button>
                    <Button on:click={() => OnDeleteUser(operator)}>
                      <Label>{data.dict[0]['Remove'][$langs]}</Label>
                    </Button>
                    <Button on:click={() => (card_display = 'false')}>
                      <Label>{data.dict[0]['Close'][$langs]}</Label>
                    </Button>
                  </Actions>
                </Card>
              </div>
            {:else}
              <button class="save" on:click={saveClassData}>
                {#await Translate('Save', $langs) then data}
                  {data}
                {/await}
              </button>

              <div class="deps_div">
                <div class="flexy-dad">
                  <!-- {@debug data} -->
                  {#each data.operators as operator, i}
                    {#if operator.group === item.name}
                      <div
                        class="mdc-elevation--z{i + 1} flexy-boy"
                        on:click={(ev) => {
                          (card_display = item.name), OnClickUser({ operator });
                        }}
                      >
                        <Item style="text-align: center;">
                          {#if operator.picture}
                            <!-- {@debug operator} -->
                            <Image
                              src={operator.picture}
                              style="max-height:50px; max-width:max-content"
                              alt="Image {i + 1}"
                            />
                          {:else}
                            <Image
                              src={operator_svg}
                              style="width:50px"
                              alt="Image {i + 1}"
                            />
                          {/if}
                          <Supporting>
                            <Label>{operator.name}</Label>
                          </Supporting>
                        </Item>
                      </div>
                    {/if}
                  {/each}
                </div>

                <div class="add_user">
                  <IconButton
                    class="material-icons"
                    on:click={(ev) => {
                      card_display = item.name;
                      OnAddUser(ev);
                    }}>add</IconButton
                  >
                </div>
                <!-- <div class="empty" style="height:100px" /> -->
              </div>
            {/if}
          </Content>
        </Panel>
      </Accordion>
    </div>
  {/each}
</div>

<div class="add_class">
  <IconButton class="material-icons" on:click={OnAddClass}>add</IconButton>
</div>

<style>
  .accordion-container {
  }
  .flexy-dad {
    display: flex;
    flex-wrap: wrap;
  }

  .flexy-boy {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    margin: 0 30px 30px 0;
  }
  .card-container {
    display: inline-flex;
    align-items: center;

    min-height: 200px;
    width: 70%;
    /* max-width: 100%; */
    overflow-x: auto;
    background-color: var(--mdc-theme-background, #f8f8f8);
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    padding: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .save {
    width: 100px;
  }
  .deps_div {
    overflow-y: scroll;
    margin-left: 10px;
    margin-top: 20px;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .add_user {
    position: relative;
  }
</style>
