<script>
	import { onMount } from 'svelte';
	import { MediaRecorder, register } from 'extendable-media-recorder';
	import { connect } from 'extendable-media-recorder-wav-encoder';
	import { createModel } from 'vosk-browser';

	export let SttResult, StopListening;

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
	const threshold = 40;
	const silenceDelay = 3000; //  секунды тишины
	let checkLoop = true;

	(async () => {
		await register(await connect());
	})();

	onMount(async () => {});

	export async function startAudioMonitoring() {
		const MODEL_PATH = './src/routes/speech/stt/vosk-model-small-nl-0.22.tar.gz';
		const model = await createModel(MODEL_PATH);

		const recognizer = new model.KaldiRecognizer();
		recognizer.on('result', (message) => {
			console.log(`Result: ${message.result.text}`);
		});
		recognizer.on('partialresult', (message) => {
			console.log(`Partial result: ${message.result.partial}`);
		});

		const mediaStream = await navigator.mediaDevices.getUserMedia({
			video: false,
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				channelCount: 1,
				sampleRate: 16000
			}
		});

		const audioContext = new AudioContext();

		const recognizerNode = audioContext.createScriptProcessor(4096, 1, 1);
		recognizerNode.onaudioprocess = (event) => {
			try {
				recognizer.acceptWaveform(event.inputBuffer);
			} catch (error) {
				console.error('acceptWaveform failed', error);
			}
		};
		const source = audioContext.createMediaStreamSource(mediaStream);
		source.connect(recognizerNode);
	}

	function playAudio() {
		if (audioPlayer) {
			audioPlayer.play();
		}
	}
</script>

<audio bind:this={audioPlayer} src={audioUrl} controls></audio>
<!-- <button on:click={playAudio}>Воспроизвести</button> -->
