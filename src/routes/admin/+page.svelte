<script lang="ts">
  import { onMount, setContext } from "svelte";
  import Header from "./Header.svelte";
  import Login from "./login/Login.svelte";
  import { langs, nlang } from "$lib/stores.ts";
  import { view } from "$lib/stores.ts";

  import GroupEditor from "./group/GroupEditor.svelte";

  import { dicts } from "$lib/stores.ts";
  import ModuleEditor from "./module/ModuleEditor.svelte";

  export let data;

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
  {#if $view === "group"}
    <GroupEditor {data} />
  {:else if $view === "module" || $view === "quiz"}
    <!-- <Admin {email} {abonent} {name} /> -->
    <ModuleEditor {abonent}></ModuleEditor>
  {/if}
{:else}
  <Login {operator} {abonent} />
{/if}
