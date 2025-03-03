import { Peer } from './Peer';
import { DataChannelOperator } from './DataChannelOperator';
import md5 from 'md5';
import { ice_conf } from '$lib/ice_conf';

import { call_but_status } from '$lib/stores.ts';

export class RTCBase {
	constructor(operator, name, signal) {
		this.signal = signal;
		this.abonent = operator.abonent;
		this.operator = operator.operator;
		this.name = name;
		this.target = '';
		this.status;

		this.pcPull = {};
		this.main_pc;

		this.url;
		this.localStream;
		this.remoteStream;

		this.startTime;

		this.phone = '';

		// this.vr = new VideoRecorder();
		// this.vr.open();
	}


	SendVideoOffer(key) {
		this.pcPull[key].params['loc_desc'] = '';
		this.pcPull[key].params['loc_cand'] = '';

		this.pcPull[key].con
			.createOffer(
				(this.mode = {
					offerToReceiveAudio: 1,
					offerToReceiveVideo: 1,
					iceRestart: 1
				})
			)
			.then(
				(desc) => this.pcPull[key].onCreateVideoOfferSuccess(desc),
				this.pcPull[key].onCreateOfferError
			);
	}


	TransFile() {
		async function handleFileInputChange() {
			const file = this.fileInput.files[0];
			if (!file) {
				console.log('No file chosen');
			} else {
				// sendFileButton.disabled = false;
			}
			if (file.size === 0) {
				return;
			}
			dataProgress.style.display = 'block';
			dataProgress.attributes.max = file.size;

			let fileReader = new FileReader();
			fileReader.onload = (e) => {
				console.log('FileRead.onload ', e);
				this.DC.SendFile(e.target.result, file.name);
			};
			fileReader.readAsArrayBuffer(file);
		}
		this.fileInput.removeEventListener('change', this.fileInput.onchange);
		this.fileInput.onchange = handleFileInputChange;
		this.fileInput.dispatchEvent(new Event('click'));
	}

	GetUserMedia(opts, cb) {
		let that = this;
		navigator.mediaDevices
			.getUserMedia(opts)
			.then((stream) => this.gotStream(stream, cb))
			.catch(function (e) {
				if (e.name === 'NotFoundError' || e.name === 'NotReadableError') {
					if (opts.audio) alert('Something wrong with mic?');
					if (opts.video) alert('Something wrong with camera?');

					cb(false);
				}
			});
	}

	get RemoteStream() {
		return this.remoteStream;
	}

	async InitRTC(pc_key, cb) {
		this.conf = ice_conf;
		try {
			// let res = fetch(this.signch.host.host_server+'kolmit/users/'+this.email+'/ice_conf.json');
			// this.conf = (await (await res).json());
		} catch (ex) {}
	
		let pc_config = {
			iceTransportPolicy: 'all',
			rtcpMuxPolicy: 'require',
			bundlePolicy: 'balanced',
			iceServers: this.conf.stun.concat(this.conf.turn)
		};
	
		console.log('iceServers:', this.conf.stun.concat(this.conf.turn));
	
		if (this.pcPull[pc_key]) {
			if (this.pcPull[pc_key].con) {
				console.log("Закрываем старое соединение...");
				this.pcPull[pc_key].con.getSenders().forEach(sender => this.pcPull[pc_key].con.removeTrack(sender));
				this.pcPull[pc_key].con.close();
			}
			if (this.DC && this.DC.dc) {
				console.log("Закрываем старый DataChannel...");
				this.DC.dc.close();
			}
			this.pcPull[pc_key] = null;
			this.DC = null;
		}
	
		let params = {}; // Очищаем параметры старого соединения
	
		console.log("Создаём новый PeerConnection...");
		this.pcPull[pc_key] = new Peer(this, pc_config, pc_key);
		this.pcPull[pc_key].signal = this.signal;
		this.pcPull[pc_key].params = params;
	
		try {
			// Подождем, пока соединение установится
			await this.waitForConnection(this.pcPull[pc_key]);
	
			// Теперь создаем DataChannel
			this.DC = new DataChannelOperator(this, this.pcPull[pc_key]);
			this.startTime = Date.now();
			console.log("Новое соединение и DataChannel готовы!");
	
			// Вызываем коллбек
			cb();
		} catch (error) {
			console.error('Ошибка при установке нового соединения:', error);
		}
		
	}

	// Утилита для ожидания установления соединения
	waitForConnection(pc) {
		return new Promise((resolve, reject) => {
			// Слушаем изменения состояния соединения
			const checkConnection = () => {
				if (pc.con.signalingState === 'stable') {
					resolve();
				} else {
					setTimeout(checkConnection, 100);
				}
			};
			checkConnection();
		});
	}
	
	gotStream(stream, cb) {
		//log('Received local stream', this);

		if (!this.localStream) this.localStream = stream;

		this.getTracks(stream, cb);
	}

	getTracks(stream, cb) {
		stream.getTracks().forEach((track) => {
			for (let key in this.pcPull) {
				if (key === 'reserve') continue;
				if (
					this.pcPull[key].con.iceConnectionState === 'disconnected' ||
					this.pcPull[key].con.iceConnectionState === 'closed'
				)
					continue;

				this.localStream.addTrack(track);
				this.pcPull[key].sender = this.pcPull[key].con.addTrack(track, this.localStream);

				if (track.kind === 'video') {
					this.SetLocalVideo(this.localStream);
				} else if (track.kind === 'audio') {
					//this.remoteAudio.srcObject = null;
					//this.localSound.srcObject = this.localStream;
				}
			}
		});

		var videoTracks = this.localStream.getVideoTracks();
		var audioTracks = this.localStream.getAudioTracks();

		if (videoTracks.length > 0) {
			console.log('Using video device: ' + videoTracks[0].label, this);
		}
		if (audioTracks.length > 0) {
			console.log('Using audio device: ' + audioTracks[0].label, this);
		}
		cb(true);
	}

	RemoveTracks() {
		if (this.localStream) {
			const videoTracks = this.localStream.getVideoTracks();
			videoTracks.forEach((videoTrack) => {
				if (videoTrack.readyState == 'live' && videoTrack.kind === 'video') {
					videoTrack.stop();
				}

				this.localStream.removeTrack(videoTrack);
			});
			const audioTracks = this.localStream.getAudioTracks();
			audioTracks.forEach((audioTrack) => {
				if (audioTrack.readyState == 'live' && audioTrack.kind === 'audio') {
					audioTrack.stop();
				}
				this.localStream.removeTrack(audioTrack);
			});
		}
	}

	ClosePull(){
		Object.keys(this.pcPull).map((key)=>{
			this.pcPull[key].con.close()
		})
	}
}
