<script lang="ts">
  import { onMount, onDestroy, getContext } from 'svelte';
  import { MediaRecorder } from 'extendable-media-recorder';
  import type { IBlobEvent, IMediaRecorder } from 'extendable-media-recorder';
  // import { CreateMLCEngine } from '@mlc-ai/web-llm';

  export let SttResult:string, StopListening, display_audio:string, original:string;

  let operator = getContext('operator');

  // let MediaRecorder;

  let mediaRecorder: IMediaRecorder,
    mediaStream: any,
    audioAnalyser: any,
    audioChunks: Array<Blob> = [],
    audioUrl,
    audioPlayer,
    isRecording = false,
    soundTimer,
    silenceTimer;

  const threshold = 10;
  const silenceDelay = 2000; //  секунды тишины
  let checkLoop = true;
  let from_lang = 'en';
  let to_lang = 'en';

  onMount(async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 48000,
        sampleSize: 16
      }
    });

    if (!mediaStream) throw new Error("Не удалось получить MediaStream");

    mediaRecorder = new MediaRecorder(mediaStream, { bitsPerSecond: 44100 });

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      stopRecording();
      StopListening();
    };

    // **Добавляем инициализацию audioAnalyser**
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
    
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = 256;
    mediaStreamSource.connect(audioAnalyser);
    
  } catch (error) {
    console.error("Ошибка доступа к микрофону:", error);
    alert("Пожалуйста, разрешите доступ к микрофону в настройках браузера.");
  }
});



  export async function startAudioMonitoring(from, to) {
    from_lang = from;
    to_lang = to;
    try {
      // дополнительные настройки audioAnalyser
      startRecording();
      checkAudio();
      // setTimeout(() => {
      // 	mediaRecorder.stop();
      // }, 4000);
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
    }
  }

  // Функция для проверки уровня аудио и управления записью
  function checkAudio() {
    console.log('startRecording');
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    const checkSilence = () => {
      audioAnalyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      console.log('average:', average);
      if (average > threshold) {
        console.log('threshold:', average);
        clearTimeout(silenceTimer);
        silenceTimer = '';
        console.log('silenceTimer after:', silenceTimer);
      } else if (average <= threshold && isRecording) {
        if (!silenceTimer)
          silenceTimer = setTimeout(() => {
            MediaRecorderStop();
            console.log('stopRecording:', average);
          }, silenceDelay);
      }
      if (checkLoop) {
        requestAnimationFrame(checkSilence);
      }
    };
    checkSilence();
  }

  export function SendRecognition() {
    const len = audioChunks.length;
    sendAudioToRecognition(audioChunks[len - 1]);
  }

  export function MediaRecorderStop() {
    isRecording = false;
    silenceTimer = '';
    checkLoop = false;
    clearTimeout(silenceTimer);
    mediaRecorder.stop();
  }

  // Функция для начала записи
  function startRecording() {
    if (Array.isArray(audioChunks) && audioChunks.length > 0) {
      audioChunks.splice(0, 1);
    }

    mediaRecorder.start();
    isRecording = true;
    checkLoop = true;
    mediaStream.enable = false;
  }

  async function stopRecording() {
    mediaStream.enable = true;
    const len = audioChunks.length;
    if (audioChunks[len - 1]?.size > 0) {
      sendAudioToRecognition(audioChunks[len - 1]);
      audioUrl = URL.createObjectURL(audioChunks[len - 1]);
      if(display_audio!=='none')
        display_audio = 'block';
    }

    // mediaStream.getTracks().forEach(function (el) {
    //   el.stop();
    // });
  }

  export async function sendLoadModel() {
    fetch('/speech/stt', {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify({
        load: 'model',
      }),
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`
      },
    });
  }

  export async function sendAudioToRecognition(blob) {
    //
    try {
      const headers = {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`
      };

      const formData = new FormData();
      formData.append('file', blob, 'audio.wav');
      formData.append('from_lang', from_lang);
      formData.append('to_lang', to_lang);
      formData.append('operator', operator.operator);
      formData.append('original', original);

      fetch('/speech/stt', {
        method: 'POST',
        // mode: 'no-cors',
        body: formData,
        headers: { headers },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(resp);
          SttResult(data.resp);
        })
        .catch((error) => {
          console.log(error);
          return [];
        });
    } catch (error) {
      console.log('Ошибка отправки аудио:', error);
    }
  }

  function playAudio() {
    if (audioPlayer) {
      audioPlayer.play();
    }
  }

  onDestroy(() => {
    mediaRecorder = '';
    mediaStream = '';
    audioAnalyser = '';
    audioUrl = '';
    audioPlayer = '';
    audioChunks = '';
    clearTimeout(silenceTimer);
  });
</script>

<div class="audio_container"  style="display:{display_audio}">
<audio
  bind:this={audioPlayer}
  src={audioUrl}
  controls

></audio>
</div>

<!-- <button on:click={playAudio}>Воспроизвести</button> -->

<style>
  .audio_container{
    position: relative;
    height: 50px; 
    margin: 0 auto;
  }
  audio{
    height:inherit
  }
</style>
