<script>
  import { setContext, onMount, onDestroy } from 'svelte';

  import DialogEdit from './dialog/DialogEdit.svelte';
  import ListenEdit from './listen/ListenEdit.svelte';
  import BricksEdit from './bricks/BricksEdit.svelte';
  import WordEdit from './word/WordEdit.svelte';
  import WordGameEdit from './word/WordGameEdit.svelte';
  import { dc_state , call_but_status } from '$lib/stores.ts';

  export let data;
  export let ChangeQuizName;

  setContext('quiz_data', data);

</script>

<!-- {@debug quiz} -->
{#if data.quiz}
  {#if data.quiz.includes('dialog')}
    <DialogEdit {ChangeQuizName} />
  {:else if data.quiz.includes('bricks')}
    <BricksEdit {ChangeQuizName}/>
  {:else if data.quiz === 'word'}
    {#if $dc_state==="open" && $call_but_status === 'talk'}
      <WordGameEdit {data} {ChangeQuizName}/>
    {:else}
      <WordEdit />
    {/if}
  {/if}
{/if}
