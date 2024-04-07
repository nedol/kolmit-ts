<script>
	import { onMount, onDestroy, getContext } from 'svelte';

	let audio;

	onMount(() => {});

	export async function Speak(text) {
		text = text.replace(/<[^>]+>.*?<\/[^>]+>/g, '');
		const par = {
			func: 'tts',
			text: text
		};
		const response = await fetch('/speech/tts', {
			method: 'POST',
			body: JSON.stringify({ par })
			// header: { 'Content-Type': 'audio/ogg' }
		});

		if (!response.ok) {
			throw new Error(`Ошибка сервера: ${response.status}`);
		}

		const url = URL.createObjectURL(response);
		// Пример того, как можно воспроизвести полученный аудиофайл
		audio = new Audio(url);
		audio.play();
	}

	export function CollectGarbage() {}

	export function Cancel() {}

	export function Pause() {}

	export function Resume() {}

	export async function initSpeech() {}

	onDestroy(() => {
		audio = '';
	});
</script>
