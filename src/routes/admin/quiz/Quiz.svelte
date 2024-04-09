<script>
  import DialogEdit from './DialogEdit.svelte';
  import ListenEdit from './ListenEdit.svelte';
  import TextEdit from './TextEdit.svelte';
  import WordEdit from './WordEdit.svelte';
  import WordGameEdit from './WordGameEdit.svelte';
  import { dc_oper } from '$lib/js/stores.js';
  import { dc_user } from '$lib/js/stores.js';
  import { call_but_status } from '$lib/js/stores.js';
  const dc = $dc_user || $dc_oper;

  export let data;
  export let ChangeQuizName;
</script>

<div />
<!-- {@debug quiz} -->
{#if data.quiz}
  {#if data.quiz.includes('dialog')}
    <DialogEdit {data} {ChangeQuizName} />
  {:else if data.quiz.includes('listen')}
    <ListenEdit {data} />
  {:else if data.quiz === 'text'}
    <TextEdit {data} />
  {:else if data.quiz === 'word'}
    {#if dc && $call_but_status === 'talk'}
      <WordGameEdit {data} />
    {:else}
      <WordEdit {data} />
    {/if}
  {/if}
{/if}
