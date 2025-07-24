<script lang="ts">
  import { onMount, onDestroy, getContext, setContext } from "svelte";
  import md5 from "md5";

  import Profile from "./modal/Profile.svelte";
  import DropdownList from "./DropdownList.svelte";
  import VideoLocal from "../media/Video.local.svelte";
  import VideoRemote from "../media/Video.remote.svelte";
  import CallButtonUser from "./CallButtonUser.svelte";
  import Download from "./Download.svelte";
  import AudioLocal from "../media/Audio.local.svelte";
  import AudioRemote from "../media/Audio.remote.svelte";
  import RecordedVideo from "./RecordedVideo.svelte";
  import IconButton, { Icon } from "@smui/icon-button";
  import { mdiAccountBox, mdiVolumeHigh } from "@mdi/js";

  export let user_, group: [];

  let name = user_.name;
  let operator = user_.operator;
  let abonent = user_.abonent;

  user_.display = "none"; //видимость в группе

  import {
    users,
    muted,
    call_but_status,
    dc,
    rtc,
    click_call_func,
    msg,
    posterst,
  } from "$lib/stores.ts";

  let poster = user_.picture ? user_.picture : "/assets/operator.svg";

  $click_call_func = null;

  import pkg from "lodash";
  const { groupBy, find, findIndex } = pkg;

  let checked = false;

  let isRemoteAudioMute = false;

  // const uid = md5(operator);

  let call_cnt,
    selected,
    inter,
    status = "active",
    profile = false,
    card;

  let video_button_display = false;
  let video_element, parent_div;

  let progress = {
    display: "none",
    value: 0,
  };

  let video = {
    display: "none",
  };

  let local = getContext("local");

  let remote = getContext("remote");

  let select = {
    display: false,
  };

  let user = {
    operator: operator,
    abonent: abonent,
    type: "user",
    display: "none",
  };

  let oper = getContext("operator");

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
        $rtc.DC.SendFile(file);
      };
    } catch (ex) {}
  }

  const headers = {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`
  };

  let res_talk;

  // $: switch ($call_but_status) {
  //   case "talk":
  //     if (typeof res_talk === "function") res_talk();

  //     break;
  // }

  let OnClickCallButton = function (resolve: any) {
    // if (email && email !== rtc.operator) return;
    res_talk = resolve;

    switch (status) {
      case "active":
        if ($call_but_status === "call" || $call_but_status === "talk") break;
        user_.display = "block";
        $click_call_func = OnClickCallButton;
        (() => {
          $posterst = poster;
          $rtc.Call(operator);
          $local.audio.paused = false;
          status = "talk";

          video_element?.load();

          window.scrollTo({ top: 0, behavior: "smooth" });
        })();

        break;
    }
  };

  $users[operator] = { OnClickCallButton: OnClickCallButton };

  function toggle_remote_audio() {
    // isRemoteAudioMute = !isRemoteAudioMute;
    // $muted = isRemoteAudioMute;
  }

  onDestroy(async () => {
    // $dc?.SendDCClose(() => {});

    // $call_but_status = 'inactive';
    $local.video.display = "none";
    $remote.video.display = "none";
    console.log();
  });
</script>

{#if true}
  <VideoRemote
    {...$remote.video}
    {name}
    {operator}
    bind:parent_div
    bind:video_element
    bind:card
    bind:status
    on:click={OnClickCallButton}
  ></VideoRemote>
{/if}

<AudioLocal {...$local.audio} bind:paused={$local.audio.paused} />
