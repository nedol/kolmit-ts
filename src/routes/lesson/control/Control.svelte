<script>
	import BottomAppBar, { Section } from '@smui-extra/bottom-app-bar';
	import IconButton, { Icon } from '@smui/icon-button';
	import { mdiPagePreviousOutline } from '@mdi/js';

	import { lesson } from '$lib/stores.ts';

	// Функция для обработки клика на кнопку "Back"
	function handleBackClick() {
		$lesson.visible = true; // При клике на "Back" показываем компонент Lesson
	}
</script>

<BottomAppBar variant="static" color="primary">
	<Section>
		<IconButton class="material-icons">menu</IconButton>
	</Section>
	<Section>
		<IconButton class="material-icons" aria-label="Back" on:click={handleBackClick}>
			<Icon tag="svg" viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiPagePreviousOutline} />
			</Icon>
		</IconButton>
	</Section>
	<Section>
		<IconButton class="material-icons" fill="currentColor" aria-label="More">more_vert</IconButton>
	</Section>
</BottomAppBar>

<style>
	/* Ваши стили для Control.svelte */
</style>
