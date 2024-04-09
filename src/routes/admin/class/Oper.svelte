<script>
	import { onMount, onDestroy, getContext } from 'svelte';

	import loadImage from 'blueimp-load-image/js/load-image.js';
	import 'blueimp-load-image/js/load-image-scale.js';
	import User from './User.svelte';

	import pkg from 'lodash';
	const { find, findKey, mapValues } = pkg;

	import { langs } from '$lib/js/stores.js';

	export let user;

	let files, user_status, placeholder_name, placeholder_email, placeholder_desc, upload;

	import { dicts } from '$lib/js/stores.js';
	let dict = $dicts;

	if (dict) {
		placeholder_name = dict['input operator name'][$langs];
		placeholder_email = dict['input operator email'][$langs];
		placeholder_desc = dict['input description'][$langs];
	}

	import operator_svg from '$lib/images/operator.svg';
	// let operator_svg =
	// 	'https://kolmit-service.onrender.com/_app/immutable/assets/operator.7238a518.svg';

	let user_pic = user.picture ? user.picture : operator_svg;

	// import { pswd } from '$lib/js/stores.js';
	// let psw = $pswd;

	export let edited_display;
	let readonlyOper = true;
	let readonlyAdm = true;

	import { editable } from '$lib/js/stores.js';
	// const us_edit = editable.subscribe((data) => {
	$: if ($editable) {
		edited_display = $editable;
		readonlyOper = !edited_display;
		readonlyAdm = !edited_display;
	}

	// user.abonent = operator.abonent; //'white@house.usa';

	user.email = user.email ? user.email : '';

	const titleize = (s) => (s ? s.replace(/^([a-z])/, (_, r) => r.toUpperCase()) : '');

	user.name = titleize(user.name);

	import { posterst } from '$lib/js/stores.js';
	import _ from 'lodash';

	onMount(() => {});

	// onDestroy();

</script>

<div style="display:flex; flex-wrap: nowrap;justify-content: space-between; padding-bottom:22px">
	<!-- {@debug operator, user} -->

	<div class="user_pic_div">
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->

		{#if edited_display}
			<input
				bind:this={upload}
				class="file-upload"
				accept="image/png, image/jpeg"
				bind:files
				id="avatar"
				name="avatar"
				type="file"
				style="display: none"
			/>
		{/if}

		{#if user.role === 'admin' || user.role === 'operator'}
			<User
				em={user.email}
				name={user.name}
				abonent={user.abonent}
				poster={user_pic}
			/>
		{/if}
	</div>
</div>

<style>
	.user_pic_div {
		position: relative;
		width: 60px;
		height: 60px;
		text-align: center;
	}
	input:not([readonly]) {
		color: rgb(35, 33, 158);
	}

	input,
	input:hover,
	input:focus,
	input:active,
	textarea {
		background: transparent;
		border: 0;
		border-style: none;
		border-color: transparent;
		outline: none;
		outline-offset: 0;
		box-shadow: none;
		padding: 0;
		font-size: 0.7em;
	}
</style>
