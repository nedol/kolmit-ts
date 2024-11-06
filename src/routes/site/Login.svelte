<script>
	import { onMount } from 'svelte';
	import { applyAction, deserialize } from '$app/forms';

	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import loadImage from 'blueimp-load-image/js/load-image.js';
	import 'blueimp-load-image/js/load-image-scale.js';
	// import SelectMenu from './SelectMenu.svelte';
	import { dicts } from '$lib/js/stores.js';
	

	let width, height, value, abonent;
	let formData = {
		name: '',//'WH',//
		email: '',//,'white@house.usa'
		psw: '',//'test',
		confirmPassword: '',//'test',
		picture: '',
		lang: 'ru',//'en'
	};

	if (!formData.picture) {
		formData.picture = '/assets/operator.svg';
	}

	let lang = 'en';
	$: if (lang) {
		formData.lang = lang;
	}

	let psw;
	let confirmPassword; // Поле для повторного ввода пароля
	let passwordMatch = true; // Переменная для проверки совпадения паролей

	onMount(async () => {
		let url = new URL(window.location.href);
		abonent = url.searchParams.get('abonent');
		formData.email = url.searchParams.get('user');
		// console.log(abonent);
		// if (url.searchParams.get('psw')) {
		// 	formData.name = url.searchParams.get('name');
		// 	formData.psw = url.searchParams.get('psw');
		// 	formData.email = url.searchParams.get('email');
		// 	formData.lang = url.searchParams.get('lang');
		// 	handleSubmit();
		// }
	});

	function uploadImage(event) {
		const file = event.target.files[0];
		if (file) {
			loadImage(
				file,
				function (img, data) {
					if (img.type === 'error') {
						console.error($dicts['Ошибка загрузки изображения'][lang]);
					} else {
						width = img.width;
						height = img.height;
						formData.picture = img.toDataURL();
					}
				},
				{
					orientation: true,
					maxWidth: 100,
					maxHeight: 100,
					canvas: true
				}
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

<form on:submit|preventDefault={handleSubmit}>
	<div class="columns margins">
		<input name="lang" value={formData.lang} hidden />
		<div>
			<Textfield
				name="email"
				bind:value={formData.email}
				label="{$dicts['Email'][lang]}:"
				required
			/>
		</div>

		<div>
			<Textfield
				type="text"
				name="name"
				bind:value={formData.name}
				label="{$dicts['Имя'][lang]}:"
				required
			/>
		</div>

		<div>
			<Textfield
				type="password"
				name="psw"
				bind:value={formData.psw}
				label="{$dicts['Пароль'][lang]}:"
				required
			/>
		</div>

		<div>
			<Textfield
				type="password"
				name="confirmPassword"
				bind:value={formData.confirmPassword}
				label="{$dicts['Повторить пароль'][lang]}:"
				required
			/>
		</div>

		<div style="padding-top: 20px">
			<input type="file" id="pic" on:change={uploadImage} accept="image/png, image/jpeg" />

			<img
				type="image"
				id="oper_pic"
				src={formData.picture}
				on:click={() => document.getElementById('pic').click()}
			/>
		</div>

		<div>
			<Button class="upload-button">{$dicts['Зарегистрироваться'][lang]}</Button>
		</div>
	</div>
</form>
<!-- <SelectMenu bind:lang /> -->

{#if !passwordMatch}
	<p style="color: red;">{$dicts['Пароли не совпадают'][lang]}</p>
{/if}



<style>
	/* Стили для мобильных устройств */

	/* Стили для более крупных экранов */
	@media screen and (min-width: 768px) {
		/* Ваши стили для более крупных экранов здесь */
		button {
			padding: 6px 10px;
			font-size: 14px;
		}

		input {
			padding: 8px;
			font-size: 14px;
		}
	}
	/* Стили для мобильных устройств */
	@media screen and (max-width: 767px) {
		button {
			padding: 6px 10px;
			font-size: 14px;
		}

		input {
			padding: 8px;
			font-size: 14px;
		}
	}

	/* CSS стили для формы регистрации */
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #fff;
	}

	img {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}

	label {
		font-weight: bold;
		margin-top: 10px;
	}

	input[type='email'],
	input[type='text'],
	input[type='psw'] {
		width: 100%;
		padding: 10px;
		margin: 5px 0;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	input[type='file'] {
		display: none;
	}

	.container {
		text-align: center;
		margin-top: 10px;
	}

	#oper_pic {
		max-width: 100px;
		max-height: 100px;
		border-radius: 50%;
		cursor: pointer;
	}

	.upload-button {
		background-color: #0078d4;
		color: #fff;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		margin-top: 10px;
	}
</style>
