<script>
	import { onMount } from 'svelte';
	import { dicts } from '$lib/stores.ts';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import loadImage from 'blueimp-load-image/js/load-image.js';
	import { Translate } from '../translate/Transloc.ts';
	import { langs } from '$lib/stores.ts';
  
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
	let translated = {};
  
	$: formData.lang = lang;
	$: passwordMatch = formData.psw === formData.confirmPassword;
  
	onMount(async () => {
	  let url = new URL(window.location.href);
	  abonent = url.searchParams.get('abonent');
	  lvl = url.searchParams.get('lvl');
	  formData.email = url.searchParams.get('user');
  
	  // Fetch translations once
	  translated.nameLabel = await Translate('Имя', 'ru', $langs);
	  translated.passwordLabel = await Translate('Пароль', 'ru', $langs);
	  translated.confirmPasswordLabel = await Translate('Повторить пароль', 'ru', $langs);
	  translated.registrationLabel = await Translate('Зарегистрироваться', 'ru', $langs);
	});
  
	function uploadImage(event) {
	  const file = event.target.files[0];
	  if (file) {
		loadImage(file, (img) => {
		  if (img.type === 'error') {
			console.error($dicts['Ошибка загрузки изображения'][lang]);
			alert('Error loading image');
		  } else {
			formData.picture = img.toDataURL();
		  }
		}, { orientation: true, maxWidth: 100, maxHeight: 100, canvas: true });
	  } else {
		alert('No file selected');
	  }
	}
  
	async function handleSubmit() {
	  let par = formData;
	  par.email = par.email.trim();
	  if (!passwordMatch) return;
	  par.func = 'operator';
	  par.lvl = lvl;
	  par.abonent = abonent;
	  
	  const res = await fetch(`/`, {
		method: 'POST',
		body: JSON.stringify({ par }),
		headers: { 'Content-Type': 'application/json' },
	  });
	  
	  if (res.ok) {
		alert('Registration successful');
	  } else {
		alert('Something went wrong');
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
		label="{translated.nameLabel}"
		required
	  />
	  <Textfield
		type="password"
		name="psw"
		bind:value={formData.psw}
		label="{translated.passwordLabel}"
		required
	  />
	  <Textfield
		type="password"
		name="confirmPassword"
		bind:value={formData.confirmPassword}
		label="{translated.confirmPasswordLabel}"
		required
	  />
	  {#if !passwordMatch}
	  	{#await Translate('Пароли не совпадают','ru',$langs)  then data }
		  <p style="color: red;">{data}</p>
		{/await}

	  {/if}
	  <div>
		<input type="file" id="pic" on:change={uploadImage} accept="image/png, image/jpeg" hidden />
		<img src={formData.picture} alt="Avatar" on:click={() => document.getElementById('pic').click()} />
	  </div>
	  <Button type="submit" disabled={!passwordMatch}>
		{translated.registrationLabel}
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
