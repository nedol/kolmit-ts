import { writable } from 'svelte/store';
import { DataChannelOperator } from './DataChannelOperator';
import { RTCBase } from './RTCBase';
import { langs } from '$lib/js/stores.js';
import { msg } from '$lib/js/stores.js';

export class RTCOperator extends RTCBase {
  constructor(operator, name, signal) {
    super(operator, name, signal);

    this.user = ''

    this.checking_tmr;

    msg.subscribe((data) => {
      try {
        if (data) {
          this.OnMessage(data);
        }
      } catch (ex) {
        console.log(ex);
      }
    });
  }

  Init(cb) {
    let that = this;
    this.mode = '';
    let transAr = [that.abonent];
    that.main_pc = '';
    for (let i in transAr) {
      that.InitRTC(transAr[i], function () {
        cb();
      });
    }
  }

  SendStatus(status) {
    let par = {};
    par.proj = 'kolmit';
    par.func = 'status';
    par.abonent = this.abonent.toLowerCase();
    par.operator = this.operator.toLowerCase();
    par.status = status;
    this.signal.SendMessage(par, () => {
      this.status = status;
    });
  }

  SendOffer(key) {
    let that = this;
    that.pcPull[key].params['loc_desc'] = '';
    that.pcPull[key].params['loc_cand'] = '';

    that.pcPull[key].con
      .createOffer(
        (this.mode = {
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 0,
        })
      )
      .then(
        (desc) => that.pcPull[key].onCreateOfferSuccess(desc),
        that.pcPull[key].onCreateOfferError
      );
  }

  SendVideoOffer(key) {
    this.SendOffer(key); // или можно вызвать SendVideoOffer из базового класса при необходимости
  }

  async Offer() {
    this.Init(() => {
      if (this.pcPull[this.abonent].con.signalingState !== 'closed') {
        this.GetUserMedia({        
          audio: {
            echoCancellation: true, // Устранение эха
            noiseSuppression: true, // Устранение шума
          }, 
          video: false 
        }, () => {
          this.SendOffer(this.abonent);
        });
      }
    });
  }

  async SendAnswer() {
    let that = this;
    let par = {};
    par.proj = 'kolmit';
    par.func = 'call';
    par.abonent = this.abonent;
    par.target = this.target;
    par.desc = this.pcPull[this.abonent].params['loc_desc']; //.sdp.replace(/max-message-size:([0-9]+)/g, 'max-message-size:'+262144+'\r\n');
    par.cand = this.pcPull[this.abonent].params['loc_cand'];
    par.status = 'call';

    return await this.signal.SendMessage(par);
  }

  Call(user) {
    this.user = user;
    this.Init(() => {
      this.GetUserMedia({   
        audio: {
            echoCancellation: true, // Устранение эха
            noiseSuppression: true, // Устранение шума
        }, 
        video: false 
      }, () => {
        // document.getElementsByClassName('browser_container')[0].style.display = 'none';
        let par = {};
        par.proj = 'kolmit';
        par.func = 'call';
        par.status = 'call';
        par.type = 'user';
        par.abonent = this.abonent.toLowerCase();
        par.operator = this.operator.toLowerCase();
        par.user = user;
        par.name = 'user';
        this.signal.SendMessage(par, () => {
          this.status = 'call';
 
        });
      });
    });
  }

  OnActive() {
    this.Init(() => {
      if (this.pcPull[this.abonent].con.signalingState !== 'closed') {
        this.GetUserMedia({         
          audio: {
            echoCancellation: true, // Устранение эха
            noiseSuppression: true, // Устранение шума
          }, 
          video: false  
        }, (res) => {
          if (res) {
            this.SendOffer(this.abonent);
          }
        });
      }
    });
  }

  OnCall() {

    setTimeout(() => {
      this.DC.SendDCCall();
    }, 2000);
    // this.SendStatus('call');
  }

  OnTalk() {
    if (this.DC) {
      this.DC.SendDCTalk();
    }

    this.SendStatus('talk');
  }

  OnHangup() {
    this.RemoveTracks();
    if (this.DC) {
      this.DC.SendDCHangup(() => {});
    }
  }

  OnInactive() {
    if (
      this.DC &&
      (this.DC.dc.readyState === 'open' ||
        this.DC.dc.readyState === 'connecting')
    ) {
      this.RemoveTracks();
      // this.DC.SendDCClose();
      this.SendStatus('close');
    }
  }

  OnMessage(data) {
    let that = this;

    if (data.func === 'call') {
    }

    if (data.func === 'mute') {
      this.RemoveTracks();
    }

    if (data.func === 'talk') {

    }

    if (data.func === 'redirect') {
    }

    if (data.func === 'video') {
    }

    if (data.desc && that.pcPull[data.abonent]) {
      if (
        that.pcPull[data.abonent].con &&
        (that.pcPull[data.abonent].con.connectionState === 'failed' ||
          that.pcPull[data.abonent].con.connectionState === 'disconnected')
      )
        that.pcPull[data.abonent].con.restartIce();

		that.target = data.target;	
      that.pcPull[data.abonent].params['rem_desc'] = data.desc;
      that.pcPull[data.abonent].setRemoteDesc(data.desc);
    }

    if (data.cand && that.pcPull[data.abonent]) {
      if (
        !that.pcPull[data.abonent].con ||
        that.pcPull[data.abonent].con.signalingState === 'closed'
      ) {
        return;
      }
		try {
		  	that.target = data.target;	
        that.pcPull[data.abonent].params['rem_cand'] = data.cand;
        if (Array.isArray(data.cand)) {
          for (let c in data.cand) {
            if (data.cand[c])
              that.pcPull[data.abonent].con.addIceCandidate(data.cand[c]);
          }
        } else {
          if (data.cand)
            that.pcPull[data.abonent].con.addIceCandidate(data.cand);
        }
      } catch (ex) {
        log(ex);
      }
    }
  }
}
