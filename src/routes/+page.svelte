<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import Header from './Header.svelte';
  import { wss } from '$lib/js/stores.js';
  import Operator from './operator/Operator.svelte';
  import Login from './site/Login.svelte';
  import { SignalingChannel } from './signalingChannel.js';
  import { signal, langs, ice_conf, dicts, view } from '$lib/js/stores.js';

  export let data;
  let operator, abonent, name, user_pic;

  $dicts = data.dict[0];

  function Init() {
    setContext('group_data', data.group);
    setContext('lvl', data.group[0].group);
    setContext('operator', data.operator[0]);
    setContext('abonent', data.abonent);

    (operator = data.operator[0].operator),
      (abonent = data.operator[0].abonent),
      (name = data.operator[0].name),
      (user_pic = data.operator ? data.operator[0].picture : '');

    $signal = new SignalingChannel(operator);

    $langs = data.cookies? JSON.parse(data.cookies).lang: data.operator[0].lang;//

    $ice_conf = data.ice_conf;

  }

  if (data.operator) {
    Init();
  }

  onMount(async () => {
     (!operator || data?.group?.length===0)?$view='login':''; 
  });
</script>

<Header></Header>


{#if operator && data?.group?.length>0}
  <Operator {operator} {abonent} {name} />
{:else if $view==='login'}
  <Login {operator} {abonent} {user_pic} />
{/if}


<style>
  

</style>
