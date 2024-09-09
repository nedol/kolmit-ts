<script lang="ts">
  import { onMount, onDestroy, getContext } from 'svelte';
  import md5 from 'md5';
  import RTCUser from './rtc/RTCUser';
  import Profile from './modal/Profile.svelte';
  import DropdownList from './DropdownList.svelte';
  import VideoLocal from './Video.local.svelte';
  import VideoRemote from './Video.remote.svelte';
  import CallButtonUser from './CallButtonUser.svelte';
  import Download from './Download.svelte';
  import AudioLocal from './Audio.local.svelte';
  import AudioRemote from './Audio.remote.svelte';
  import RecordedVideo from './RecordedVideo.svelte';
  import IconButton, { Icon } from '@smui/icon-button';
  import { mdiAccountBox, mdiVolumeHigh } from '@mdi/js';
  import { muted } from '$lib/js/stores.js';

  export let user_, group: [];

  let poster = user_.picture ? user_.picture : '/assets/operator.svg';
  let name = user_.name;
  let operator = user_.operator;
  let abonent = user_.abonent;

  user_.display = 'none'; //видимость в группе

  // const operator = getContext('operator')

  import {
    signal,
    call_but_status,
    dc_user_state,
    click_call_func,
    user_placeholder,
    msg_user,
    users_status,
  } from '$lib/js/stores.js';

  $click_call_func = null;

  import pkg from 'lodash';
  const { groupBy, find } = pkg;

  // import './lib/icofont/icofont.min.css';

  import {} from '$lib/js/stores.js';
  $: if ($msg_user) {
    // if ($msg_user.operator) {
    // 	if ($msg_user.operator === operator) OnMessage($msg_user);
    // } else {
    // console.log('$msg_user:', $msg_user);
    OnMessage($msg_user);
  }

  let dc = false;

  import {} from '$lib/js/stores.js';

  $: if ($dc_user_state) {
    switch ($dc_user_state) {
      // case 'open':
      //   break;
      case ('close', 'mute'):
        $call_but_status = 'inactive';
        break;
    }
  }

  $: if (status) {
    $users_status[operator] = status;
  }

  let checked = false;

  let isRemoteAudioMute = false;

  const uid = md5(abonent + operator.operator + operator);

  let rtc;

  let call_cnt;
  let selected,
    inter,
    status = 'inactive',
    profile = false,
    card;

  let video_button_display = false;
  let video_element, parent_div;

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
    display: 'none',
  };

  let oper = getContext('operator');

  onMount(async () => {
    rtc = new RTCUser(user, uid, $signal, oper);
    rtc.SendCheck();

    rtc.OnOpenDataChannel = () => {
      console.log('OnOpenDataChannel');
    };

    rtc.SendToComponent = OnMessage;

    rtc.SetLocalVideo = (src) => {
      local.video.srcObject = src;
    };

    rtc.GetRemoteVideo = () => {
      return remote.video.srcObject;
    };

    rtc.SetRemoteVideo = (src) => {
      remote.video.srcObject = src;
      remote.video.display = 'block';
      // status = 'talk';
      // $call_but_status = 'talk';
    };

    rtc.PlayCallCnt = () => {
      local.audio.paused = false;
    };

    // $call_but_status = status;
  });

  // onDestroy();

  function OnLongPress() {
    select.display = true;
  }

  // function OnMute() {
  // 	status = 'talk';
  // 	// $call_but_status = 'talk';
  // 	OnClickCallButton();
  // }

  function OnChangeFile(e) {
    try {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (file) {
        rtc.DC.SendFile(file);
      };
    } catch (ex) {}
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
          // user_.display = 'block'
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
          user_.display = 'none';
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

    if (data.operator && data.operator === operator) {
      console.log(status);
      status = 'active';
      // $call_but_status = 'active';
    }

    // TODO: to delete
    if (data.desc && data.cand) {
      if (status === 'talk') {
        // status = 'talk';
        // $muted = true;
      } else {
        // status = 'call';
      }
    }

    if (data.func === 'offer') {
      if (user_.operator === data.operator) user_.display = 'block';
    }

    if (data.func === 'call') {
      // $muted = true;
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
      //parent_div.appendChild(card);
      // video_element.load();
      if (user_.operator === data.operator) user_.display = 'none';
    }

    if (data.func === 'talk') {
      console.log('user talk', data.operator);
      if (data.operator === operator) {
        $call_but_status = 'talk';
        status = 'talk';
        //user_.display = 'block'
        video_button_display = true;
        local.audio.paused = true;
        $muted = false;
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

  let OnClickCallButton = function (ev, email) {
    // if (email && email !== rtc.operator) return;
    try {
      // Fix up for prefixing
      if (!window.AudioContext) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx = new AudioContext();
        rtc.localSoundSrc = audioCtx.createMediaElementSource(rtc.localSound);
        rtc.localSoundSrc.connect(audioCtx.destination);
      }
    } catch (ex) {
      console.log('Web Audio API is not supported in this browser');
    }

    switch (status) {
      case 'inactive':
        // status = 'wait';
        //user_.display = 'none'
        // Call();
        // remote.video.srcObject = null;
        break;

      // case 'wait':
      // 	status = 'inactive';
      // 	// $call_but_status = 'inactive';
      // 	rtc.SendCheck();
      // 	break;
      case 'active':
        user_.display = 'block';
        $click_call_func = OnClickCallButton;
        function call() {
          rtc.Call();
          status = 'call';
          $call_but_status = 'call';
          video_element.load();

          $user_placeholder.appendChild(card); //звонок

          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        call();

        break;
      case 'call':
        status = 'inactive';
        //user_.display = 'none'
        $call_but_status = 'inactive';

        local.audio.paused = true;
        local.video.display = 'none';
        video_button_display = 'none';
        clearInterval(inter);
        call_cnt = 10;
        rtc.OnInactive();
        $click_call_func = null; //operator -> OnClickCallButton
        parent_div.appendChild(card);
        break;
      case 'talk':
        status = 'inactive';
        //user_.display = 'none'
        $call_but_status = 'inactive';

        local.video.display = 'none';
        // remote.video.display = 'none';
        video_button_display = 'none';
        rtc.OnInactive();
        $click_call_func = null; //operator -> OnClickCallButton
        parent_div.appendChild(card);
        video_element.poster = '';
        video_element.load();

        video_element.poster = remote.video.poster;
        break;
      case 'muted':
        status = 'inactive';
        //user_.display = 'none'
        // $call_but_status = 'inactive';
        video_button_display = 'none';
        $click_call_func = null; //operator -> OnClickCallButton
        parent_div.appendChild(card);
        break;
      case 'busy':
        // rtc.Call();
        if ($call_but_status === 'talk') {
          status = 'inactive';
          //user_.display = 'none'
          $call_but_status = 'inactive';
          rtc.OnInactive();
        }

        // $click_call_func = null; //operator -> OnClickCallButton
        // parent_div.appendChild(card);
        // video_element.load();
        // video_element.src = '';
        // video_element.poster = remote.video.poster;
        break;
      default:
        break;
    }
  };

  function toggle_remote_audio() {
    isRemoteAudioMute = !isRemoteAudioMute;
    $muted = isRemoteAudioMute;
  }
</script>

<VideoRemote
  {...remote.video}
  {name}
  {operator}
  bind:parent_div
  bind:video_element
  bind:card
  bind:status
  on:click={OnClickCallButton}
></VideoRemote>

<AudioLocal {...local.audio} bind:paused={local.audio.paused} />
