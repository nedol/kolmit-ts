<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import Chat from "./operator/chat/Chat.svelte";

  export let lvl: number;

  let chatComponent;

  const loading = writable(true);
  const error = writable<string | null>(null);
  const description = writable<string | null>(null);

  onMount(async () => {
    loading.set(true);
    error.set(null);

    await fetch(`./?func=lvl_desc&level=${lvl}`)
      .then((response) => response.json())
      .then(async (data) => {
        $description = data.obj.map((item) => {
          return item.rule_text;
        });
        console.log($description);
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  });
</script>

<!-- UI -->
<Chat prompt_type={"level"} bind:this={chatComponent} isHearing="true" />

<style>
  div {
    max-width: 600px;
    margin: 1rem auto;
  }
</style>
