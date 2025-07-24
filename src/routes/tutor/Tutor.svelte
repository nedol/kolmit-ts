<script lang="ts">
  import { getContext, onMount } from "svelte";
  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from "@smui/card";

  export let abonent, operator, name;

  import poster from "$lib/images/tutor.png";

  import { users, call_but_status, click_call_func } from "$lib/stores.ts";

  $click_call_func = null;

  import pkg from "lodash";
  const { groupBy, find } = pkg;

  let status = "inactive",
    card;

  let video_element, parent_div;

  $: if (status && operator) {
    $users[operator].status = status;
  }

  onMount(async () => {
    // $call_but_status = status;
  });

  let SetDlgDisplay = getContext("SetDlgDisplay");

  let OnClickCallButton = function (ev, email) {
    SetDlgDisplay();
  };

  // onDestroy();
</script>

<div class="card-display" bind:this={parent_div}>
  <div class="card-container" bind:this={card}>
    <!-- <Card style="min-width: 50px;"> -->

    <video
      class="user_video_remote"
      bind:this={video_element}
      on:click
      {poster}
      autoplay
      playsinline
      on:click={OnClickCallButton}
    >
      <track kind="captions" />
    </video>
  </div>
</div>

<style>
  video {
    display: block;
    margin-right: auto;
    margin-left: auto;
    margin-top: auto;
    max-width: 65px;
    max-height: 65px;
  }

  .card-display {
    position: relative;
    /* bottom: 70px; */
  }
</style>
