<script>
  import { onDestroy, onMount } from "svelte";
  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from "@smui/card";
  import { muted } from "$lib/stores.ts";
  export let srcObject;
  export let poster;
  export let status;

  export let video_element, card;
  export let parent_div;
  export let name, operator;
  let rv;

  // $muted = true;

  $: if (status) {
    console.log(status);
  }

  onMount(async () => {
    rv = video_element;
    rv.poster = poster;
  });

  $: if (rv && srcObject) {
    console.log();
    rv.srcObject = srcObject;
    $muted = false;
  }

  onDestroy(() => {
    if (rv && rv.srcObject) {
      rv.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
        rv.srcObject.removeTrack(track);
      });
      rv.src = "";
    }
  });
</script>

<div class="card-display" bind:this={parent_div}>
  <div class="card-container" bind:this={card}>
    <Card style="min-width: 50px;">
      <Media class="card-media-square" aspectRatio="square">
        <MediaContent>
          <video
            class="user_video_remote"
            bind:this={video_element}
            on:click
            {status}
            muted={$muted}
            {poster}
            autoplay
            playsinline
          >
            <track kind="captions" />
          </video>
        </MediaContent>
      </Media>
      <!-- <Content style="color: #888; font-size:smaller">{name}</Content> -->
    </Card>
  </div>
</div>
<slot name="mute_button" />

<style>
  .card-container {
    position: relative;
    scale: 1;
    top: 10px;
    left: 0px;
    height: 70px;
    width: 70px;
    margin: 0 auto;
  }
  video {
    display: block;
    margin-right: auto;
    margin-left: auto;
    margin-top: 5px;
    max-height: 70%;
  }
  [status="call"] {
    opacity: 1;
  }
  [status="talk"] {
    opacity: 1;
  }
  [status="muted"] {
    opacity: 0.05;
  }
  [status="inactive"] {
    opacity: 0.05;
  }
  [status="active"] {
    opacity: 1;
  }
  [status="busy"] {
    opacity: 0.05;
  }
</style>
