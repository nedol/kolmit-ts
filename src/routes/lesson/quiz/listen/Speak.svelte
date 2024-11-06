<script>
	import { users } from '$lib/js/stores.js';

	import { onMount, getContext } from 'svelte';
	import BottomAppBar, { Section, AutoAdjust } from '@smui-extra/bottom-app-bar';
	import IconButton, { Icon } from '@smui/icon-button';
	import { mdiPagePreviousOutline } from '@mdi/js';

	import { lesson } from '$lib/js/stores.js';
	import { dc } from '$lib/js/stores.js';
	$: if ($dc && $dc.dc) {
		$dc.dc.onmessage = (event) => {
			console.log(event.data);
		};
	}

	import pkg from 'lodash';
	const { find, findKey, mapValues } = pkg;

	let bottomAppBar;

	$: if (data.question) {
		q_visibility = 'hidden';
	}

	$: if (data.answer) {
		a_visibility = 'hidden';
	}

	$: {
		console.log($lesson.visible);
	}
	// import pair_data from './pair_data.json';
	export let data;

	let q_visibility = 'hidden';
	let a_visibility = 'hidden';

	let containerWidth, containerHeight;

	onMount(() => {
		// Получаем ширину родительского окна при загрузке компонента
		const parentWidth = window.innerWidth; // Может потребоваться window.innerWidth - некоторое смещение, если у вас есть другие элементы на странице

		// Устанавливаем ширину контейнера равной ширине родительского окна
		containerWidth = parentWidth + 'px';

		// Получаем высоту родительского окна при загрузке компонента
		const parentHeight = window.innerHeight; // Может потребоваться window.innerHeight - некоторое смещение, если у вас есть другие элементы на странице

		// Устанавливаем высоту контейнера равной высоте родительского окна
		containerHeight = parentHeight + 'px';
	});
	function handleBackClick() {
		lesson_display = true; // При клике на "Back" показываем компонент Lesson
	}

	function onClickQ() {
		if (a_visibility === 'visible') {
			q_visibility = 'hidden';
			a_visibility = 'hidden';
		} else {
			if (q_visibility === 'visible') a_visibility = 'visible';
			q_visibility = 'visible';
		}
	}
</script>

<div style="display: flex;">
	<div style="margin:0 auto">
		<div class="q" id="question" style="visibility:{q_visibility}">
			<div>{@html data.question}</div>
		</div>
		<div class="q" id="answer" style="visibility:{a_visibility}">
			<div>{@html data.answer}</div>
		</div>
		<button class="toggleButton" on:click={onClickQ}> ? </button>
	</div>
</div>
{#if data.html}
	<div>{@html data.html}</div>
{/if}

<!-- <BottomAppBar bind:this={bottomAppBar}>
	<Section>
		<IconButton class="material-icons" aria-label="Back" on:click={handleBackClick}>
			<Icon tag="svg" viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiPagePreviousOutline} />
			</Icon>
		</IconButton>
	</Section>
	<Section>
		<IconButton class="material-icons">change_circle</IconButton>
	</Section>

	<Section>
		<IconButton class="material-icons" fill="currentColor" aria-label="More">more_vert</IconButton>
	</Section>
</BottomAppBar> -->

<style>
	.container {
		position: absolute;
		line-height: 50px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/* Дополнительные стили по вашему усмотрению */
		margin: 0;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}
	.q {
		color: gray;
		border: 0;
		background-color: transparent;
		font: 1.2em sans-serif;
	}
	.toggleButton {
		position: absolute;
		right: 25px;
		top: 170px;
	}
</style>
