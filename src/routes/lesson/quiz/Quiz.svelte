<script>
    import CircularProgress from '@smui/circular-progress';

  import Dialog from './dialog/Dialog.svelte';
  import Bricks from './bricks/Bricks.svelte';
  import Listen from './listen/Listen.svelte';
  import Numbers from './listen/Numbers.svelte';
  import Time from './listen/Time.svelte';
  import Text from './text/Text.svelte';
  import Word from './word/Word.svelte';
  import WordGame from './word/WordGame.svelte';
  import { call_but_status } from '$lib/js/stores.js';

  export let data;
  let quiz = data.quiz;

</script>

<div />
<!-- {@debug quiz} -->
{#if quiz}
  {#if quiz.includes('dialog')}
    <Dialog {data} />
  {:else if quiz.includes('bricks')}
    <Bricks {data} />
  {:else if quiz.includes('listen')}
    {#if data.name === 'Nummers'}
      <Numbers {data}></Numbers>
    {:else if data.name === 'Tijd'}
      <Time {data}></Time>
    {:else}
      <Listen {data} />
    {/if}
  {:else if quiz === 'word'}
    {#if $call_but_status === 'talk'}
      <WordGame {data} />
    {:else if $call_but_status === 'inactive' || $call_but_status === 'active'}
      <Word {data} />
      {:else}
        <div style="text-align:center">
          <span
            class="material-symbols-outlined"
            style="position: relative;font-size: 20px; top:20vh; color: blue; scale:1.5;"
          >
            <CircularProgress style="height: 50px; width: 50px;" indeterminate />
          </span>
        </div>
    {/if}
  {/if}
{/if}
