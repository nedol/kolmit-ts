<script>
  import { onMount, onDestroy } from 'svelte';

  export let rtc;
  export let pc_config;
  export let pc_key;

  let con;
  let params = {};
  let timr;

  function initializePeerConnection() {
    con = new RTCPeerConnection(pc_config);

    con.ontrack = (ev) => {
      if (pc_key === 'reserve') return;

      if (rtc.GetRemoteVideo() !== ev.streams[0]) {
        rtc.remoteStream = ev.streams[0];

        rtc.remoteStream.onaddtrack = function () {
          console.log('addtrack in remote stream');
        };
      }

      if (rtc.remoteStream) {
        rtc.SetRemoteVideo(null);
        rtc.SetRemoteVideo(rtc.remoteStream);
      }
    };

    con.onicecandidate = (e) => {
      if (e.candidate) {
        if (e.candidate.type === 'relay') {
          console.log('The TURN server is reachable!');
        }

        if (!params['loc_cand']) params['loc_cand'] = [];
        params['loc_cand'].push(e.candidate);

        if (!timr) {
          timr = setTimeout(() => {
            sendOffer();
            clearTimeout(timr);
          }, 1000);
        }
      }
    };

    con.oniceconnectionstatechange = (e) => {
      console.log('oniceconnectionstatechange');
      rtc.onIceStateChange(con, e);
    };

    con.onconnectionstatechange = (e) => {
      console.log('onconnectionstatechange');
      rtc.onIceStateChange(con, e);
    };

    // Any other connection events...
  }

  async function sendDesc(desc) {
    const par = {
      proj: 'kolmit',
      func: 'call',
      abonent: rtc.abonent,
      type: rtc.type,
      operator: rtc.operator,
      uid: rtc.uid,
      desc,
      status: 'call',
      oper_uid: rtc.oper_uid,
    };

    return await rtc.signal.SendMessage(par);
  }

  async function sendCand(cand) {
    const par = {
      proj: 'kolmit',
      func: 'call',
      type: rtc.type,
      uid: rtc.uid,
      operator: rtc.operator,
      cand,
      status: 'call',
      abonent: rtc.abonent,
      oper_uid: rtc.oper_uid,
    };

    return await rtc.signal.SendMessage(par);
  }

  async function sendOffer() {
    const par = {
      proj: 'kolmit',
      func: 'offer',
      abonent: rtc.abonent,
      type: rtc.type,
      uid: rtc.uid,
      operator: rtc.operator,
      desc: params['loc_desc'],
      cand: params['loc_cand'],
      status: 'offer',
    };

    return await rtc.signal.SendMessage(par);
  }

  function setRemoteDesc(desc) {
    console.log('setRemoteDescription start');
    con.setRemoteDescription(desc)
      .then(() => {
        params['rem_desc'] = con.remoteDescription;
        if (con.remoteDescription.type === 'offer') {
          con.createAnswer().then(onCreateAnswerSuccess, onCreateAnswerError);
        }
      })
      .catch((error) => {
        console.log('Failed to set remote description:', error);
      });
  }

  function onCreateAnswerSuccess(desc) {
    con.setLocalDescription(desc)
      .then(() => {
        params['loc_desc'] = con.localDescription;
        console.log('onSetLocalDescriptionSuccess');
      })
      .catch(onSetAnswerError);
  }

  function onCreateAnswerError(error) {
    console.log('Failed to create answer:', error);
  }

  function onSetAnswerError(error) {
    console.log('Failed to set session description:', error);
  }

  function cancel() {
    con.close();
  }

  // Svelte lifecycle hooks
  onMount(() => {
    initializePeerConnection();
  });

  onDestroy(() => {
    cancel();
  });
</script>

<style>
  /* Ваши стили */
</style>

<div>
  <!-- Визуальные элементы, если требуются -->
  <p>WebRTC Peer Connection Component</p>
</div>
