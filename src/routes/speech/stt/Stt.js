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
const threshold = 40;
const silenceDelay = 3000; //  секунды тишины
let checkLoop = true;

(async () => {
	await register(await connect());
})();

let SttResult;

export async function startAudioMonitoring(sttres) {
	SttResult = sttres;
	try {
		mediaStream = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true,
				channelCount: 1,
				sampleRate: 48000,
				sampleSize: 16,
				volume: 1.0
			}
		});
		audioContext = new AudioContext();
		audioAnalyser = audioContext.createAnalyser();
		const source = audioContext.createMediaStreamSource(mediaStream);
		source.connect(audioAnalyser);

		const noiseSuppression = audioContext.createDynamicsCompressor();
		noiseSuppression.threshold.value = -20; // Устанавливаем порог шумоподавления
		source.connect(noiseSuppression);
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
		} else if (average <= threshold - 15 && isRecording) {
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
		mimeType: 'audio/wav'
		// audioBitsPerSecond: 128000 // Битрейт аудио (по желанию)
	};

	mediaRecorder = new MediaRecorder(mediaStream, options);
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
}

// Функция для остановки записи
async function stopRecording() {
	// await audioContext.decodeAudioData(audioBuffer);
	const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
	audioUrl = URL.createObjectURL(audioBlob);
	display_audio = 'block';
}

async function sendAudioToRecognition(blob) {
	try {
		const headers = {
			'Content-Type': 'application/json'
			// Authorization: `Bearer ${token}`
		};

		const formData = new FormData();
		formData.append('file', blob, 'audio.wav');

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
