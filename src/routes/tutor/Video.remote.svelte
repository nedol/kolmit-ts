<script>
	import { onMount } from 'svelte';
	import Card, { Content, PrimaryAction, Media, MediaContent } from '@smui/card';

	export let srcObject;
	export let poster;
	export let status;
	let muted = true;
	export let video_element, card;
	export let parent_div;
	export let name, operator;
	let rv;

	onMount(async () => {
		rv = video_element;
	});

	$: if (rv && srcObject) {
		rv.srcObject = srcObject;
	} else if (rv && rv.srcObject) {
		rv.srcObject.getVideoTracks().forEach((track) => {
			track.stop();
			rv.srcObject.removeTrack(track);
		});
		rv.src = '';
	}

	$: if (status === 'talk') {
		muted = false;
	} else {
		muted = true;
	}
</script>

<div class="card-display" bind:this={parent_div}>
	<div class="card-container" bind:this={card}>
		<Card style="min-width: 50px;">
			<Media class="card-media-square" aspectRatio="square">
				<MediaContent>
					<video
						class="user_video_remote"
						bind:this={video_element}
						on:click
						on:mute
						{status}
						{muted}
						{poster}
						autoplay
						playsinline
					>
						<track kind="captions" />
					</video>
				</MediaContent>
			</Media>
			<!-- <Content style="color: #888; font-size:smaller">{name}</Content> -->
			<h3
				class="mdc-typography--subtitle2"
				style="margin: 0; color: #888;font-size:x-small;text-align:center;z-index:1"
			>
				{#if name}
					{name.slice(0, 8)}
				{:else}
					{operator.slice(0, 8)}
				{/if}
			</h3>
		</Card>
	</div>
</div>
<slot />

<style>
	video {
		display: block;
		margin-right: auto;
		margin-left: auto;
		margin-top: auto;
		max-width: 50px;
		max-height: 50px;
	}
	[status='call'] {
		opacity: 1;
	}
	[status='talk'] {
		opacity: 1;
	}
	[status='muted'] {
		opacity: 0.3;
	}
	[status='inactive'] {
		opacity: 0.3;
	}
	[status='active'] {
		opacity: 1;
	}
	[status='busy'] {
		opacity: 0.3;
	}
</style>
