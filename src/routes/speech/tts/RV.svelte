<script>
	import { onMount, onDestroy, getContext } from 'svelte';

	onMount(() => {
		responsiveVoice.enableEstimationTimeout = false;
		responsiveVoice.enableWindowClickHook();
		responsiveVoice.setDefaultVoice('Dutch Female');
		const voicelist = responsiveVoice.getVoices();
	});

	export function Speak(text) {
		if (responsiveVoice.voiceSupport()) {
			responsiveVoice.speak(text, 'Dutch Male', {
				rate: 0.8,
				onstart: StartCallback,
				onend: EndCallback
			});

			if(responsiveVoice.utterances[0])
			responsiveVoice.utterances[0].onerror = function (event) {
				console.error('Ошибка синтеза речи: ', event.error);
				// responsiveVoice.cancel();
				// Speak(text)
			};
		}
	}

	function EndCallback() {
		responsiveVoice.cancel();
	}

	function StartCallback() {
		console.log();
	}

	export function Pause(text) {
		responsiveVoice.pause();
	}

	export function Resume(text) {
		responsiveVoice.resume();
	}

	export function Cancel(text) {
		responsiveVoice.cancel();
	}
</script>
