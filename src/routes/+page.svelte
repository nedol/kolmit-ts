<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import Header from './Header.svelte';
  import { wss } from '$lib/js/stores.js';
  import Operator from './operator/Operator.svelte';
  import Login from './site/Login.svelte';
  import { SignalingChannel } from './signalingChannel.js';
  import { signal } from '$lib/js/stores.js';
  import { langs } from '$lib/js/stores.js';
  import { ice_conf } from '$lib/js/stores.js';
  import { dicts } from '$lib/js/stores.js';
  import { quiz_userst } from '$lib/js/stores.js';
  export let data;
  let operator, abonent, name, user_pic;

  $dicts = data.dict[0];

  function Init() {
    setContext('group', data.group);
    setContext('operator', data.operator[0]);
    setContext('abonent', data.abonent);

    (operator = data.operator[0].operator),
      (abonent = data.operator[0].abonent),
      (name = data.operator[0].name),
      (user_pic = data.operator ? data.operator[0].picture : '');

    $signal = new SignalingChannel(operator);

    // import wsConnector from './wsConnector.js';
    // $wss = new wsConnector(host.host_wss);

    $langs = data.operator[0].lang;

    $ice_conf = data.ice_conf;

    if (data.quiz_users) {
      $quiz_userst = data.quiz_users;
    }
  }

  if (data.operator) {
    Init();
  }

  onMount(async () => {
    // const script = document.createElement('script');
    // script.src =
    //   'https://code.responsivevoice.org/responsivevoice.js?key=n8TO6XTS';
    // script.async = true;
    // document.head.appendChild(script);

    // script.onload = () => {
    //   // Скрипт загружен и готов к использованию
    //   // Например, вы можете использовать responsiveVoice.speak()
    //   // responsiveVoice.enableEstimationTimeout = false;
    //   responsiveVoice.enableWindowClickHook();
    //   responsiveVoice.setDefaultVoice('Dutch Female');
    //   voicelist = true; //responsiveVoice.getVoices();
    // };
  });
</script>

<Header></Header>

{#if operator && data.group}
  <Operator {operator} {abonent} {name} />
{:else}
  <Login {operator} {abonent} {user_pic} />
{/if}
