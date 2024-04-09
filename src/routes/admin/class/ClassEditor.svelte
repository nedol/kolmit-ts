<script lang="ts">
  import { onMount, setContext, getContext } from 'svelte';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import Dep from './Dep.svelte';

  import pkg from 'lodash';
  const { forEach, findIndex, remove } = pkg;

  import './Elevation.scss';

  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';

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

  import { msg_oper, msg_user } from '$lib/js/stores.js';

  import { view } from '$lib/js/stores.js';

  export let data: any;

  console.log(data);

  let classes = data.classes;
  const abonent = data.abonent;

  let card_display = '';

  let clicked = 0;
  let name = '',
    email = '',
    picture = '';

  export let display = 'none';

  $: if ($view === 'class') {
    display = 'block';
  } else {
    display = 'none';
  }

  import { langs } from '$lib/js/stores.js';

  let lang = $langs;
  let user_lang = 'en';

  const headers = {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`
  };

  function OnClickUser(user: any) {
    // console.log(user);
    name = user.user.name;
    email = user.user.email;
    picture = user.user.picture ? user.user.picture : operator_svg;
    user_lang = user.user.lang;
  }

  onMount(async () => {
    // OperatorWaiting({ type: 'user', abonent: data.abonent, em: data.em });
    // SendCheck({ func: 'check', type: 'user', abonent: operator.abonent, em: operator.em });
  });

  let edited_display = false;

  function saveClassData() {}

  async function OnSaveUser(class_name: string) {
    card_display = '';
    const par = {
      func: 'add_user',
      role: 'operator',
      class_name: class_name,
      name: name,
      email: email,
      abonent: abonent,
      lang: user_lang,
    };

    const prom = fetch(`/admin/class`, {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify(par),
      headers: headers,
    });

    let resp = await (await prom).json();

    if (resp.resp.length>0) {
      data.users.push({
        role: 'operator',
        class: class_name,
        email: email,
        name: name,
      });
      data = data;
    }
  }

  function OnDeleteUser(email:string) {
    const par = {
      func: 'del_user',
      name: name,
      email: email,
      abonent: abonent,
    };

    fetch(`/admin/class`, {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify(par),
      headers: headers,
    })
      .then((response) => response.json())
      .then((resp) => {
        card_display = '';
        remove(data.users, (obj:any)=> { 
          return obj.email === email; 
        })

        console.log(resp)
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

  function OnAddClass() {
    classes.push({ name: 'New Class' });
    classes = classes;
  }

  function OnAddUser(ev: any) {
    name = '';
    email = '';
    picture = '';
  }

  function OnClose() {
    $view = 'class';
    card_display = '';
  }
</script>

{#each classes as item}
  <div class="accordion-container">
    <Accordion multiple>
      <Panel class="panel">
        <Header>{item.name}</Header>
        <Content>
          {#if card_display === item.name}
            <div class="card-container" style="display:{display}">
              <!-- {#if name} -->
              <Card>
                <div style="display:inline-flex">
                  <div style="display:block">
                    <Content>
                      <Textfield
                        class="shaped-filled"
                        variant="filled"
                        bind:value={user_lang}
                        label="User Language"
                      ></Textfield>
                    </Content>
                    <Content>
                      <Textfield
                        class="shaped-filled"
                        variant="filled"
                        bind:value={name}
                        label="Name"
                      ></Textfield>
                    </Content>
                    <Content>
                      <Textfield
                        class="shaped-filled"
                        variant="filled"
                        bind:value={email}
                        label="Email"
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
                    height: 60px;
                  "
                      src={picture}
                    />
                  {/if}
                </div>

                <Actions>
                  <Button on:click={() => OnSaveUser(item.name)}>
                    <Label>Save</Label>
                  </Button>
                  <Button on:click={()=>OnDeleteUser(email)}>
                    <Label>Delete</Label>
                  </Button>
                  <Button on:click={() => (card_display = false)}>
                    <Label>Close</Label>
                  </Button>
                </Actions>
              </Card>
            </div>
          {:else}
            <button class="save" on:click={saveClassData}>Сохранить</button>

            <div class="deps_div" style="display:{display}">
              <div class="flexy-dad">
                {#each data.users as user, i}
                  {#if user.class === item.name}
                    <div
                      class="mdc-elevation--z{i + 1} flexy-boy"
                      on:click={(ev) => {
                        (card_display = item.name), OnClickUser({ user });
                      }}
                    >
                      <Item style="text-align: center;">
                        {#if user.picture}
                          <Image
                            src={user.picture}
                            style="width:50px"
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
                          <Label>{user.name}</Label>
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

<div class="add_class">
  <IconButton class="material-icons" on:click={OnAddClass}>add</IconButton>
</div>

<style>
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
    /*width: 90%;*/
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
