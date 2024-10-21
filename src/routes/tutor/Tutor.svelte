<script>
  import { getContext, onMount } from 'svelte';
  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from '@smui/card';

  import CallButtonUser from './CallButtonUser.svelte';
  import { view } from '$lib/js/stores.js';

  export let abonent, operator, name;

  import poster from '$lib/images/tutor.png';

  import { users, call_but_status, click_call_func} from '$lib/js/stores.js';

  $click_call_func = null;

  import pkg from 'lodash';
  const { groupBy, find } = pkg;

  let checked = false;

  let rtc;

  let call_cnt;
  let selected,
    inter,
    status = 'inactive',
    profile = false,
    card;

  let video_button_display = false;
  let video_element, parent_div;

  $: if (status && operator) {
     $users[operator].status = status;
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

  onMount(async () => {
    // $call_but_status = status;
  });

  // onDestroy();

  function OnLongPress() {
    select.display = true;
  }

  function OnMessage(data) {
    if (data.operators && data.operators[operator]) {
      let res = groupBy(data.operators[operator], 'status');
      try {
        if (res && res['offer']) {
          if (status !== 'call') {
            status = 'active';
            // $call_but_status = 'active';
          }
        } else if (res['busy']) {
          // if ($click_call_func === null)
          if (
            !rtc.DC ||
            (rtc.DC &&
              rtc.DC.dc.readyState !== 'open' &&
              rtc.DC.dc.readyState !== 'connecting')
          )
            status = 'busy';
        } else if (res['close']) {
          local.video.display = 'none';
          // remote.video.display = 'none';
          local.audio.paused = true;

          //rtc.abonent = url.searchParams.get('abonent');
          status = 'inactive';
          // $call_but_status = 'inactive';
          $click_call_func = null; //operator -> OnClickCallButton
          parent_div.appendChild(card);
          rtc.OnInactive();
          video_element.src = '';
        }
      } catch (ex) {
        console.log(ex);
      }
    }

    if (data.operator && data.operator.operator === rtc.operator) {
      status = 'active';
      // $call_but_status = 'active';
    }

    // TODO: to delete
    if (data.desc && data.cand) {
      if (status === 'talk') {
        // status = 'talk';
      } else {
        // status = 'call';
      }
    }

    if (data.func === 'call') {
      remote.video.muted = true;
    }

    if (data.func === 'mute') {
      local.audio.paused = true;

      video_button_display = false;
      local.video.display = 'none';
      // remote.video.display = 'none';
      // rtc.abonent = url.searchParams.get('abonent');
      status = 'inactive';
      $call_but_status = 'inactive';
      $click_call_func = null; //operator -> OnClickCallButton
      parent_div.appendChild(card);
      // video_element.load();
    }

    if (data.func === 'talk') {
      console.log('user talk', data.operator);
      if (data.operator === operator) {
        $call_but_status = 'talk';
        status = 'talk';
        video_button_display = true;
        local.audio.paused = true;
        remote.video.muted = false;
        video_button_display = 'block';
        // local.video.display = "block";
        remote.video.display = 'block';
      }
    }

    if (data.func === 'redirect') {
      status = 'call';
      // $call_but_status = 'call';
      local.audio.paused = true;

      remote.video.srcObject = null;
      remote.video.display = 'none';
    }

    // $call_but_status = status;
  }

  let SetDlgDisplay = getContext('SetDlgDisplay');

  let OnClickCallButton = function (ev, email) {
    SetDlgDisplay();
  };
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
