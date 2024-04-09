<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import Login from './login/Login.svelte';
  import { langs } from '$lib/js/stores.js';
  import { view } from '$lib/js/stores.js';
  $view = 'lesson';

  $: if ($view) {
    console.log($view);
  }

  import Class from './class/ClassEditor.svelte';

  import { dicts } from '$lib/js/stores.js';
  import ModuleEditor from './module/ModuleEditor.svelte';

  export let data;

  let callcenter,
    cc_display = 'none';

  $dicts = data.dict[0];

  let email = data.operator,
    abonent = data.abonent,
    name = data.name;

  $langs = data.lang;
</script>

{#if email}
  {#if $view === 'class'}
    <Class {data} />
  {:else if $view === 'lesson'}
    <!-- <Admin {email} {abonent} {name} /> -->
    <ModuleEditor {abonent}></ModuleEditor>
  {/if}
{:else}
  <Login {email} {abonent} />
{/if}
