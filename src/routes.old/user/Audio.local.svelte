<script>
	import { onMount } from 'svelte';

	import call from '$lib/mp3/call.mp3';

	export let paused = true;
	let ls;
	onMount(async () => {});

	$: if (ls) {
		if (paused) ls.pause();
		else {
			ls.play();
		}
	}
</script>

<audio bind:this={ls} loop src={call}>
	<track kind="captions" />
</audio>
