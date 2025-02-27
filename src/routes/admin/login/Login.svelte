<script lang="ts">
  import { onMount } from 'svelte';
  import { applyAction, deserialize } from '$app/forms';
  import Button from '@smui/button';
  import Textfield from '@smui/textfield';

  import { langs , dicts } from '$lib/stores.ts';

  // let operator_svg =
  // 	'https://kolmit-service.onrender.com/_app/immutable/assets/operator.7238a518.svg';

  export let email, abonent: any;

  let width, height, value;
  let formData = {
    func:'',
    name: '',
    email: '',
    psw: '',
    confirmPassword: '',
    picture: '',
    lang: $langs,
  };

  if (!formData.picture) {
    formData.picture = '/assets/operator.svg';
  }

  let psw;
  let confirmPassword; // Поле для повторного ввода пароля
  let passwordMatch = true; // Переменная для проверки совпадения паролей

  onMount(async () => {
    let url = new URL(window.location.href);
    abonent = url.searchParams.get('abonent');
    // console.log(abonent);
    // if (url.searchParams.get('psw')) {
    // 	formData.name = url.searchParams.get('name');
    // 	formData.psw = url.searchParams.get('psw');
    // 	formData.email = url.searchParams.get('email');
    // 	formData.lang = url.searchParams.get('lang');
    // 	handleSubmit();
    // }
  });

  async function handleSubmit() {
    // Здесь вы можете обработать данные формы
    let par = formData;
    par.email = par.email.trim();
    passwordMatch = par.confirmPassword === par.psw;
    if (!passwordMatch) return;
    par.func = 'operator';
    par.lang = $langs;
    const headers = {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`
    };
    let res = await fetch(`./admin/login`, {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify({ par }),
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        location.href =
          location.origin +
          location.pathname +
          '?abonent=' +
          data.resp.operator;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }
</script>

<!-- {@debug $dicts} -->

<form on:submit|preventDefault={handleSubmit}>
  <div class="columns margins">
    <div>
      <Textfield
        bind:value={formData.email}
        label="{$dicts['Email',$langs]}:"
        required
      />
    </div>

    <div>
      <Textfield
        type="text"
        name="name"
        bind:value={formData.name}
        label="{$dicts['Имя'][$langs]}:"
        required
      />
    </div>

    <div>
      <Textfield
        type="password"
        name="psw"
        bind:value={formData.psw}
        label="{$dicts['Пароль'][$langs]}:"
        required
      />
    </div>

    <div>
      <Textfield
        type="password"
        name="confirmPassword"
        bind:value={formData.confirmPassword}
        label="{$dicts['Повторить пароль'][$langs]}:"
        required
      />
    </div>

    <div>
      <Button class="upload-button">{$dicts['Sign In'][$langs]}</Button>
    </div>
  </div>
</form>

{#if !passwordMatch}
  <p style="color: red;">{$dicts['Пароли не совпадают'][$langs]}</p>
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
