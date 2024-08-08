<script>
  import { onMount } from 'svelte';
  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from '@smui/card';
  import { muted } from '$lib/js/stores.js';
  export let srcObject;
  export let poster;
  export let status;

  export let video_element, card;
  export let parent_div;
  export let name, operator;
  let rv;

  onMount(async () => {
    rv = video_element;
  });

  $: if (rv && srcObject) {
    rv.srcObject = srcObject;
  } else if (rv && rv.srcObject) {
    rv.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
      rv.srcObject.removeTrack(track);
    });
    rv.src = '';
  }

  $: if (status) {
    console.log(status);
  }

  $: if (status === 'talk') {
    $muted = false;
  } else {
    $muted = true;
  }
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
            muted={$muted}
            {status}
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
  }
  video {
    display: block;
    margin-right: auto;
    margin-left: auto;
    margin-top: 5px;
    max-height: 70%;
  }
  [status='call'] {
    opacity: 1;
  }
  [status='talk'] {
    opacity: 1;
  }
  [status='muted'] {
    opacity: 0.3;
  }
  [status='inactive'] {
    opacity: 0.3;
  }
  [status='active'] {
    opacity: 1;
  }
  [status='busy'] {
    opacity: 0.3;
  }
</style>
