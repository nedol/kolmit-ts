import { writable } from 'svelte/store';

import { DataChannel } from './DataChannel';
import { msg, dc, dc_state, posterst ,operatorst } from '$lib/js/stores.js';
import md5 from 'md5';


let oper;
operatorst.subscribe((data) => {
  oper = data;
});


let poster;
posterst.subscribe((data) => {
  poster = data;
});


export class DataChannelOperator {

	constructor(rtc,pc){
        this.rtc = rtc;
        this.pc = pc;
        this.call_num = 3;
        this.forward;

		let that = this;
		that.cnt_call = 0;
		// this.dc.onopen = () => {
		//     console.log('OnOpenDataChannel');
		// }

		pc.con.onconnectionstatechange = function (e) {
			console.log('onconnectionstatechange');

		};

		this.dc = pc.con.createDataChannel(pc.pc_key + ' data channel', { reliable: true, ordered:true });

		this.dc.onopen = () => {
			//this.dc.onopen = null;
			dc.set(this);
			if (that.dc.readyState === 'open') {
				console.log(that.pc.pc_key + ' datachannel open');
				dc_state.set(that.dc.readyState);

				this.dc.onclose = () => {
					// msg.set({ func: 'mute' });
					dc_state.set("close");					
					rtc.SendStatus('close');
				};

				this.dc.onerror = () => {
					// msg.set({ func: 'mute' });
					dc_state.set("close");
					rtc.SendStatus('close');
				};
			}
		};

		pc.StartEvents();

		pc.con.ondatachannel = (event) => {
			console.log('Receive Channel Callback');

			this.dc = event.channel; //change dc
		};

		let data = '';
		let receiveBuffer = [];
		let receivedSize = 0;
		// this.dc.removeEventListener("message",this.dc.onmessage);
		this.dc.onmessage = async (event) => {
			try {
				// debugger;
				let parsed = JSON.parse(event.data);
		
				if (parsed.type === 'eom') {
					if (parsed.received) {
						console.log(parsed.received);
					}
					if (parsed.hash) {						
						setTimeout(() => {
							this.dc.send(JSON.stringify({ type: 'eom', received: parsed.hash }));
						}, 0);	
					}
					if (data) {
						//that.rtc.OnMessage(JSON.parse(data), that);			
				
						setTimeout(() => {
							try {
								if(data)
								msg.set(JSON.parse(data));
								// msg.set('');
							} catch (error) {
								console.error('Msg ошибка:', error);
							}
							data = '';
						
						}, 0);
					}
					
					return;
						
				}
				data += parsed.slice;
				if (parsed.file) {
					// document.getElementById('dataProgress').attributes.max = parsed.length;
				}
				if (parsed.type === 'eof') {
					const received = new Blob(receiveBuffer);
					receiveBuffer = [];

					receivedSize = 0;
					if (
						confirm('Получен файл: ' + parsed.file + '. Размер: ' + parsed.length + ' Сохранить?')
					) {
						let download_href = document.getElementById('download_href');
						download_href.text(
							'Получен файл: ' + parsed.file + '. Размер: ' + parsed.length + ' Сохранить?'
						);
						download_href.attributes.href = 'URL.createObjectURL(received)';
						download_href.attributes.download = parsed.file;
						download_href.click();
					}
					// setTimeout(function () {
					// 	document.getElementById('dataProgress').style.display = 'none';
					// }, 2000);

					return;
				}
			} catch (ex) {
				data = '';
				if (!event.data.byteLength) return;
			}
		};
	}
	

