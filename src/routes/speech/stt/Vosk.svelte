<script>
	import { onMount } from 'svelte';
	import { MediaRecorder, register } from 'extendable-media-recorder';
	import { connect } from 'extendable-media-recorder-wav-encoder';
	import { createModel, KaldiRecognizer } from 'vosk-browser';
	import { decode, decodeUTF8 } from 'base64-js';

	onMount(async () => {});

	let audioWorkletNode, audioContext, loadedModel, recognizer, loading, ready;

	// Декодирование Base64 данных модели
	// const decodedModelData = new Uint8Array(
	// 	atob(arrayBuffer)
	// 		.split('')
	// 		.map((char) => char.charCodeAt(0))
	// );

	const loadModel = async (path) => {
		loading = true;
		loadedModel?.model.terminate();
		const MODEL_PATH = './src/routes/speech/stt/vosk-model-small-fa-0.4.tar.gz';

		const model = await createModel(MODEL_PATH);

		loadedModel = { model, path };
		recognizer = new model.KaldiRecognizer(48000);
		recognizer.setWords(true);

		recognizer.on('result', (message) => {
			const result = message.result;
			utterances = [...utterances, result];
		});

		recognizer.on('partialresult', (message) => {
			partial = message.result.partial;
		});

		loading = false;
		ready = true;
	};

	export const startAudioMonitoring = async () => {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		await audioContext.audioWorklet.addModule('./src/routes/speech/stt/audio-worklet-processor.js');

		audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');

		await loadModel(); // Загрузите модель перед инициализацией аудиообработчика

		const mediaStream = await navigator.mediaDevices.getUserMedia({
			video: false,
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				channelCount: 1,
				sampleRate: 16000
			}
		});

		const source = audioContext.createMediaStreamSource(mediaStream);
		source.connect(audioWorkletNode);
	};
</script>
