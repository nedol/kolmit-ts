import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

export let StopListening, display_audio;

let audioContext,
	mediaRecorder,
	mediaStream,
	audioAnalyser,
	audioChunks = [],
	audioUrl,
	audioPlayer,
	isRecording = false,
	soundTimer,
	silenceTimer;
let model,
	recognizer,
	loadedModel,
	audioBuffer = [];
const threshold = 20;
const silenceDelay = 2000; //  секунды тишины
let checkLoop = true;
let from_lang = 'en';
let to_lang = 'en';

(async () => {
	await register(await connect());
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

	audioContext = new AudioContext();
      audioAnalyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(audioAnalyser);

      const noiseSuppression = audioContext.createDynamicsCompressor();
      noiseSuppression.threshold.value = -20; // Устанавливаем порог шумоподавления
      source.connect(noiseSuppression);
})();

let SttResult;

export async function startAudioMonitoring(sttres, from, to) {
	SttResult = sttres;
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
		console.log('average:', average);
		if (average > threshold) {
			console.log('threshold:', average);
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
  let options = {
    bitsPerSecond: 44100,
    mimeType: 'audio/wav',
    // audioBitsPerSecond: 128000 // Битрейт аудио (по желанию)
  };

	mediaRecorder = new MediaRecorder(mediaStream, options);
	const audioTrack = mediaStream.getAudioTracks()[0];
	mediaRecorder.ondataavailable = (e) => {
		if (false && audioChunks.length < 20) {
		audioChunks.push(e.data);
		} else {
		audioChunks.push(e.data);

		const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

		sendAudioToRecognition(audioBlob);
		}
	};

	mediaRecorder.onstop = (e) => {
		stopRecording();

	};

  mediaRecorder.start();
  isRecording = true;
  checkLoop = true;
  // Мьютирование аудио трека

//   audioTrack.enabled = false; // Отключаем передачу звука
}

// Функция для остановки записи
async function stopRecording() {
  // await audioContext.decodeAudioData(audioBuffer);
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  audioUrl = URL.createObjectURL(audioBlob);
  display_audio = 'block';
 const audioTrack = mediaStream.getAudioTracks()[0];
  audioTrack.enabled = true; // включаем передачу звука
}

async function sendAudioToRecognition(blob) {
	try {
		const headers = {
			'Content-Type': 'application/json'
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
			headers: { headers }
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
$: console.log('display_audio:', display_audio);
