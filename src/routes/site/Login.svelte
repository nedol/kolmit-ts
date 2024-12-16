<script>
	import { onMount } from 'svelte';
	import { dicts } from '$lib/js/stores.js';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import loadImage from 'blueimp-load-image/js/load-image.js';
	import 'blueimp-load-image/js/load-image-scale.js';

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
		passwordMatch = formData.psw === formData.confirmPassword;
		if (!passwordMatch) return;

		const requestData = {
			...formData,
			func: 'operator',
			lvl,
			abonent,
		};

		try {
			const res = await fetch(`/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData),
			});

			if (!res.ok) throw new Error('Ошибка отправки данных');
			location.reload();
		} catch (error) {
			console.error('Ошибка:', error);
		}
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
		<Textfield
			name="name"
			bind:value={formData.name}
			label="{$dicts['Имя'][lang]}:"
			required
		/>
		<Textfield
			type="password"
			name="psw"
			bind:value={formData.psw}
			label="{$dicts['Пароль'][lang]}:"
			required
		/>
		<Textfield
			type="password"
			name="confirmPassword"
			bind:value={formData.confirmPassword}
			label="{$dicts['Повторить пароль'][lang]}:"
			required
		/>
		{#if !passwordMatch}
			<p style="color: red;">{$dicts['Пароли не совпадают'][lang]}</p>
		{/if}
		<div>
			<input type="file" id="pic" on:change={uploadImage} accept="image/png, image/jpeg" hidden />
			<img src={formData.picture} alt="Avatar" on:click={() => document.getElementById('pic').click()} />
		</div>
		<Button type="submit" disabled={!passwordMatch}>
			{$dicts['Зарегистрироваться'][lang]}
		</Button>
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
		max-width: 600px; /* Широкая форма */
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #fff;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
