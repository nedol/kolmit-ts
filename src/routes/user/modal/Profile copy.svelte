<script>
  import { getContext } from 'svelte';
  import loadImage from 'blueimp-load-image/js/load-image.js';
  import 'blueimp-load-image/js/load-image-scale.js';

  export let profile;
  export let selected;

  let form;
  let src = './assets/user.svg';
  let name;
  let email;
  let files;
  let avatar;
  let upload;

  $: if (files) {
    // Переменная `files` будет типа `FileList`, а не массивом:
    // https://developer.mozilla.org/ru/docs/Web/API/FileList
    console.log(files);
  }

  import { langs } from '../rtc/stores.ts';
  let lang = 'en';
  lang = $langs;

  import { dicts } from '../rtc/stores.ts';


  async function setForm(form) {
    // window.parent.document.body.append(document.getElementsByClassName('form-signin')[0]);
    window.parent.document.body.append(form);
    if (localStorage.getItem('kolmit_abonent')) {
      let item = JSON.parse(localStorage.getItem('kolmit_abonent'));
      name = item.name;
      email = item.email;
      src = item.src;
    }
  }

  async function OnChangeFile(e) {
    try {
      let data = await loadImage(
        e.target.files[0],
        function (img, data) {
          if (img.type === 'error') {
            console.error('Error loading image ');
          } else {
            src = img.toDataURL();
            window.parent.document.getElementById('avatar_img').src = src;
            window.parent.document.getElementById('avatar_input').value = src;
            // document.querySelectorAll('input[type=file]').attributes.changed = true;
          }
        },
        {
          orientation: true,
          maxWidth: 300,
          maxHeight: 300,
          minWidth: 100,
          minHeight: 50,
          canvas: true,
        }
      );
    } catch (ex) {}
  }

  function OnClickSend() {
    localStorage.setItem(
      'kolmit_abonent',
      JSON.stringify({ id: window.id, src: src, name: name, email: email })
    );
    selected = '';
    profile = false;
  }

  //TODO: import { createEventDispatcher } from 'svelte'
  //      const dispatch =  createEventDispatcher()
  //  ... dispatch('custom_event')

  function OnClickUpload() {
    let event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    // dispatch('notify')
    upload.dispatchEvent(event);
  }
</script>

<div
  class="form-signin"
  style="display:block; position:fixed;top:0"
  bind:this={form}
  use:setForm
>
  <style>
    input {
      border-width: 0;
    }

    .form-signin {
      background-color: white;
      max-width: 90%;
      /* max-height: 90%;            */
      border: 3px solid grey;
      padding: 10px;
      margin: 0 auto;
    }
    .form-signin .form-signin-heading,
    .form-signin .form-control {
      position: relative;
      height: auto;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      padding: 10px;
      font-size: 16px;
    }
    .form-signin .form-control:focus {
      z-index: 2;
    }
    .form-signin input[type='email'] {
      margin-bottom: -1px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
  </style>
  <div
    class="row"
    style="border-style: groove; border-radius:2px;border-color: #cbced2;padding: 10px"
  >
    <h2 class="form-signin-heading">{dict['How to introduce you?'][lang]}</h2>
    <div style="display:flex;flex-direction: column;">
      <div style="width:250px">
        <input
          type="text"
          id="name"
          class="form-control"
          placeholder={dict['input user name *'][lang]}
          required
          bind:value={name}
        />
      </div>
      <div style="flex: 1">
        <input
          type="email"
          id="email"
          class="form-control"
          placeholder={dict['input email address'][lang]}
          required
          bind:value={email}
          style="width:100%"
        />
      </div>
    </div>
    <div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <img
        {src}
        bind:this={avatar}
        id="avatar_img"
        alt="avatar"
        on:click={OnClickUpload}
        style="display: block;
                margin-left: auto;
                margin-right: auto;
                width: 40%;"
      />
      <div>
        <span
          style="display: block;
                position: absolute;
                display: block;
                left: 46px;
                bottom: 113px;
                font-weight: 200;
                font-size: x-small;">Upload photo...</span
        >
      </div>
      <input
        bind:this={upload}
        on:change={OnChangeFile}
        accept="image/png, image/jpeg"
        bind:files
        id="avatar"
        name="avatar"
        type="file"
        style="display: none"
      />
    </div>
    <div for="send_form">&nbsp;</div>
    <button id="send_form" class="btn btn-primary" on:click={OnClickSend}
      >{dict['Save and Close'][lang]}</button
    >
  </div>
</div>
