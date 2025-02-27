<script>
  import { onMount, onDestroy, getContext, setContext } from 'svelte';
  import md5 from 'md5';

  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from '@smui/card';

  export let abonent,
    operator,
    poster = '/assets/operator.svg',
    name;

  import { click_call_func } from '$lib/stores.ts';

  import { users_status } from '$lib/stores.ts';

  $click_call_func = null;

  import pkg from 'lodash';
  const { groupBy, find } = pkg;

  import { msg } from '$lib/stores.ts';
  $: if ($msg) {
    // if ($msg.operator) {
    // 	if ($msg.operator === operator) OnMessage($msg);
    // } else {
    // console.log('$msg:', $msg);
    OnMessage($msg_user);
  }

  // import { dc_msg } from '$lib/stores.ts';
  // $: if ($dc_msg) {
  // 	OnMessage($dc_msg);
  // }

  let call_cnt;
  let selected,
    inter,
    status = 'active',
    profile = false,
    card;

  let video_button_display = false;
  let video_element, parent_div;

  $: if (status) {
    $users[operator.operator].status = status;
  }

  let progress = {
    display: 'none',
    value: 0,
  };

  let video = {
    display: 'none',
  };

  let local = {
    video: {
      display: 'none',
      srcObject: '',
    },
    audio: {
      paused: true,
      src: '',
    },
  };

  let remote = {
    video: {
      display: 'block',
      srcObject: '',
      poster: poster,
    },
  };

  let select = {
    display: false,
  };

  let user = {
    operator: operator,
    abonent: abonent,
    type: 'user',
  };

  onMount(async () => {});

  // onDestroy();

  let OnUserClick = getContext('OnClickUser');
</script>

<div class="card-display" bind:this={parent_div}>
  <div class="card-container" bind:this={card}>
    <Card style="min-width: 50px;">
      <Image src={poster} alt="Image {i + 1}" />

      <!-- <Content style="color: #888; font-size:smaller">{name}</Content> -->
      <h3
        class="mdc-typography--subtitle2"
        style="margin: 0; color: #888;font-size:x-small;text-align:center;z-index:1"
      >
        {#if name}
          {name.slice(0, 8)}
        {:else}
          {operator.slice(0, 8)}
        {/if}
      </h3>
    </Card>
  </div>
</div>

<style>
  .card-container {
    position: relative;
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
