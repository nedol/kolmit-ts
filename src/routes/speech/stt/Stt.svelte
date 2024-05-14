<script>
  import { onMount, onDestroy } from 'svelte';
  import { MediaRecorder } from 'extendable-media-recorder';
  // import { connect } from 'extendable-media-recorder-wav-encoder';
  // import { createModel, KaldiRecognizer } from 'vosk-browser';

  export let SttResult, StopListening, display_audio;

  let mediaRecorder,
    mediaStream,
    audioAnalyser,
    audioChunks = [],
    audioUrl,
    audioPlayer,
    isRecording = false,
    soundTimer,
    silenceTimer;

  const threshold = 10;
  const silenceDelay = 2000; //  секунды тишины
  let checkLoop = true;

  onMount(async () => {
    // await register(await connect());// не нужно?!
  });

  export async function startAudioMonitoring() {
    try {
     
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
            sampleRate: 48000,
            sampleSize: 16,
            volume: 1.0,
          },
        });
      

      // Проверка mediaStream на наличие
      if (mediaStream) {
        const audioContext = new AudioContext();
        audioAnalyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(audioAnalyser);

        const noiseSuppression = audioContext.createDynamicsCompressor();
        noiseSuppression.threshold.value = -20;
        source.connect(noiseSuppression);

        startRecording();
        checkAudio();
      } else {
        console.error(
          'Нет доступа к микрофону или пользователь отказался от доступа.'
        );
      }
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
    }
  }

  export function CollectGarbage() {
    audioUrl = '';
    audioChunks = [];
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  }

  // Функция для проверки уровня аудио и управления записью
  function checkAudio() {
    // console.log('startRecording');
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    const checkSilence = () => {
      audioAnalyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      // console.log('average:', average);
      if (average > threshold) {
        // console.log('threshold:', average);
        clearTimeout(silenceTimer);
        silenceTimer = '';
        // console.log('silenceTimer after:', silenceTimer);
      } else if (average <= threshold && isRecording) {
        if (!silenceTimer)
          silenceTimer = setTimeout(() => {
            MediaRecorderStop();
            // console.log('stopRecording:', average);
          }, silenceDelay);
      }
      if (checkLoop) {
        requestAnimationFrame(checkSilence);
      }
    };
    checkSilence();
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
    audioChunks = [];
    audioUrl = '';
    const options = {
      bitsPerSecond: 44100,
      mimeType: 'audio/wav',
      // audioBitsPerSecond: 128000 // Битрейт аудио (по желанию)
    };

    mediaRecorder = new MediaRecorder(mediaStream, options);
    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = (e) => {
      stopRecording();
      StopListening();
    };

    mediaRecorder.start();
    isRecording = true;
    checkLoop = true;
  }

  async function stopRecording() {
    if (audioChunks[0]?.size > 0) {
      sendAudioToRecognition(audioChunks[0]);
      audioUrl = URL.createObjectURL(audioChunks[0]);
      display_audio = 'block';
      mediaRecorder = null;
      mediaStream.getTracks().forEach(function (el) {
        el.stop();
      });
      mediaStream = null;
    }
  }

  async function sendAudioToRecognition(blob) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`
      };

      const formData = new FormData();
      formData.append('file', blob, 'audio.wav');

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

<audio
  bind:this={audioPlayer}
  src={audioUrl}
  controls
  style="display:{display_audio};width:50%"
></audio>

<!-- <button on:click={playAudio}>Воспроизвести</button> -->

<style>
  audio {
    height: 25px;
  }
</style>
