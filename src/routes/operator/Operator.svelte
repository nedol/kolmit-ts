<script lang="ts">


	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import '../assets/icofont/icofont.min.css';
	import BottomAppBar, { Section, AutoAdjust } from '@smui-extra/bottom-app-bar';
	import IconButton, { Icon } from '@smui/icon-button';

	import { mdiAccountBox, mdiVolumeHigh, mdiVolumeOff } from '@mdi/js';
	import { muted } from '$lib/js/stores.js';
	import CircularProgress from '@smui/circular-progress';
	import { dicts } from '$lib/js/stores.js';
	import { langs } from '$lib/js/stores.js';
	import { user_placeholder } from '$lib/js/stores.js';
	// import {Dict} from '$lib/js/$dicts'
	import Callcenter from './class/Class.svelte';
	let callcenter;
	import { RTCOperator } from './rtc/RTCOperator';

	import CallButton from './callbutton/CallButtonOperator.svelte';
	// import BurgerMenu from './menu/BurgerMenu.svelte';
	import VideoLocal from './Video.local.svelte';
	import VideoRemote from './Video.remote.svelte';

	import Download from './Download.svelte';
	import AudioLocal from './Audio.local.svelte';
	import AudioRemote from './Audio.remote.svelte';

	import RecordedVideo from './RecordedVideo.svelte';

	import Lesson from '../lesson/Lesson.svelte';

	import Chat from '../chatGPT/Сhat.svelte';

	import pkg from 'lodash';
	const { find } = pkg;

	import md5 from 'md5';

	import { lesson } from '$lib/js/stores.js';

	import { signal } from '$lib/js/stores.js';

	import { users } from '$lib/js/stores.js';
	export let users_;
	$users = users_;

	import { click_call_func } from '$lib/js/stores.js';

	import { dc_oper_state } from '$lib/js/stores.js';
	import { dc_user_state } from '$lib/js/stores.js';

	$: if ($dc_oper_state === 'closed' || $dc_user_state === 'closed') {
	}

	import { msg_user } from '$lib/js/stores.js';
	$: if ($msg_user) {
		OnMessage($msg_user, null);
	}

	import { msg_oper } from '$lib/js/stores.js';
	$: if ($msg_oper) {
		OnMessage($msg_oper, null);
	}

	import { view } from '$lib/js/stores.js';
	import { operator } from '$lib/js/stores.js';
	import { posterst } from '$lib/js/stores.js';

	let rtc:any;
	let bottomAppBar;
	let selected:any;
	let call_cnt:number , inter:any;
	let video_button_display = false;
	let video_progress = false;
	let edited_display = false;
	let synthesis;
	let isRemoteAudioMute = false;
	let commandsList;

	let debug_div:any;

	let cc_display:string,
		lesson_display:string,
		chat_display = 'block';

	$: switch ($view) {
		case 'lesson':
			cc_display = 'none';
			lesson_display = 'block';
			break;
		case 'class':
			lesson_display = 'none';
			break;
		case 'chat':
			cc_display = 'none';
			lesson_display = 'none';
			break;
	}

	import { call_but_status } from '$lib/js/stores.js';
	$call_but_status = 'inactive';

	import { editable } from '$lib/js/stores.js';
	$: if ($editable) {
		edited_display = $editable;
	}

	export let email, abonent, name;
	const uid = md5(email);

	$: if (remote.text.msg) {
		// console.log(remote.text.msg);
	}

	let container;

	const token = 'CPkJ1MYWC7DMlvw6MvtV0yBw';
	const headers = {
		'Content-Type': 'application/json'
		// Authorization: `Bearer ${token}`
	};

	async function CallWaiting(par:any) {
		par.func = 'callwaiting';

		fetch(`/operator`, {
			method: 'POST',
			// mode: 'no-cors',
			body: JSON.stringify({ par }),
			headers: headers
		})
			.then((response) => response.json())
			.then((data) => {
				data.resp.map((resp:string) => {
					$msg_oper = resp;
				});

				CallWaiting(par);
			})
			.catch((error) => {
				CallWaiting(par);
				console.log(error);
				return [];
			});
	}

	let audioCtx;

	onMount(async () => {
		try {
			rtc = new RTCOperator($operator, uid, $signal);
			initRTC();
			rtc.SendCheck();
			CallWaiting($operator);
			try {
				// Fix up for prefixing
				if (!window.AudioContext) {
					window.AudioContext = window.AudioContext || window.webkitAudioContext;
					audioCtx = new AudioContext();
					rtc.localSoundSrc = audioCtx.createMediaElementSource(window.user.localSound);
					rtc.localSoundSrc.connect(audioCtx.destination);
				}
			} catch (ex) {
				console.log('Web Audio API is not supported in this browser');
			}

			// Добавьте слушателя событий для скрытия списка команд при клике за его пределами
			// document.addEventListener('click', handleOutsideClick);
		} catch (ex) {
			console.log();
		}
	});

	let progress = {
		display: 'block',
		value: 0
	};

	let local = {
		video: {
			display: 'none',
			srcObject: '',
			poster: ''
		},
		audio: {
			paused: true,
			src: ''
		}
	};

	let remote = {
		text: {
			display: 'none',
			msg: $dicts['Вам звонит:'] ? $dicts['Вам звонит:'][$langs] : '',
			name: '',
			email: ''
		},
		video: {
			display: 'none',
			srcObject: '',
			poster: ''
		}
	};

	let profile = {
		display: 'none'
	};

	$operator = {
		type: 'operator',
		em: email,
		abonent: abonent,
		uid: uid,
		name: name,
		img: $posterst
	};
	if ($operator.em === abonent) {
		$operator.role = 'admin';
	} else {
		$operator.role = 'user';
	}

	function onTransFile(params:any) {
		let event = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		});
		document.getElementById('files').dispatchEvent(event);
	}

	$: if (selected)
		switch (selected) {
			case 1:
				break;
			case 2:
				edited_display = true;
				break;

			case 10:
				break;
		}

	setContext('abonent', abonent);

	const SendToComponent = OnMessage;

	async function initRTC() {
		// rtc ..set(rtc .;
		//rtc .type = "operator";

		rtc.PlayCallCnt = () => {
			// video_progress = false;

			local.audio.paused = false;

			return;

			call_cnt = 10;

			inter = setInterval(function () {
				call_cnt--;

				if (call_cnt === 0) {
					clearInterval(inter);
					call_cnt = 10;
					local.audio.paused = true;
					return;
				}
			}, 2000);

			return;
		};

		rtc.GetRemoteVideo = () => {
			return remote.video.srcObject;
		};
		rtc.SetLocalVideo = (src:string) => {
			if (src) local.video.srcObject = src;
		};

		rtc.SetRemoteVideo = (src:string) => {
			// if ($call_but_status === 'talk') {
			remote.video.poster = '';
			remote.video.srcObject = src;
			remote.video.display = 'block';
			// local.audio.paused = true;
			// }
		};
	}

	function OnLongPress() {
		selected.display = true;
	}

	function OnClickCallButton() {
		switch ($call_but_status) {
			case 'inactive':
				rtc.Offer();
				$call_but_status = 'active';
				break;

			case 'active':
				$call_but_status = 'inactive';
				rtc.OnInactive();

				break;
			case 'call':
				$call_but_status = 'talk';
				clearInterval(inter);
				call_cnt = 10;
				local.audio.paused = true;

				rtc.OnTalk();
				video_button_display = true;
				remote.text.display = 'none';
				// const dispatch = createEventDispatcher();
				// dispatch('talk');
				// const event = new Event('talk');
				// document.getElementsByTagName('body')[0].dispatchEvent(event);

				break;
			case 'talk':
				local.video.display = 'none';
				video_button_display = false;
				remote.video.display = 'none';
				remote.video.srcObject = '';
				remote.video.poster = '';
				remote.text.display = 'none';
				remote.text.name = '';
				remote.text.email = '';
				$call_but_status = 'inactive';
				rtc.OnInactive();
				break;
			case 'muted':
				$call_but_status = 'inactive';

				local.video.srcObject = '';

				remote.video.display = 'none';
				remote.video.srcObject = '';
				remote.video.poster = '';
				remote.text.display = 'none';
				// local.video.poster = UserSvg;
				rtc.OnInactive();
				break;
			default:
				return;
		}
	}

	$click_call_func = OnClickCallButton;

	$: if (!$click_call_func) {
		$click_call_func = OnClickCallButton;
	}

	function openProfile(id) {
		profile.display = 'block';
	}

	function OnClickVideoButton() {
		$call_but_status = 'talk';
		local.audio.paused = true;
		local.video.display = 'block';
		video_button_display = false;
		video_progress = true;

		if (rtc.DC.dc.readyState === 'open') {
			rtc.GetUserMedia({ audio: 1, video: 1 }, function () {
				rtc.SendVideoOffer(rtc.main_pc);
			});
		}
	}

	function OnPlayVideo() {
		video_progress = false;
	}

	function OnMessage(data:any, resolve:any) {
		if (data.call || data.func === 'call') {
			if ($call_but_status === 'active') {
				$call_but_status = 'call';
				local.audio.paused = false;
			}

			rtc.OnCall();

			remote.text.display = 'block';
			video_button_display = false;

			if (data.profile) {
				let profile = data.profile;
				let avatar = profile.img;
				remote.video.poster = avatar;
				if (avatar) remote.video.display = 'block';

				remote.text.name = profile.name;
				remote.text.email = profile.email;
			}
		}
		if (data.func === 'talk') {
			// console.log('oper talk', data.em);

			$call_but_status = 'talk';

			video_button_display = true;
			remote.text.display = 'none';
		}

		if (data.func === 'mute') {
			local.audio.paused = true;

			video_button_display = false;
			local.video.display = 'none';
			local.video.srcObject = '';
			// local.video.display = 'block';
			remote.video.srcObject = '';
			remote.video.poster = '';
			remote.video.display = 'none';
			remote.text.name = '';
			remote.text.email = '';
			remote.text.display = 'none';
			// local.video.poster = UserSvg;
			// console.log('rtc', rtc);
			// rtc.OnInactive();

			setTimeout(() => {
				$call_but_status = 'inactive';
			}, 0);

			if ($call_but_status === 'talk') {
				rtc.OnInactive();
			} else if ($call_but_status === 'call') {
				rtc.OnHangup();
				// callcenter.GetUsers();
			}
			if (resolve) resolve();
		}

		if (data.camera) {
			local.video.src = that.localStream;
		}

		if (data.lesson) {
			$view = 'lesson';

			if (data.lesson) {
				$lesson.data = {
					quiz: data.lesson.quiz,
					name: data.lesson.name,
					html: data.lesson.html,
					question: data.lesson.question,
					answer: data.lesson.answer,
					cur_qa: data.lesson.cur_qa,
					func: data.lesson.func
				};
			}
		}
	}

	function onDebug() {
		if (debug_div.style.opacity === '10') debug_div.style.opacity = '0';
		else debug_div.style.opacity = '10';
	}

	function handleChatOpen(ev) {
		$view = 'chat';
		// fetch(`./?abonent=${abonent}&func=reset`)
		// 	.then(() => location.reload())
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});
	}

	function toggle_remote_audio() {
		isRemoteAudioMute = !isRemoteAudioMute;
		$muted = isRemoteAudioMute;
	}

	onDestroy(() => {
		callcenter = '';
	});
