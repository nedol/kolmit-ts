<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import Header from './Header.svelte';
  import Operator from './operator/Operator.svelte';
  import Login from './site/Login.svelte';
  import { SignalingChannel } from './signalingChannel.ts';
  import { signal, langs, ice_conf, dicts, view } from '$lib/stores.ts';

  // Define types for the data structure
  interface OperatorData {
    operator: string;
    abonent: string;
    name: string;
    picture: string;
    lang: string;
  }

  interface GroupData {
    group: string[];
  }

  interface Data {
    dict: Array<any>;  // Adjust based on the actual structure of the dict
    operator: Array<OperatorData>;
    group: GroupData[];
    abonent: string;
    ice_conf: object; // Define ice_conf structure if necessary
    cookies?: string;
  }

  export let data: Data; // Type the data prop explicitly

  // Define the types for the local variables
  let operator: OperatorData | undefined;
  let abonent: string | undefined;
  let name: string | undefined;
  let user_pic: string | undefined;

  $dicts = data.dict[0];

  // Initialize necessary values and set context
  function Init() {
    setContext('group_data', data.group);
    setContext('lvl', data.group[0].group);
    setContext('operator', data.operator[0]);
    setContext('abonent', data.abonent);

    operator = data.operator[0]; // Assign operator as an object
    abonent = data.operator[0].abonent;
    name = data.operator[0].name;
    user_pic = data.operator ? data.operator[0].picture : '';

    // Pass the operator's 'operator' string value, not the whole object
    $signal = new SignalingChannel(operator.operator); // This should be a string

    $langs = data.cookies ? JSON.parse(data.cookies).lang : data.operator[0].lang;

    $ice_conf = data.ice_conf;
  }

  // Initialize the data if available
  if (data.operator && data.group.length > 0) {
    Init();
  }

  // Manage view on mount
  onMount(() => {
    if (!operator || data?.group?.length === 0) {
      $view = 'login';
    }
  });
</script>

<Header></Header>

{#if operator && data?.group?.length > 0}
  <Operator {operator} {abonent} {name} />
{:else if $view === 'login'}
  <Login {operator} {abonent} {user_pic} />
{/if}

<style>
  /* Add your styles here */
</style>
