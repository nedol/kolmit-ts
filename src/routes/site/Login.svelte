<script>
	import { onMount } from 'svelte';
	import { dicts } from '$lib/js/stores.js';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import loadImage from 'blueimp-load-image/js/load-image.js';
	import 'blueimp-load-image/js/load-image-scale.js';
	import { Translate } from '../translate/Transloc.ts';

	import {
		langs
	} from '$lib/js/stores.js';

	let formData = {
		name: '',
		email: '',
		psw: '',
		confirmPassword: '',
		picture: '/assets/operator.svg',
		lang: 'en',
	};

	let abonent, lvl, lang = 'en';
	let passwordMatch = true;

	$: formData.lang = lang;

	onMount(() => {
		let url = new URL(window.location.href);
		abonent = url.searchParams.get('abonent');
		lvl = url.searchParams.get('lvl');
		formData.email = url.searchParams.get('user');
	});

	function uploadImage(event) {
		const file = event.target.files[0];
		if (file) {
			loadImage(
				file,
				(img) => {
					if (img.type === 'error') {
						console.error($dicts['Ошибка загрузки изображения'][lang]);
					} else {
						formData.picture = img.toDataURL();
					}
				},
				{ orientation: true, maxWidth: 100, maxHeight: 100, canvas: true }
			);
		}
	}

	async function handleSubmit() {
		// Здесь вы можете обработать данные формы
		let par = formData;
		par.email = par.email.trim();
		passwordMatch = par.confirmPassword === par.psw;
		if (!passwordMatch) return;
		par.func = 'operator';
		par.lvl = lvl;
		par.abonent = abonent;
		const headers = {
			'Content-Type': 'application/json'
			// Authorization: `Bearer ${token}`
		};
		let res = await fetch(`/`, {
			method: 'POST',
			// mode: 'no-cors',
			body: JSON.stringify({ par }),
			headers: headers
		});
	
		location.reload();
	}
</script>

<div class="container">
	<form on:submit|preventDefault={handleSubmit}>
		<Textfield
			name="email"
			bind:value={formData.email}
			label="{$dicts['Email'][lang]}:"
			required
		/>
		{#await Translate('Имя', 'ru', $langs) then data}
		<Textfield
			name="name"
			bind:value={formData.name}
			label="{data}:"
			required
		/>
		{/await}
		{#await Translate('Пароль', 'ru', $langs) then data}
		<Textfield
			type="password"
			name="psw"
			bind:value={formData.psw}
			label="{data}:"
			required
		/>
		{/await}
		{#await Translate('Повторить пароль', 'ru', $langs) then data}
		<Textfield
			type="password"
			name="confirmPassword"
			bind:value={formData.confirmPassword}
			label="{data}:"
			required
		/>
		{/await}
		{#if !passwordMatch}
			{#await Translate('Пароли не совпадают', 'ru', $langs) then data}
				<p style="color: red;">{data}</p>	
			{/await}
		{/if}
		<div>
			<input type="file" id="pic" on:change={uploadImage} accept="image/png, image/jpeg" hidden />
			<img src={formData.picture} alt="Avatar" on:click={() => document.getElementById('pic').click()} />
		</div>
		{#await Translate('Зарегистрироваться', 'ru', $langs) then data}
			<Button type="submit" disabled={!passwordMatch}>
				{data}
			</Button>
		{/await}
	</form>


</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 500px; /* Широкая форма */
		padding: 20px;
		border: 0px solid #ccc;
		border-radius: 8px;
		background-color: transparent;
		/* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
	}

	.field {
		margin-bottom: 15px;
		width: 80%;
	}

	/* Принудительное расширение полей для SMUI */
	:global(.mdc-text-field) {
		width: 80% !important;
	}

	:global(.mdc-text-field__input) {
		width: 80% !important;
		box-sizing: border-box;
		font-size: 16px;
		padding: 10px;
	}

	img {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		cursor: pointer;
		margin: 10px 0;
	}

	.upload-button {
		margin-top: 15px;
		padding: 10px 20px;
		font-size: 16px;
	}

	/* Адаптивность для мобильных устройств */
	@media screen and (max-width: 768px) {
		form {
			padding: 15px;
		}
	}
</style>
