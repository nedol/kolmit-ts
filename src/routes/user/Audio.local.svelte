<script>
	import { onMount } from 'svelte';
	import call from '$lib/mp3/call.mp3';

	export let paused = true;
	let ls;

	onMount(() => {
		// Perform any setup here if needed
	});

	$: if (ls) {
		if (paused) {
			ls.pause();
		} else {
			ls.play().catch((error) => {
				console.error('Failed to play audio:', error);
			});
		}
	}
</script>

<audio bind:this={ls} loop src={call}>
	<track kind="captions" src="path/to/captions.vtt" />
</audio>