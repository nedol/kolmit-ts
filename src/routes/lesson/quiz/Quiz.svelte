<script>
  import Volgorde from './Volgorde.svelte';
  import Dialog from './dialog/Dialog.svelte';
  import Listen from './listen/Listen.svelte';
  import Numbers from './listen/Numbers.svelte';
  import Time from './listen/Time.svelte';
  import Text from './text/Text.svelte';
  import Word from './word/Word.svelte';
  import WordGame from './word/WordGame.svelte';
  import { dc_oper } from '$lib/js/stores.js';
  import { dc_user, lesson } from '$lib/js/stores.js';
  import { call_but_status  } from '$lib/js/stores.js';

  export let data;
  let quiz = data.quiz;
  let word_game;



</script>

<div />
<!-- {@debug quiz} -->
{#if quiz}
  {#if quiz.includes('dialog')}
    <Dialog {data}/>
  {:else if quiz.includes('listen')}
    {#if data.name === 'Nummers'}
      <Numbers {data} ></Numbers>
    {:else if data.name === 'Tijd'}
      <Time {data} ></Time>
    {:else}  
        <Listen {data} />
    {/if}

  {:else if quiz === 'word'}
    {#if ($dc_user || $dc_oper) && $call_but_status === 'talk' }
       <WordGame {data} bind:this={word_game}/>
    {:else}      
      <Word {data} /> 
    {/if}
  {/if}
{/if}
