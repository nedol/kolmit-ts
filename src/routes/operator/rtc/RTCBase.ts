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

	onIceStateChange(pc, event) {
		if (pc && pc.con !== null) {
			if (pc.con.iceConnectionState === 'new') {
				console.log(pc.pc_key + ' ICE state change event: new', this);
			}

			if (pc.con.iceConnectionState === 'checking') {
				console.log(pc.pc_key + ' ICE state change event: checking', this);
			}

			if (pc.con.iceConnectionState === 'disconnected') {
				console.log(pc.pc_key + ' ICE state change event: disconnected', this);
				pc.con.restartIce();
				pc.SendOffer();
			}

			if (pc.con.iceConnectionState === 'connected') {
				//this.signch.eventSource.close();
				clearTimeout(this.checking_tmr);
				console.log(pc.pc_key + ' ICE state change event: connected', this);
				this.main_pc = pc.pc_key;
				// call_but_status.set('active');
				// this.DC = new DataChannelOperator(this, pc);
			}

			if (pc.con.iceConnectionState === 'failed') {
				/* possibly reconfigure the connection in some way here */
				console.log(pc.pc_key + ' ICE state change event: failed', this);
				/* then request ICE restart */
				pc.con.restartIce();
			}

			if (pc.con.iceConnectionState === 'completed') {
				console.log(pc.pc_key + ' ICE state change event: completed', this);
			}
			console.log(pc.pc_key + ' ICE state change event: ' + event.type, this);
		}
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
			lifetimeDuration: this.conf.lifetimeDuration,
			rtcpMuxPolicy: 'require',
			bundlePolicy: 'balanced',
			iceServers: this.conf.stun.concat(this.conf.turn)
		};

		console.log('iceServers:', this.conf.stun.concat(this.conf.turn));

		if (this.pcPull[pc_key]) {
			if (this.DC && this.DC.dc) {
				this.DC.dc.close();
				this.DC = null;
			}
			if (this.pcPull[pc_key].con) {
				this.pcPull[pc_key].con.close();
				this.pcPull[pc_key].con = null;
			}
		}

		let params = {}; //this.pcPull[pc_key]?this.pcPull[pc_key].params:{};

		this.pcPull[pc_key] = null;
		this.pcPull[pc_key] = new Peer(this, pc_config, pc_key);
		this.pcPull[pc_key].signal = this.signal;
		this.pcPull[pc_key].params = params;

		// setTimeout(()=>{
		this.DC = new DataChannelOperator(this, this.pcPull[pc_key]);
		this.startTime = Date.now();
		cb();
		// },1000);
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
