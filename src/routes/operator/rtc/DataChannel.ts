import { writable } from 'svelte/store';
import { operatorst, dc, dc_state, posterst, msg } from '$lib/stores.ts';

interface FileData {
  file: string;
  length: number;
  from: string;
}

interface MessageData {
  slice?: string;
  from: string;
  type?: string;
}

export class DataChannel {
  private rtc: any;
  private pc: any;
  private call_num: number;
  private type: string;
  private forward: any;
  private data: string;
  private receiveBuffer: Blob[];
  private receivedSize: number;
  private dc: RTCDataChannel;
  
  constructor(rtc: any, pc: any) {
    this.rtc = rtc;
    this.pc = pc;
    this.call_num = 3;
    this.type = 'user'; // Убедитесь, что type имеет значение
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
    pc.con.ondatachannel = (event: { channel: RTCDataChannel }) => {
      console.log('Receive Channel Callback');
      this.dc = event.channel;
      this.dc.onopen = () => this.onOpen();
    };
  }

  private onOpen(): void {
    if (this.type === 'user') {
      dc.set(this);
      dc_state.set('open');
    }
    console.log(`${this.pc.pc_key} datachannel open`);
  }

  private onMessage(event: MessageEvent): void {
    try {
      let parsed: MessageData = JSON.parse(event.data);
      if (parsed.type === 'eom' && parsed.from !== this.type) {
        this.handleEndOfMessage();
        return;
      }
      this.data += parsed.slice || '';
      if (parsed.type === 'eof' && parsed.from !== this.type) {
        this.handleFileReceived(parsed);
        return;
      }
    } catch (ex) {
      console.log(ex);
      if (!event.data.byteLength) return;
    }
  }

  private handleEndOfMessage(): void {
    msg.set(JSON.parse(this.data));
    setTimeout(() => {
      msg.set('');
      this.data = '';
    }, 100);
  }

  private handleFileReceived(parsed: MessageData): void {
    const received = new Blob(this.receiveBuffer);
    this.receiveBuffer = [];
    this.receivedSize = 0;
    if (confirm(`Получен файл: ${parsed.file}. Размер: ${parsed.length}. Сохранить?`)) {
      let download_href = document.getElementById('download_href') as HTMLAnchorElement;
      download_href.textContent = `Получен файл: ${parsed.file}. Размер: ${parsed.length}. Сохранить?`;
      download_href.href = URL.createObjectURL(received);
      download_href.download = parsed.file || 'file';
      download_href.click();
    }
  }

  private onClose(): void {
    dc_state.set('close');
    this.rtc.SendStatus('close');
  }

  private onError(): void {
    this.onClose();
  }

  public SendData(data: any, cb?: () => void): void {
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

  public SendFile(data: Blob, name: string, resolve: () => void): void {
    try {
      if (this.dc.readyState === 'open') {
        const size = 16384;
        const numChunks = Math.ceil(data.size / size);
        this.dc.send(JSON.stringify({ file: name, length: data.size, from: this.type }));
        for (let i = 0, o = 0; i < numChunks; i++, o += size) {
          const slice = data.slice(o, o + size);
          this.dc.send(slice);
        }
        this.dc.send(JSON.stringify({ type: 'eof', file: name, length: data.size, from: this.type }));
        resolve();
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  private SendDCCall(): void {
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
