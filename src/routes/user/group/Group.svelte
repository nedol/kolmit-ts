<script lang="ts">
  // import RTCOperator from '../js/RTCOperator.js';
  // import { getContext } from 'svelte';
  import { getContext, onMount } from 'svelte';

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

  import { users, langs, msg_oper, msg_user,  call_but_status } from '$lib/js/stores.js';

  import User from '../User.svelte';

  let operator = getContext('operator');

  let cnt;

  let lang = $langs;

  let group = getContext('group');

  let no_users_display = 'block';

  let users_online = 0;

  const headers = {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`
  };

  $: if ($msg_user) {
    onMessage($msg_user);
  }

  let isOperatorWaiting = false

  async function OperatorWaiting(par: any) {
    if(isOperatorWaiting)
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
            onMessage(resp)
          });
        }
        if(isOperatorWaiting){
          par.func = 'operatorwaiting';
          OperatorWaiting(par);
        }
      })
      .catch((error) => {
        console.log(error);
        OperatorWaiting(par);
        return [];
      });
  }

  function OnClickUser(){

  }

  $: if(  $call_but_status==='active'){
    isOperatorWaiting = true
    OperatorWaiting({
      type: 'user',
      func:'operators',
      abonent: operator.abonent,
      operator: operator.operator,
    });
  }else{
    isOperatorWaiting = false
  }

  onMount(async () => {

    // SendCheck({ func: 'check', type: 'user', abonent: operator.abonent, em: operator.em });
  });

  function OnClickUpload() {}

  $: if (Object.keys($users).length > 0) {
    mapValues($users, function (o) {
      if (o.status !== 'inactive' && o.status !== 'busy') users_online++;
    });

    if (users_online > 0) no_users_display = 'none';
    else no_users_display = 'block';

    users_online = 0;
  }

  function onMessage(data){

    if(data.operators){
     Object.keys(data.operators).map((el)=>{
      if(data.operators[el].status==='offer' && !find(group, {operator:el})){
        group.push(data.operators[el])
     }else{
        const ind = group.indexOf(data.operators[el]);
        group.splice(ind, 1);
      }
      })
      group = group
      
    }

    if(data.status ==='offer'){

      // if(data.operator===uid){
      //   return;
      // }

      const el = {
        display:'block',
        abonent:data.abonent,
        operator:data.operator,
        name:data.name,
        uid:data.uid,
        picture:data.picture
      };
      if(!find(group, {operator:data.operator})){
        group?.push(el);
        group=group;
      }
      $msg_user = ''
    }else if(data.status ==='close'){
      let el = find(group,{'uid':data.operator})
      const ind = group.indexOf(el)
      group.splice(ind,1);
      group=group;
      $msg_user = ''
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
      {#if user && user.operator!==operator.operator}
        <br />
        <div
          class="mdc-elevation--z{i + 1} flexy-boy"
          style="display:block"
          on:click={(ev) => {
            OnClickUser({ user });
          }}
        >
          <Item style="text-align: center">
            <User bind:user_={user} {OnClickUpload} />
            <Supporting>
              <Label>{user.name}</Label>
            </Supporting>
          </Item>
        </div>
      {/if}
    {/each}
  </div>
  {#if false}
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