</script>

<div
	style="position: relative;
    bottom: 0;
	z-index:2"
>
	<BottomAppBar slot="oper" variant="static" bind:this={bottomAppBar}>
		<Section>
			<div class="remote_div" bind:this={$user_placeholder}>
				<VideoRemote
					{...remote.video}
					name={remote.text.name}
					em={$operator.em}
					on:click={OnClickCallButton}
					on:mute
					bind:isRemoteAudioMute
					status={$call_but_status}
				></VideoRemote>
				{#if $call_but_status === 'talk'}
					<div class="speaker-button">
						<IconButton on:click={toggle_remote_audio}>
							<Icon tag="svg" viewBox="0 0 24 24">
								{#if !isRemoteAudioMute}
									<path fill="currentColor" d={mdiVolumeHigh} />
								{:else}
									<path fill="currentColor" d={mdiVolumeOff} />
								{/if}
							</Icon>
						</IconButton>
					</div>
				{/if}
			</div>
		</Section>
		<Section>
			{#if remote.text.display && remote.text.name}
				<div class="remote_text_display" style="display:{remote.text.display};">
					<p class="remote_msg">
						{remote.text.msg}<br />{remote.text.name}
					</p>
				</div>
			{/if}
		</Section>
		<Section>
			<CallButton on:click={$click_call_func} bind:status={$call_but_status} {OnLongPress}>
				<b
					class="call_cnt"
					style="display:none;position: relative;left:22px;top:10px;color:#0e0cff;font-size: 12px;"
					>100</b
				>
				<span
					class="badge badge-primary badge-pill call-queue"
					style="display:none;position: relative;right:0px;bottom:0px;color:#0e0cff;font-size: 12px;opacity:1"
					>0</span
				>
			</CallButton>
		</Section>
		<Section>
			<div class="video" on:click={OnClickVideoButton} on:loadstart={OnPlayVideo}>
				{#if video_button_display}
					<Icon tag="svg" viewBox="0 0 24 24">
						<path fill="currentColor" style="color:grey" d={mdiAccountBox} />
					</Icon>
					<!-- <i class="video icofont-ui-video-chat"  on:click = {OnClickVideoButton}
                        style="position: absolute; right: 0; top: 0; stroke:black; stroke-width: 2px; color: lightgrey; font-size: 30px; z-index: 20;"></i>  -->
				{/if}

				{#if video_progress}
					<div style="position: absolute; top: -10px;">
						<CircularProgress style="height: 30px; width: 30px;" indeterminate />
					</div>
				{/if}
			</div>

			<div class="videolocal_div">
				<VideoLocal {...local.video}>
					<svelte:fragment slot="footer">
						<div bind:this={container} />
					</svelte:fragment>
				</VideoLocal>
			</div>
		</Section>
	</BottomAppBar>
	<!-- <VideoLocal {...local.video} /> -->
	<AudioLocal {...local.audio} bind:paused={local.audio.paused} />
	<!-- {@debug $call_but_status} -->
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- <div class="chat-container" bind:this={debug_div} on:click={onDebug}>
	<div class="debug">{debug}</div>
</div> -->
<!-- {@debug $view} -->
<Callcenter
	view={$view}
	style="display:{cc_display}"
	bind:this={callcenter}
	bind:$call_but_status
	bind:operator={$operator}
/>

<Lesson view={$view} style="display:{lesson_display}" data={$users[0].staff} />

<Chat view={$view} style="display:{chat_display}"></Chat>

<style  lang="scss">
	.remote_msg {
		position: relative;
		font-size: 0.7em;
		white-space: nowrap;
		color: black;
		margin: auto;
		text-align: center;
		top: -10px;
		/* background-color: rgba(125, 125, 125, 0.7); */
		z-index: 1;
	}

	.speaker-button {
		position: absolute;
		left: 55px;
		bottom: 18px;
		color: black;
	}

	.video {
		position: relative;
		top: 5px;
		margin: auto;
		max-height: 50px;
	}
	.videolocal_div {
		position: relative;

		width: 45px;
		bottom: 10px;
	}

	@media screen and (max-width: 400px) {
		.video {
			top: 0px;
		}
	}
</style>
