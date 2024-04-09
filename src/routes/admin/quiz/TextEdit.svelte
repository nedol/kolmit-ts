<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import Button from '@smui/button';
  import Paper, { Content } from '@smui/paper';
   import { slide } from 'svelte/transition';

  export let data;

  let isCollapsed = true;
  function toggleCollapse() {
    isCollapsed.update((n) => !n);
  }

  let active = 'Words';

    async function CreateContent() {

  }
</script>

<button class="content_generator" on:click={() => (isCollapsed = !isCollapsed)}>
  {isCollapsed ? 'Контент-генератор' : 'Контент-генератор'}
</button>

{#if !isCollapsed}
  <div class="collapsible" in:slide={{ duration: 300 }}>
    <div class="generator_container">
      <TabBar
        tabs={['Format', 'Words', 'Prompt', 'Content']}
        let:tab
        bind:active
      >
        <Tab {tab} minWidth>
          <Label>{tab}</Label>
        </Tab>
      </TabBar>
      {#if active === 'Format'}
        <Paper variant="unelevated">
          <Content></Content>
        </Paper>
      {:else if active === 'Words'}
        <Paper variant="unelevated">
          <Content></Content>
        </Paper>
      {:else if active === 'Prompt'}
        <Paper variant="unelevated">
          <Content></Content>
        </Paper>
      {:else if active === 'Content'}
        <Paper variant="unelevated">
          <Content></Content>
        </Paper>
      {/if}
    </div>

    <div class="container">
      <button class="save" on:click={() => CreateContent()}>Создать</button>
    </div>
  </div>
{/if}

