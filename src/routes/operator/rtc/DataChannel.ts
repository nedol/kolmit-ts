// Базовый класс для оператора и пользователя

import { writable } from 'svelte/store';
import { operatorst, dc, dc_state, posterst, msg } from '$lib/js/stores.js';

export class DataChannel {
  constructor(rtc, pc) {
    this.rtc = rtc;
    this.pc = pc;
    this.call_num = 3;
    this.type = type;
    this.forward = null;
    this.data = '';
    this.receiveBuffer = [];
    this.receivedSize = 0;

    // Общий data channel
    this.dc = pc.con.createDataChannel(`${pc.pc_key} data channel`, { reliable: true });

    this.dc.onopen = () => this.onOpen();
    this.dc.onmessage = (event) => this.onMessage(event);
    this.dc.onclose = () => this.onClose();
    this.dc.onerror = () => this.onError();

    pc.StartEvents();
    pc.con.ondatachannel = (event) => {
      console.log('Receive Channel Callback');
      this.dc = event.channel;
      this.dc.onopen = () => this.onOpen();
    };
  }

  onOpen() {
    if (this.type === 'user') {
      dc.set(this);
      dc_state.set('open');
    //   this.SendDCCall();
    }
    console.log(`${this.pc.pc_key} datachannel open`);
  }

  onMessage(event) {
    try {
      let parsed = JSON.parse(event.data);
      if (parsed.type === 'eom' && parsed.from !== this.type) {
        this.handleEndOfMessage();
        return;
      }
      this.data += parsed.slice;
      if (parsed.type === 'eof' && parsed.from !== this.type) {
        this.handleFileReceived(parsed);
        return;
      }
    } catch (ex) {
      console.log(ex);
      if (!event.data.byteLength) return;
    }
  }

  handleEndOfMessage() {

    msg.set(JSON.parse(this.data));
    setTimeout(() => {
      msg.set('');
      this.data = '';
    }, 100);
  }

  handleFileReceived(parsed) {
    const received = new Blob(this.receiveBuffer);
    this.receiveBuffer = [];
    this.receivedSize = 0;
    if (confirm(`Получен файл: ${parsed.file}. Размер: ${parsed.length}. Сохранить?`)) {
      let download_href = document.getElementById('download_href');
      download_href.textContent = `Получен файл: ${parsed.file}. Размер: ${parsed.length}. Сохранить?`;
      download_href.href = URL.createObjectURL(received);
      download_href.download = parsed.file;
      download_href.click();
    }
  }

  onClose() {
    dc_state.set('close');
    this.rtc.SendStatus('close');
  }

  onError() {
    this.onClose();
  }

  SendData(data, cb) {
    try {
      if (this.dc.readyState === 'open') {
        const serializedData = JSON.stringify(data);
        const size = 16384;
        const numChunks = Math.ceil(serializedData.length / size);
        for (let i = 0, o = 0; i < numChunks; i++, o += size) {
          this.dc.send(JSON.stringify({ slice: serializedData.substr(o, size), from: this.type }));
        }
        this.dc.send(JSON.stringify({ type: 'eom', from: this.type }));
      }
      if (cb) cb();
    } catch (ex) {
      console.log(ex);
    }
  }

  SendFile(data, name, resolve) {
    try {
      if (this.dc.readyState === 'open') {
        const size = 16384;
        const numChunks = Math.ceil(data.byteLength / size);
        this.dc.send(JSON.stringify({ file: name, length: data.byteLength, from: this.type }));
        for (let i = 0, o = 0; i < numChunks; i++, o += size) {
          const slice = data.slice(o, o + size);
          this.dc.send(slice);
        }
        this.dc.send(JSON.stringify({ type: 'eof', file: name, length: data.byteLength, from: this.type }));
        resolve();
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  SendDCCall() {
    let par = {
      proj: 'kolmit',
      uid: this.rtc.uid,
      func: 'call',
      call: this.rtc.call_num,
      type: this.rtc.type,
      email: this.rtc.email.from,
    };
    this.SendData(par);
  }
}