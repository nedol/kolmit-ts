<script>
 import { setContext, onMount, onDestroy } from 'svelte';

  import DialogEdit from './dialog/DialogEdit.svelte';
  import ListenEdit from './listen/ListenEdit.svelte';
  import TextEdit from './text/TextEdit.svelte';
  import WordEdit from './word/WordEdit.svelte';
  import WordGameEdit from './word/WordGameEdit.svelte';
  import { dc_oper_state } from '$lib/js/stores.js';
  import { dc_user_state } from '$lib/js/stores.js';
  import { call_but_status } from '$lib/js/stores.js';
  const dc = $dc_user_state || $dc_oper_state; 

  export let data;
  export let ChangeQuizName;

  setContext('quiz_data', data);
</script>

<!-- {@debug quiz} -->
{#if data.quiz}
  {#if data.quiz.includes('dialog')}
    <DialogEdit {ChangeQuizName} />
  {:else if data.quiz.includes('listen')}
    <ListenEdit {data} />
  {:else if data.quiz === 'text'}
    <TextEdit {data} />
  {:else if data.quiz === 'word'}
    {#if dc && $call_but_status === 'talk'}
      <WordGameEdit {data} />
    {:else}
      <WordEdit />
    {/if}
  {/if}
{/if}
