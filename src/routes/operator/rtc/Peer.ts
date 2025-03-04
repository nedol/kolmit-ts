// import {log} from './utils'n
  import { msg, signal} from '$lib/stores';

export class Peer {
	constructor(rtc, pc_config, pc_key) {
		this.con = new RTCPeerConnection(pc_config);
		this.signal;
		signal.subscribe((data) => {
			this.signal = data;	  
		  });
		this.rtc = rtc;
		this.pc_key = pc_key;
		this.params = {};
		this.pc_config = pc_config;
		this.answer = false;
	}

	async SendDesc(desc) {
		let that = this;
		let par = {};
		par.proj = 'kolmit';
		par.func = 'call';
		par.abonent = that.rtc.abonent;
		par.operator = this.rtc.operator;
		par.desc = desc; //.sdp.replace(/max-message-size:([0-9]+)/g, 'max-message-size:'+262144+'\r\n');
		par.status = 'call';

		return await this.signal.SendMessage(par);
	}

	async SendCand(cand) {
		let that = this;
		let par = {};
		par.proj = 'kolmit';
		par.func = 'call';
		par.operator = this.rtc.operator;
		par.cand = cand;
		par.status = 'call';
		par.abonent = that.rtc.abonent;

		return await this.signal.SendMessage(par);
	}

	async SendOffer() {
		let that = this;
		let par = {};
		par.proj = 'kolmit';
		par.func = 'offer';
		par.abonent = this.rtc.abonent;
		par.operator = this.rtc.operator;
		par.desc = this.params['loc_desc']; //.sdp.replace(/max-message-size:([0-9]+)/g, 'max-message-size:'+262144+'\r\n');
		par.cand = this.params['loc_cand'];
		par.status = 'offer';

		const res = await this.signal.SendMessage(par, (data) => {

		});
	
		return res;
	}


	StartEvents() {
		let that = this;
		this.con.ontrack = function (ev) {
			if (that.pc_key === 'reserve') {
				return;
			}

			if (that.rtc.GetRemoteVideo() !== ev.streams[0]) {
				that.rtc.remoteStream = ev.streams[0];
				//log('pc2 received remote stream', that);
				that.rtc.remoteStream.onaddtrack = function (ev) {
					console.log('addtrack in remote stream', that);
				};
			}

			if (that.rtc.remoteStream) {
				// if (ev.track.kind === 'audio') {
				// 	that.rtc.SetRemoteAudio(null);
				// 	that.rtc.SetRemoteAudio(that.rtc.remoteStream);
				// }
				// if (ev.track.kind === 'video') {
				that.rtc.SetRemoteVideo(null);
				that.rtc.SetRemoteVideo(that.rtc.remoteStream);

				// that.rtc.DC.SendDCVideoOK(() => {});
				// }
			}
		};

		let timr;

		this.con.onicecandidate = (e) => {
			let that = this;
			if (e.candidate) {
				if (e.candidate.type == 'relay') {
					console.log('The TURN server is reachable !');
				}
				if (!this.params['loc_cand']) this.params['loc_cand'] = [];
				this.params['loc_cand'].push(e.candidate);

				if(this.rtc.DC.dc?.readyState==='open'){
					this.rtc.DC.SendData({candidate:e.candidate});
				}

				if (!timr) {
					timr = setTimeout(() => {
						if (this.answer){
							this.rtc.SendAnswer();
							this.answer = false;
						} else{
							this.SendOffer();							
						}
						clearTimeout(timr);
					}, 1000);
				}
			}
		};

		this.con.oniceconnectionstatechange = function (e) {
			console.log('oniceconnectionstatechange');
			that.rtc.onIceStateChange(that, e);
		};
		this.con.onremovestream = function (e) {
			console.log('onsignalingstatechange');
		};
		this.con.onsignalingstatechange = function (e) {
			console.log('onsignalingstatechange');
		};
		this.con.onconnectionstatechange = function (e) {
			console.log('onconnectionstatechange');
			that.rtc.onIceStateChange(that, e);
		};
	}

