<script lang="ts">

  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  export let lvl: number;

  const loading = writable(true);
  const error = writable<string | null>(null);
  const description = writable<string | null>(null);

  onMount(async () => {

    loading.set(true);
    error.set(null);

    await fetch( `./?func=lvl_desc&level=${lvl}`)
    .then((response) => response.json())
    .then(async (data) => {
        $description = data.obj.map(
            (item)=>{return item.rule_text }
        );
        console.log($description);
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
  });
</script>

<!-- UI -->
<div class="p-4 rounded-lg bg-white shadow-md">
  <h2 class="text-xl font-semibold mb-2">Niveau {lvl}</h2>

  {#if $loading}
    <p>Beschrijving wordt geladen...</p>
    <p class="text-gray-800 whitespace-pre-line">{JSON.stringify($description)}</p>
  {/if}
</div>

<style>
  div {
    max-width: 600px;
    margin: 1rem auto;
  }
</style>
