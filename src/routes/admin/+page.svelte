<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import Header from './Header.svelte';
  import Login from './login/Login.svelte';
  import { langs, nlang } from '$lib/js/stores.js';
  import { view } from '$lib/js/stores.js';

  // import { Dict } from '../dict/dict';
  // $view = 'lesson';

  import GroupEditor from './group/GroupEditor.svelte';

  import { dicts } from '$lib/js/stores.js';
  import ModuleEditor from './module/ModuleEditor.svelte';

  export let data;

  $: if (data.dict[0]) {
    $dicts = data.dict[0];
    // setContext('dict', new Dict(data.dict[0]));
  }

  let operator = data.operator,
    abonent = data.abonent,
    name = data.name;
  // if (!data.check) $view = 'login';

  if (data.lang) {
    $nlang = data.lang;
    $langs = data.lang;
  }
</script>

{#if operator}
  <Header></Header>
  {#if $view === 'group'}
    <GroupEditor {data} />
  {:else if $view === 'lesson' || $view === 'quiz'}
    <!-- <Admin {email} {abonent} {name} /> -->
    <ModuleEditor {abonent}></ModuleEditor>
  {/if}
{:else}
  <Login {operator} {abonent} />
{/if}