	onCreateAnswerSuccess(desc) {
		let that = this;
		console.log('Answer from pcPull 2:' /* + desc.sdp*/, this);
		console.log('setLocalDescription start', that);
		this.answer = true;
		that.con.setLocalDescription(desc).then(function () {
			that.params['loc_desc'] = that.con.localDescription;
			console.log('onSetLocalDescriptionSuccess', that);
			// that.SendDesc(desc);
		}, that.onSetAnswerError);
	}

	setLocalDesc(desc) {
		let that = this;
		console.log('setLocalDescription start', that);
		console.log('Peer connectionState:' + this.con.connectionState, that);

		this.con.setLocalDescription(desc).then(
			function () {
				that.params['loc_desc'] = that.con.localDescription;
			},
			 (error)=> {
				console.log('Failed to set local description: ' + error.toString(), this);
				//  this.con.close();
				// this.con = new RTCPeerConnection(this.pc_config);
				// this.setRemoteDesc(desc); 
				// this.StartEvents(); 
			}
		);
	}


	setRemoteDesc(desc) {
		let that = this;
		console.log('setRemoteDescription start', that);
		console.log('Peer connectionState:' + this.con.connectionState, that);

		this.con.setRemoteDescription(desc).then(
			function () {
				that.params['rem_desc'] = that.con.remoteDescription;
				if (that.con.remoteDescription.type === 'offer') {
					that.con
						.createAnswer()
						.then((desc) => that.onCreateAnswerSuccess(desc), that.onCreateAnswerError);
				}
			},
			 (error)=> {
				console.log('Failed to set remote description: ' + error.toString(), this);
				//  this.con.close();
				// this.con = new RTCPeerConnection(this.pc_config);
				// this.setRemoteDesc(desc); 
				// this.StartEvents(); 
			}
		);
	}

	onCreateAnswerError(error) {
		console.log('Failed to create answer: ' + error.toString(), this);
		this.answer = false;
	}

	onCreateOfferSuccess(desc) {
		let that = this;
		console.log('Offer created' /* + desc.sdp*/, that);
		console.log('setLocalDescription start', that);

		that.con.setLocalDescription(desc).then(function () {
			that.params['loc_desc'] = that.con.localDescription;
			console.log(' setLocalDescription complete', that);
			// if(that.params['loc_cand'] && that.params['loc_cand'][0]) {
			//      that.SendOffer();
			// }
		}, that.onSetOfferError);
	}

	onCreateVideoOfferSuccess(desc, msg) {
		let that = this;
		console.log('Offer created' /* + desc.sdp*/, that);
		console.log('setLocalDescription start', that);

		that.con.setLocalDescription(desc).then(function () {
			that.params['loc_desc'] = that.con.localDescription;
			console.log(' setLocalDescription complete', that);
			that.rtc.DC.SendDCDesc(desc, that.pc_key);
		}, that.onSetOfferError);
	}

	onSetOfferError(error) {
		console.log('Failed to set offer: ' + error.toString(), this);
	}

	onSetAnswerError(error) {
		console.log('Failed to set session description: ' + error.toString(), this);
	}

	onAddIceCandidateSuccess(pc) {
		console.log(' addIceCandidate success', this);
	}

	onAddIceCandidateError(pc, error) {
		console.log(' failed to add ICE Candidate: ' + error.toString(), this);
	}

	onCreateOfferError(error) {
		console.log('Failed to create session description: ' + error.toString(), this);
	}

	onAddVideo(ev) {
		let that = this;
		let msg = 'Do you mind to turn on the cameras?';
		//log("Send message to confirm:"+msg, that);
		if (that.rtc.DC && that.rtc.DC.dc.readyState === 'open') {
			that.rtc.DC.SendData({ confirm: msg });
		}
	}

	onCreateSessionDescriptionError(ev) {}

	Cancel() {
		this.close();
	}
}

// WEBPACK FOOTER //
// rtc/Peer.js

//////////////////
// WEBPACK FOOTER
// ./src/Peer.js
// module id = 343
// module chunks = 0
