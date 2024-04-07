<script>
	import { onMount } from 'svelte';
	import Card, { Content, PrimaryAction, Media, MediaContent } from '@smui/card';

	let display = 'block';
	export let srcObject = '';
	let lv, card, parent_div;

	import { posterst } from '$lib/js/stores.js';
	$: if ($posterst) {
	}

	onMount(async () => {});

	$: if (lv && srcObject) {
		lv.srcObject = srcObject;
	} else if (lv && lv.srcObject) {
		lv.srcObject.getVideoTracks().forEach((track) => {
			track.stop();
			lv.srcObject.removeTrack(track);
		});
		lv.src = '';
	}
</script>

<div class="card-display" bind:this={parent_div}>
	<div class="card-container" bind:this={card}>
		<Card style="min-width: 40px;">
			<Media class="card-media-square" aspectRatio="square">
				<MediaContent>
					<video
						class="oper_video_local"
						bind:this={lv}
						poster={$posterst}
						autoplay
						playsinline
						muted
						style="display: {display}"
					/>
				</MediaContent>
			</Media>
			<!-- <Content style="color: #888; font-size:smaller">{name}</Content> -->
			<h3
				class="mdc-typography--subtitle2"
				style="margin: 0; color: #888;font-size:smaller;text-align:center; z-index:1"
			/>
		</Card>
	</div>
</div>
<!-- </div> -->
<slot name="footer" />

<style>
	video {
		display: block;
		margin-right: auto;
		margin-left: auto;
		margin-top: auto;
		max-width: 40px;
		max-height: 40px;
	}
</style>
