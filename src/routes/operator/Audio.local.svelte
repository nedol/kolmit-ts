<script>
	import { onMount } from 'svelte';

	import ring from '$lib/mp3/ring.mp3';

	export let paused = true;
	let ls;
	onMount(async () => {});

	$: if (ls) {
		if (paused) {
			ls.pause();
		} else {
			ls.play();
		}
	}
</script>

<audio src={ring} bind:this={ls} loop>
	<track kind="captions" />
</audio>
