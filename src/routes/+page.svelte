<script>
	import { onMount, setContext } from 'svelte';
	import Operator from './operator/Operator.svelte';
	import Login from './site/Login.svelte';

	export let data;

	let user_pic = data.picture ? data.picture.medium : '';

	let email = data.operator,
		abonent = data.abonent,
		name = data.name;

	import { SignalingChannel } from './signalingChannel.js';
	import { signal } from '$lib/js/stores.js';
	$signal = new SignalingChannel(email);

	import host from './assets/host.json';

	import { wss } from '$lib/js/stores.js';

	// import wsConnector from './wsConnector.js';
	// $wss = new wsConnector(host.host_wss);

	import { server_path } from '$lib/js/stores.js';
	$server_path = data.host;

	import { langs } from '$lib/js/stores.js';
	$langs = data.lang;

	import { dicts } from '$lib/js/stores.js';
	$dicts = data.dict[0];

	import { ice_conf } from '$lib/js/stores.js';
	$ice_conf = data.ice_conf;

	import { users } from '$lib/js/stores.js';
	if (data.users) {
		$users = data.users;
	}

	import { quiz_users_ } from '$lib/js/stores.js';
	if (data.quiz_users) {
		$quiz_users_ = data.quiz_users;
	}

	let scriptLoaded = false;

	onMount(async () => {});
</script>

{#if email && data.users}
	<Operator {email} {abonent} {name} users_={$users} />
{:else}
	<Login {email} {abonent} {user_pic} />
{/if}
