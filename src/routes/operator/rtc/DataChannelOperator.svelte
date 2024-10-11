<script>
  import { onMount, onDestroy } from 'svelte';
  import { msg_oper, dc_oper, dc_oper_state } from '$lib/js/stores';

  export let rtc;
  export let pc;

  let dc; // DataChannel instance
  let cnt_call = 0;
  let data = '';
  let receiveBuffer = [];
  let receivedSize = 0;

  function initializeDataChannel() {
    dc = pc.con.createDataChannel(pc.pc_key + ' data channel', { reliable: true });

    dc.onopen = () => {
      dc_oper.set(dc);
      if (dc.readyState === 'open') {
        console.log(pc.pc_key + ' datachannel open');
        dc_oper_state.set(dc.readyState);

        dc.onclose = () => {
          dc_oper_state.set("close");
          rtc.SendStatus('close');
        };

        dc.onerror = () => {
          dc_oper_state.set("close");
          rtc.SendStatus('close');
        };
      }
    };

    pc.con.ondatachannel = (event) => {
      console.log('Receive Channel Callback');
      dc = event.channel;
    };

    dc.onmessage = async (event) => {
      handleIncomingMessage(event);
    };

    pc.StartEvents();
  }

  async function handleIncomingMessage(event) {
    try {
      let parsed = JSON.parse(event.data);
      if (parsed.type === 'eom' && parsed.from !== 'oper') {
        if (data) {
          await msg_oper.set(JSON.parse(data));
        }
        data = '';
        return;
      }
      data += parsed.slice;
      if (parsed.type === 'eof' && parsed.from !== 'oper') {
        const received = new Blob(receiveBuffer);
        receiveBuffer = [];
        receivedSize = 0;
        if (confirm('Получен файл: ' + parsed.file + '. Сохранить?')) {
          let downloadHref = document.getElementById('download_href');
          downloadHref.textContent = 'Получен файл: ' + parsed.file;
          downloadHref.href = URL.createObjectURL(received);
          downloadHref.download = parsed.file;
          downloadHref.click();
        }
      }
    } catch (ex) {
      data = '';
      if (!event.data.byteLength) return;
    }
  }

  function sendFile(data, name) {
    if (dc.readyState === 'open') {
      let size = 16384;
      const numChunks = Math.ceil(data.byteLength / size);

      dc.send(JSON.stringify({ file: name, length: data.byteLength }));
      for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        const slice = data.slice(o, o + size);
        dc.send(slice);
      }

      dc.send(JSON.stringify({ type: 'eof', file: name, length: data.byteLength, from: 'oper' }));
    }
  }

  function sendData(data, cb) {
    if (dc.readyState === 'open') {
      data = JSON.stringify(data);
      let size = 16384;
      const numChunks = Math.ceil(data.length / size);

      for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        dc.send(JSON.stringify({ slice: data.substr(o, size), from: 'oper' }));
      }
      dc.send(JSON.stringify({ type: 'eom', from: 'oper' }));

      if (cb) cb();
    }
  }

  function sendDCHangup(cb) {
    let par = { proj: 'kolmit', func: 'mute', type: rtc.type };
    sendData(par, cb);
  }

  function sendDCClose(cb) {
    let par = { proj: 'kolmit', func: 'close', type: rtc.type };
    sendData(par, cb);
  }

  function sendDCTalk(cb) {
    let par = { proj: 'kolmit', func: 'talk', type: rtc.type };
    sendData(par, cb);
  }

  function sendDCOffer(key, msg) {
    let par = {
      proj: 'kolmit',
      func: 'offer',
      desc: pc.params['loc_desc'],
      cand: pc.params['loc_cand'],
      trans: key,
      abonent: rtc.abonent,
      msg: msg,
    };
    sendData(par);
  }

  function sendDCVideoOK(cb) {
    let par = { proj: 'kolmit', func: 'video', type: rtc.type };
    sendData(par, cb);
  }

  function sendRedirect(abonent, resolve) {
    let par = { proj: 'kolmit', func: 'redirect', abonent: abonent };
    if (dc.readyState === 'open') {
      sendData(par);
      let dateStr = new Date().toLocaleString('es-CL');
      resolve(dateStr);
    }
  }

  onMount(() => {
    initializeDataChannel();
  });

  onDestroy(() => {
    if (dc) {
      dc.close();
    }
  });
</script>

<div>
  <!-- Здесь можно добавить визуальные элементы или кнопки для взаимодействия с каналом данных -->
  <a id="download_href" style="display: none;"></a>
</div>