	SendData(data, cb) {
		// if(this.forward){
		//     data.email = this.forward;
		//     this.forward = '';
		//     data.func = 'answer';
		// }
		try {
			if (this.dc.readyState === 'open') {
				data = JSON.stringify(data);
				let size = 16384;
				const numChunks = Math.ceil(data.length / size);

				for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
					this.dc.send(JSON.stringify({ slice: data.substr(o, size),from:'oper' }));
				}
				this.dc.send(JSON.stringify({ type: 'eom', hash: md5(data)  }));
				
			}

			if (cb) cb();
		} catch (ex) {
			console.log(ex);
		}
	}

	// SendDCCnt(){
	//     let that = this;
	//     let par = {};
	//     par.proj = 'kolmit';
	//     par.uid = that.rtc.uid;
	//     par.func = 'cnt';
	//     par.call = that.rtc.call_num;
	//     par.type = that.rtc.type;
	//     par.email = that.rtc.email.from;
	//     par.profile = localStorage.getItem("kolmi_abonent");

	//     if(that.dc.readyState==='open') {
	//         that.SendData(par);

	//         //that.rtc.pcPull[that.rtc.main_pc].params['loc_cand'] = [];
	//     }

	//     that.rtc.PlayCallCnt();
	// }

	SendFile(data, name) {
		// if(this.forward){
		//     data.email = this.forward;
		//     this.forward = '';
		//     data.func = 'answer';
		// }
		try {
			if (this.dc.readyState === 'open') {
				let size = 16384;
				const numChunks = Math.ceil(data.byteLength / size);

				this.dc.send(JSON.stringify({ file: name, length: data.byteLength }), function (data) {
					console.log(data);
				});
				for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
					const slice = data.slice(o, o + size);
					// document.getElementById('dataProgress').attributes.value = o + size;
					this.dc.send(slice, function (data) {
						console.log(data);
					});
				}
				// setTimeout(function () {
				// 	document.getElementById('dataProgress').style.display = 'none';
				// }, 2000);

				this.dc.send(
					JSON.stringify({ type: 'eof', file: name, length: data.byteLength, from: 'oper' }),
					function (data) {
						console.log(data);
					}
				);
			}
		} catch (ex) {
			console.log(ex);
		}
	}


  SendDCCall() {
    let that = this;
    let par = {};
    par.func = 'call';
	par.call = that.rtc.call_num;	  

    par.profile = {
      email: this.rtc.operator,
      name: this.rtc.name,
      img: this.rtc.poster
    };

    if (that.dc.readyState === 'open') {
      that.SendData(par);

      //that.rtc.pcPull[that.rtc.main_pc].params['loc_cand'] = [];
    }

    // that.rtc.OnOpenDataChannel();
  }

    CloseDC(){
		setTimeout(()=>{
			this.dc.close();
			this.rtc.ClosePull()
		},100)		
	}

	SendDCHangup(cb) {
		let par = {};
		par.proj = 'kolmit';
		par.func = 'mute';
		par.type = this.rtc.type;

		this.SendData(par, cb);
	}

	SendDCClose(cb) {		
		let par = {};
		par.proj = 'kolmit';
		par.func = 'close';
		par.type = this.rtc.type;

		this.SendData(par, cb);
	}

	SendDCTalk(cb) {
		let par = {};
		par.proj = 'kolmit';
		par.func = 'talk';
		par.type = this.rtc.type;

		this.SendData(par, cb);
	}

	SendDCCand(cand, key, msg) {
		let par = {};
		par.proj = 'kolmit';
		par.func = 'offer';
		par.cand = cand;
		par.trans = key;
		par.abonent = this.rtc.abonent;
		par.msg = msg;

		this.SendData(par);
	}

	SendDCDesc(desc, key, msg) {
		let par = {};
		par.proj = 'kolmit';
		par.func = 'offer';
		par.desc = desc;
		par.trans = key;
		par.abonent = this.rtc.abonent;
		par.msg = msg;

		this.SendData(par);
	}

	SendDCOffer(key, msg) {
		let par = {};
		par.proj = 'kolmit';
		par.func = 'offer';
		par.desc = this.pc.params['loc_desc'];
		par.cand = this.pc.params['loc_cand'];
		par.trans = key;
		par.abonent = this.rtc.abonent;
		par.msg = msg;

		this.SendData(par);
	}

	SendDCVideoOK(cb) {
		let par = {};
		par.proj = 'kolmit';
		par.func = 'video';
		par.type = this.rtc.type;

		this.SendData(par, cb);
	}

	SendRedirect(abonent, resolve) {
		let par = {};
		par.proj = 'kolmit';
		par.func = 'redirect';
		par.abonent = abonent;

		if (this.dc.readyState === 'open') {
			this.SendData(par);
			// this.rtc.OnMessage({func: 'mute'});
			let date_str = new Date().toLocaleString('es-CL');
			resolve(date_str);
		}
	}
}
