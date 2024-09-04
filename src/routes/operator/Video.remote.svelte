<script lang='ts'>
  import { getContext, onMount } from 'svelte';
  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from '@smui/card';
  import { muted } from '$lib/js/stores.js';
  export let display = 'block';
  export let status;

  export let isRemoteAudioMute = false;
  export let card;
  export let srcObject;
  export let operator;
  export let name;
  export let poster;

  import { posterst } from '$lib/js/stores.js';

  let rv, video;
  onMount(async () => {
    rv = video;
     rv.poster = poster;
  });

  $: if (rv && srcObject) {
    rv.srcObject = srcObject;
  } else if (rv && rv.srcObject) {
    rv.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
      rv.srcObject.removeTrack(track);
    });
    rv.src = '';
  }else if(rv && poster){
    rv.poster = poster;
  }

  $: if (status === 'talk' && !isRemoteAudioMute) {
    $muted = false;
  } else {
    $muted = true;
  }
</script>

<!-- <div
	style="
    display:{display};
    position: relative;
    width: 55px;
	margin: 0 auto;
    background-color: transparent;
    border-radius:5px;"
> -->
<div class="card-display" bind:this={card} style="display:{display}">
  <div class="card-container">
    <Card style="min-width: 60px;">
      <Media class="card-media-square" aspectRatio="square">
        <MediaContent>
          <video
            class="oper_video_remote"
            bind:this={video}
            on:click
  
            {status}
            muted={$muted}
            autoplay
            playsinline
            poster={$posterst}
          >
            <track kind="captions" />
          </video>
        </MediaContent>
      </Media>
      <!-- <Content style="color: #888; font-size:smaller">{name}</Content> -->
      <!-- <h3
        class="mdc-typography--subtitle2"
        style="margin: 0; color: #888;font-size:smaller;text-align:center;z-index:1"
      >
        {#if name}
          {name.slice(0, 8)}
        {:else}
          {operator.slice(0, 8)}
        {/if}
      </h3> -->
    </Card>
  </div>
</div>

<!-- </div> -->

<style>
  .card-container {
    position: relative;
    left: -8px;
    scale: 0.8;
    bottom: 20px;
   
  }

  video {
    display: block;
    margin-right: auto;
    margin-left: auto;
    margin-top: auto;
    max-width: 50px;
    max-height: 50px;
  }

  .oper_video_remote {
    position: relative;
    top: 7px;
  }
</style>
