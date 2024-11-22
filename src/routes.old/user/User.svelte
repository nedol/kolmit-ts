<script lang="ts">
  import { onMount, onDestroy, getContext, setContext } from 'svelte';
  import md5 from 'md5';

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

  export let user_, group: [];


  let name = user_.name;
  let operator = user_.operator;
  let abonent = user_.abonent;

  user_.display = 'none'; //видимость в группе

  import {
    users,
    muted,
    call_but_status,
    dc,
    click_call_func,
    msg,
    posterst
  
  } from '$lib/js/stores.js';

  let poster = user_.picture ? user_.picture : '/assets/operator.svg';


  $click_call_func = null;

  import pkg from 'lodash';
  const { groupBy, find, findIndex } = pkg;

 export let rtc = '';

  let checked = false;

  let isRemoteAudioMute = false;

  // const uid = md5(operator);

  let call_cnt,
    selected,
    inter,
    status = 'active',
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

  const headers = {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`
  };

  // $: if ($call_but_status === 'active') {
  //   isOperatorWaiting = true;
  //   OperatorWaiting({
  //     type: 'user',
  //     func: 'operatorwaiting',
  //     abonent: abonent,
  //     operator: operator_.operator,
  //   });
  // } else if ($call_but_status === 'inactive') {
  //   // isOperatorWaiting = false;
  //   // group = [];
  //   // group = group;
  // }

  $: if ($msg) {
    OnMessage($msg);
    // $msg = ''
  }

  function OnMessage(data) {
    if (data.func === 'talk') {
      $call_but_status = 'talk';
    }

    if (
      data.func === 'offer' &&
      status == 'active' &&
      $call_but_status == 'active'
    ) {
      if (data.operators && data.operators[user_.operator]) {
        user_.display = 'block';
      }
    } else {
      user_.display = 'none';
    }

    local.audio.paused = true;

    if (data.func === 'close') {
      if (data.operator === user_.operator) {
        rtc?.OnInactive();
        $call_but_status = 'inactive';
        parent_div.appendChild(card);
      }
    }
  }

  let res_talk;

  $: switch ($call_but_status) {
    case 'talk':
      if(typeof res_talk === "function") res_talk();

      break;
  }

  let OnClickCallButton = function (resolve:any) {
    // if (email && email !== rtc.operator) return;
    res_talk = resolve;

    switch (status) {

      case 'active':
        if ($call_but_status === 'call' || $call_but_status === 'talk') break;
        user_.display = 'block';
        $click_call_func = OnClickCallButton;
        (()=> {
          $posterst = poster;
          rtc.Call(operator);
          status = 'call';

          video_element?.load();

          window.scrollTo({ top: 0, behavior: 'smooth' });
        })();

        break;
      case 'call_':
        status = 'inactive';
        user_.display = 'none';
        // $call_but_status = 'inactive';

        local.audio.paused = true;
        local.video.display = 'none';
        video_button_display = 'none';
        clearInterval(inter);
        call_cnt = 10;
        rtc.OnInactive();
        $click_call_func = null; //operator -> OnClickCallButton
        // parent_div?.appendChild(card);
        break;
      case 'talk_':
        status = 'inactive';
        user_.display = 'none';
        // $call_but_status = 'inactive';

        local.video.display = 'none';
        // remote.video.display = 'none';
        video_button_display = 'none';
        rtc.OnInactive();
        $click_call_func = null; //operator -> OnClickCallButton
        // parent_div?.appendChild(card);
        video_element.poster = '';
        video_element.load();

        video_element.poster = remote.video?.poster;
        break;
      case 'muted_':
        status = 'inactive';
        user_.display = 'none';
        // $call_but_status = 'inactive';
        video_button_display = 'none';
        $click_call_func = null; //operator -> OnClickCallButton
        // parent_div?.appendChild(card);
        break;
      case 'busy_':
        // rtc.Call();
        if ($call_but_status === 'talk') {
          status = 'inactive';
          user_.display = 'none';
          // $call_but_status = 'inactive';
          rtc.OnInactive();
        }
        break;
      default:
        break;
    };
  };

  $users[operator] = { OnClickCallButton: OnClickCallButton };

  function toggle_remote_audio() {
    isRemoteAudioMute = !isRemoteAudioMute;
    $muted = isRemoteAudioMute;
  }

  onDestroy(async () => {
    $dc?.SendDCClose(() => {});

    // $call_but_status = 'inactive';
    local.video.display = 'none';
    remote.video.display = 'none';
    console.log();
  });
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
