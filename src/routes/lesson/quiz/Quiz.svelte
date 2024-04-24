<script>
  import Volgorde from './Volgorde.svelte';
  import Dialog from './dialog/Dialog.1.svelte';
  import Listen from './listen/Listen.nl.svelte';
  import Text from './text/Text.svelte';
  import Word from './word/Word.svelte';
  import WordGame from './word/WordGame.svelte';
  import { dc_oper } from '$lib/js/stores.js';
  import { dc_user } from '$lib/js/stores.js';
  import { call_but_status } from '$lib/js/stores.js';
  const dc = $dc_user || $dc_oper;

  export let data;
  let quiz = data.quiz;
</script>

<div />
<!-- {@debug quiz} -->
{#if quiz}
  {#if quiz === 'sequence'}
    <Volgorde data={data.zinnen} />
  {:else if quiz.includes('dialog')}
    <Dialog {data} />
  {:else if quiz.includes('listen')}
    <Listen {data} />
  {:else if quiz === 'text'}
    <Text {data} />
  {:else if quiz === 'word'}
    {#if dc && $call_but_status === 'talk'}
      <WordGame {data} />
    {:else}
      <Word {data} />
    {/if}
  {/if}
{/if}
