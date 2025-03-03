import { writable } from 'svelte/store';
import { DataChannel } from './DataChannel';
import { msg, dc, dc_state, posterst, operatorst } from '$lib/stores';
import md5 from 'md5';

// Define types for RTC and PC (you can refine these based on your RTC and PC structures)
interface RTC {
  uid: string;
  call_num: number;
  type: string;
  email: { from: string };
  operator: string;
  name: string;
  poster: string;
  abonent: string;
  OnMessage: (data: any, operator: DataChannelOperator) => void;
  SendStatus: (status: string) => void;
  PlayCallCnt: () => void;
  ClosePull: () => void;
}

interface PC {
  pc_key: string;
  con: RTCPeerConnection;
  params: { loc_desc: any; loc_cand: any[] };
  StartEvents: () => void;
}

let oper: any;
operatorst.subscribe((data) => {
  oper = data;
});

let poster: any;
posterst.subscribe((data) => {
  poster = data;
});

export class DataChannelOperator {
  rtc: RTC;
  pc: PC;
  call_num: number;
  forward?: string;
  cnt_call: number = 0;
  dc: RTCDataChannel;

  constructor(rtc: RTC, pc: PC) {
    this.rtc = rtc;
    this.pc = pc;
    this.call_num = 3;
    this.dc = pc.con.createDataChannel(pc.pc_key + ' data channel', {
      maxRetransmits: 10, 
      ordered: false,
    });

    this.dc.onopen = () => {
      dc.set(this);
      if (this.dc.readyState === 'open') {
        console.log(this.pc.pc_key + ' datachannel open');
        dc_state.set(this.dc.readyState);

        this.dc.onclose = () => {
          dc_state.set('close');
          // rtc.SendStatus('close');
        };

        this.dc.onerror = () => {
          // dc_state.set('close');
          // rtc.SendStatus('close');
        };
      }
    };

    pc.StartEvents();

    pc.con.ondatachannel = (event) => {
      console.log('Receive Channel Callback');
      this.dc = event.channel; // change dc
    };

    let data = '';
    let receiveBuffer: BlobPart[] = [];
    let receivedSize = 0;

    
    this.dc.onmessage = async (event) => {
        try {
            const parsed = JSON.parse(event.data);
    
            if (parsed.type === 'eom') {
                if (parsed.received) {
                    console.log('Received:', parsed.received);
                }
                if (parsed.hash && this.dc.readyState ==='open') {
                    setTimeout(() => {
                        // Send acknowledgment
                        // this.dc.send(JSON.stringify({ type: 'ack', hash: parsed.hash }));
                    }, 10);
                }
                if (data) {
                    setTimeout(() => {
                        try {
                            if (typeof data === 'string') {
                                const parsedData = JSON.parse(data);
                                msg.set(parsedData); // Assuming msg.set() is defined elsewhere
                            } else {
                                console.error('Data is not a valid JSON string');
                            }
                        } catch (error) {
                            console.error('Msg parsing error:', error);
                        } finally {
                            data = ''; // Clear data
                        }
                    }, 0);
                }
                return;
            }
    
            // Accumulate data slices
            if (parsed.slice) {
                data += parsed.slice;
            }
    
            // Handle file metadata
            if (parsed.file) {
                console.log('File metadata received:', parsed.file);
            }
    
            // Handle end of file
            if (parsed.type === 'eof') {
                const received = new Blob(receiveBuffer);
                receiveBuffer = []; // Reset buffer
                receivedSize = 0; // Reset size
    
                if (confirm(`File received: ${parsed.file}. Size: ${parsed.length}. Save?`)) {
                    const downloadLink = document.getElementById('download_href');
                    if (downloadLink) {
                        downloadLink.textContent = `Download ${parsed.file}`;
                        downloadLink.href = URL.createObjectURL(received);
                        downloadLink.download = parsed.file;
                        downloadLink.click();
                    } else {
                        console.error('Download link element not found');
                    }
                }
                return;
            }
        } catch (error) {
            console.error('Error processing message:', error);
            data = ''; // Clear data on error
            if (!event.data.byteLength) return; // Skip binary data
        }
    };
  }

  SendData(data: any, cb?: () => void): void {
    try {
      if (this.dc.readyState === 'open') {
        data = JSON.stringify(data);
        let size = 16384;
        const numChunks = Math.ceil(data.length / size);

        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
          this.dc.send(JSON.stringify({ slice: data.substr(o, size), from: 'oper' }));
        }
        this.dc.send(JSON.stringify({ type: 'eom', hash: md5(data) }));
      }

      if (cb) cb();
    } catch (ex) {
      console.log(ex);
    }
  }

  SendFile(data: Blob, name: string): void {
    try {
      if (this.dc.readyState === 'open') {
        let size = 16384;
        const numChunks = Math.ceil(data.size / size);

        this.dc.send(JSON.stringify({ file: name, length: data.size }));
        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
          const slice = data.slice(o, o + size);
          this.dc.send(slice);
        }

        this.dc.send(
          JSON.stringify({ type: 'eof', file: name, length: data.size, from: 'oper' })
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  SendDCCall(): void {
    let par = {
      func: 'call',
      call: this.rtc.call_num,
      profile: {
        email: this.rtc.operator,
        name: this.rtc.name,
        img: this.rtc.poster,
      },
    };

    if (this.dc.readyState === 'open') {
      this.SendData(par);
    }
  }

  CloseDC(): void {
    setTimeout(() => {
      this.dc.close();
      this.rtc.ClosePull();
    }, 100);
  }

  SendDCHangup(cb?: () => void): void {
    let par = {
      proj: 'kolmit',
      func: 'mute',
      type: this.rtc.type,
    };
    this.SendData(par, cb);
  }

  SendDCClose(cb?: () => void): void {
    let par = {
      proj: 'kolmit',
      func: 'close',
      type: this.rtc.type,
    };
    this.SendData(par, cb);
  }

  SendDCTalk(cb?: () => void): void {
    let par = {
      proj: 'kolmit',
      func: 'talk',
      type: this.rtc.type,
    };
    this.SendData(par, cb);
  }

  SendDCCand(cand: any, key: string, msg: string): void {
    let par = {
      proj: 'kolmit',
      func: 'offer',
      cand,
      trans: key,
      abonent: this.rtc.abonent,
      msg,
    };
    this.SendData(par);
  }

  SendDCDesc(desc: any, key: string, msg: string): void {
    let par = {
      proj: 'kolmit',
      func: 'offer',
      desc,
      trans: key,
      abonent: this.rtc.abonent,
      msg,
    };
    this.SendData(par);
  }

  SendDCOffer(key: string, msg: string): void {
    let par = {
      proj: 'kolmit',
      func: 'offer',
      desc: this.pc.params.loc_desc,
      cand: this.pc.params.loc_cand,
      trans: key,
      abonent: this.rtc.abonent,
      msg,
    };
    this.SendData(par);
  }

  SendDCVideoOK(cb?: () => void): void {
    let par = {
      proj: 'kolmit',
      func: 'video',
      type: this.rtc.type,
    };
    this.SendData(par, cb);
  }

  SendRedirect(abonent: string, resolve: (date_str: string) => void): void {
    let par = {
      proj: 'kolmit',
      func: 'redirect',
      abonent,
    };

    if (this.dc.readyState === 'open') {
      this.SendData(par);
      let date_str = new Date().toLocaleString('es-CL');
      resolve(date_str);
    }
  }
}
