<script lang="ts">
  // import RTCOperator from '../js/RTCOperator.js';
  // import { getContext } from 'svelte';
  import { getContext, onMount } from 'svelte';

  import Tutor from '../../tutor/Tutor.svelte';

  import '$lib/css/Elevation.scss';

  import ImageList, {
    Item,
    ImageAspectContainer,
    Image,
    Supporting,
  } from '@smui/image-list';

  import Button, { Label } from '@smui/button';

  import pkg from 'lodash';
  const { forEach, findIndex } = pkg;

  import { msg_oper, msg_user } from '$lib/js/stores.js';

  import User from '../../user/User.svelte';

  let operator = getContext('operator');

  let cnt;

  import { langs } from '$lib/js/stores.js';
  let lang = $langs;

  let group = getContext('group');

  let no_users_display = 'block';

  let users_online = 0;

  const headers = {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`
  };

  async function OperatorWaiting(par: any) {
    fetch(`./user`, {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify({ par }),
      headers: { headers },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('cc from oper:', data);
        if (Array.isArray(data.resp)) {
          data.resp.map((resp) => {
            $msg_user = resp;
          });
        }

        OperatorWaiting(par);
      })
      .catch((error) => {
        console.log(error);
        OperatorWaiting(par);
        return [];
      });
  }

  onMount(async () => {
    OperatorWaiting({
      type: 'user',
      abonent: operator.abonent,
      operator: operator.operator,
    });
    // SendCheck({ func: 'check', type: 'user', abonent: operator.abonent, em: operator.em });
  });

  let edited_display = false;

  function OnClickUser(user: any) {
    // console.log(user);
  }

  function OnClickUpload() {}

  function checkUsersOnline(el) {
    const onDisplayChange = (mutationsList:MutationRecord) => {
      for (const mutation of mutationsList) {
        if (mutation.attributeName === 'style') {
          const displayValue = el.style.display;
          if(displayValue=='block'){
            users_online++;
          } else{
             users_online--
           
          }

          if(users_online>0)
           no_users_display = 'none'
          else
           no_users_display = 'block'
        }
      }
    };
    const observer = new MutationObserver(onDisplayChange);
    observer.observe(el, { attributes: true });
  }
</script>

<!-- {@debug operator} -->
<div class="deps_div">
  <span style="display:{no_users_display}">There are no users online</span>
  <div class="flexy-dad">
    {#each group as user, i}
      {#if user}
        <br />
        <div
          class="mdc-elevation--z{i + 1} flexy-boy"
          style="display:{user.display}"
          on:click={(ev) => {
            OnClickUser({ user });
          }}
          use:checkUsersOnline
        >
          <Item style="text-align: center">
            <User {group} bind:user_={user} {OnClickUpload} />
            <Supporting>
              <Label>{user.name}</Label>
            </Supporting>
          </Item>
        </div>
      {/if}
    {/each}
  </div>
  <div class="flexy-dad tutor">
    <div class="mdc-elevation--z{1} flexy-boy">
      <Item style="text-align: center">
        <Tutor name="AI Tutor"></Tutor>

        <Supporting>
          <Label>AI Tutor</Label>
        </Supporting>
      </Item>
    </div>
  </div>
  <!-- <div class="empty" style="height:100px" /> -->
</div>
<div style="height:100px"></div>

<style>
  .deps_div {
    /* height: 90vh; */
    overflow-y: scroll;
    margin-left: 0px;
    margin-top: 40px;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  .flexy-dad {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 35px;
    justify-content: flex-start;
  }

  .tutor {
    position: absolute;
    bottom: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
  }

  .flexy-boy {
    display: flex;
    justify-content: center;
    width: 90px;
    height: 100px;
    margin: 0 0px 0px 0;
    scale: 0.8;
  }
</style>
