<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { MediaRecorder } from 'extendable-media-recorder';
  // import { connect } from 'extendable-media-recorder-wav-encoder';
  // import { createModel, KaldiRecognizer } from 'vosk-browser';

  export let SttResult, StopListening, display_audio;

  let mediaRecorder: any,
    mediaStream: any,
    audioAnalyser: any,
    audioChunks = [],
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
    // await register(await connect());// не нужно?!
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
      } else {
        console.error(
          'Нет доступа к микрофону или пользователь отказался от доступа.'
        );
      }
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
    }

    audioChunks = [];
    audioUrl = '';
    const options = {
      bitsPerSecond: 44100,
      // mimeType: 'audio/wav',
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
    mediaRecorder.start();
    isRecording = true;
    checkLoop = true;
  }

  async function stopRecording() {
    const len = audioChunks.length;
    if (audioChunks[len - 1]?.size > 0) {
      sendAudioToRecognition(audioChunks[len - 1]);
      audioUrl = URL.createObjectURL(audioChunks[len - 1]);
      display_audio = 'block';

      if (Array.isArray(audioChunks) && audioChunks.length > 0) {
        audioChunks.splice(0, 1);
      }
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
      }
    });
  }

  async function sendAudioToRecognition(blob) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`
      };

      const formData = new FormData();
      formData.append('file', blob, 'audio.wav');
      formData.append('from_lang', from_lang);
      formData.append('to_lang', to_lang);

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
