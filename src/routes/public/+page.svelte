<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import Login from './Login.svelte';
  import { langs } from '$lib/js/stores.js';
  import { view } from '$lib/js/stores.js';

  import { Dict } from '../dict/dict';
  // $view = 'lesson';

  $: if ($view) {
    console.log($view);
  }

 
  import { dicts } from '$lib/js/stores.js';

  export let data;



  $: if (data.dict[0]){
     $dicts = (data.dict[0]);
     setContext('dict', new Dict(data.dict[0]))
  }

  let operator = data.operator,
    abonent = data.abonent,
    name = data.name;
  // if (!data.check) $view = 'login';

  if (data.lang) $langs = data.lang;
</script>


  <Login {operator} {abonent} />
