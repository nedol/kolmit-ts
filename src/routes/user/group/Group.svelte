<script lang="ts">
  // import RTCOperator from '../js/RTCOperator.js';
  // import { getContext } from 'svelte';
  import { setContext,getContext, onMount } from 'svelte';

  import { Translate } from '../../translate/Transloc.js';

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
  const { mapValues, find } = pkg;

  export let rtc, oper_display;

  import {
    signal,
    users,
    langs,
    dc,
    msg,
    call_but_status,
  } from '$lib/js/stores.js';

  import User from '../User.svelte';

  let operator = getContext('operator');

  let cnt;

  let lang = $langs;

  export let group = [];

  let no_users_display = 'block';

  const headers = {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`
  };

  $: if ($msg) {
    onMessage($msg);
  }

  $: if ($call_but_status === 'active') {
    GetOperators({
      type: 'user',
      func: 'operators',
      abonent: operator.abonent,
      operator: operator.operator,
    });
  } else if ($call_but_status === 'inactive') {
    group = group = [];
  }

  async function GetOperators(par: any) {
    $signal.SendMessage(par, (data) => {
      onMessage({ operators: data.resp });
    });
  }

  function OnClickUser() {}

  onMount(async () => {
    // SendCheck({ func: 'check', type: 'user', abonent: operator.abonent, em: operator.em });
  });

  function OnClickUpload() {}

  $: if (group.length > 0) {
    mapValues($users, function (o) {
      // if (o.status !== 'inactive' && o.status !== 'busy')  no_users_display = 'none';
    });

    no_users_display = 'none';

  }else{
    console.log()
    no_users_display = 'block';
  }
  

  function onMessage(data) {
    console.log();
    if (data.operators) {
      Object.keys(data.operators).map((el) => {
        if (
          data.operators[el].status === 'offer' &&
          !find(group, { operator: el })
        ) {
          group.push(data.operators[el]);
        } else {
          const ind = group.indexOf(data.operators[el]);
          if (ind !== -1) group.splice(ind, 1);
        }
      });
      group = group;
    }

    if (data.status === 'offer' && $call_but_status === 'active') {
      // if(data.operator===uid){
      //   return;
      // }

      const el = {
        display: 'block',
        abonent: data.abonent,
        operator: data.operator,
        name: data.name,
        uid: data.uid,
        picture: data.picture,
      };
      if (!find(group, { operator: data.operator })) {
        group?.push(el);
        group = group;
      }
      $msg = '';
    } else if (data.status === 'close') {
      console.log();
      let el = find(group, { uid: data.operator });
      const ind = group.indexOf(el);
      group.splice(ind, 1);
      group = group;
      $msg = '';
    }
  }
</script>

<!-- {@debug operator} -->
<div class="deps_div">
  {#await Translate('Нет пользователей онлайн', 'ru', $langs) then data}
    <span
      style="display:{no_users_display};position: relative;top:0px;text-align: center; font-size: smaller;
      font-family: monospace;">{data}</span
    >
  {/await}
  <div class="flexy-dad">
    {#each group as user, i}
      {#if user && user.operator !== operator.operator}
        <br />
        <div
          class="mdc-elevation--z{i + 1} flexy-boy"
          style="display:block"
          on:click={(ev) => {
            OnClickUser({ user });
          }}
        >
          <Item style="text-align: center">
            <User bind:user_={user} bind:group {OnClickUpload} {rtc}/>
            <Supporting>
              <Label>{user.name}</Label>
            </Supporting>
          </Item>
        </div>
      {/if}
    {/each}
  </div>
  {#if false || window.location.hostname==='localhost'}
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
  {/if}
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
