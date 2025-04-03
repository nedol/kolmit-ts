<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import Login from './Login.svelte';
  import { langs } from '$lib/stores.ts';
  import { view } from '$lib/stores.ts';

  // import { Dict } from '../dict/dict';

 
  import { dicts } from '$lib/stores.ts';

  export let data;


  let operator = data.operator,
    abonent = data.abonent,
    name = data.name;
  // if (!data.check) $view = 'login';

  if (data.lang) $langs = data.lang;
</script>


  <Login {operator} {abonent} />
