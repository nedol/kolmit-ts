<script>
	import { onMount /*, onDestroy, getContext, setContext*/, setContext } from 'svelte';
	import { page, navigating, updated } from '$app/stores';
	import List, { Item, Graphic, Separator, Text } from '@smui/list';

	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';

	import { lesson } from '$lib/js/stores.js';

	import ru_flag from '$lib/images/flag-square-250_ru.png';

	import { editable } from '$lib/js/stores.js';
	$: if ($editable) {
		edited_display = $editable;
	}

	import { view } from '$lib/js/stores.js';

	import { langs } from '$lib/js/stores.js';

	import { dicts } from '$lib/js/stores.js';
	$: if ($dicts) {
		console.log($dicts);
	}

	$view = 'class';

	let menu = 'menu';

	let topAppBar;
	let abonent;

	onMount(async () => {
		let params = new URL(document.location).searchParams;
		abonent = params.get('abonent');
	});

	let lang_menu = false;

	let langAr = {
		en: `https://cdn.countryflags.com/thumbs/united-kingdom/flag-square-250.png
			`,
		fr: `
			https://cdn.countryflags.com/thumbs/france/flag-square-250.png
			`,
		nl: `
			https://cdn.countryflags.com/thumbs/netherlands/flag-square-250.png
			`,
		de: `https://cdn.countryflags.com/thumbs/germany/flag-square-250.png
			`,
		uk: `
			https://cdn.countryflags.com/thumbs/ukraine/flag-square-250.png
			`,
		ru: ru_flag
	};

	function setLang(lang) {
		fetch(`./?func=cookie&abonent=${abonent}&lang=${lang}`)
			.then(() => console.log())
			.catch((error) => {
				console.log(error);
			});
	}
</script>

{#if $view === 'class' || $view === 'lesson'}
{#if $dicts && $dicts['CLASS'][$langs]}
	<header>
		<div class="top-app-bar-container flexor">
			<TopAppBar bind:this={topAppBar} variant="fixed" dense>
				<Row>
					<div class="sec_items">
						<Section>
							<Title
								on:click={() => {
									$view = 'class';
								}}>{$dicts ? $dicts['CLASS'][$langs] : 'CLASS'}</Title
							>

							<Title
								on:click={async () => {
									console.log();
									$lesson.data = { quiz: '' };
									$view = 'lesson';
								}}>{$dicts ? $dicts['LESSON'][$langs] : 'LESSON'}</Title
							>
							<!-- <IconButton class="material-icons" aria-label="Bookmark this page">bookmark</IconButton> -->
						</Section>
					</div>
					<Section align="end">
						<IconButton
							class="material-icons"
							on:click={() => {
								lang_menu = !lang_menu;
							}}><img src={langAr[$langs]} alt={langAr[$langs]} /></IconButton
						>
						{#if lang_menu}
							<div class="lang_list" style="position:absolute; display: flex; margin-top:300px">
								<List dense>
									<Item
										on:SMUI:action={() => {
											$langs = 'en';
											setLang($langs);
											lang_menu = false;
										}}
									>
										<!-- <Graphic class="material-icons">edit</Graphic> -->
										<img src={langAr['en']} alt="English" />
									</Item>
									<Item
										on:SMUI:action={() => {
											$langs = 'fr';
											setLang($langs);
											lang_menu = false;
										}}
									>
										<!-- <Graphic class="material-icons">edit</Graphic> -->
										<img src={langAr['fr']} alt="Français" />
									</Item>
									<Item
										on:SMUI:action={() => {
											$langs = 'nl';
											setLang($langs);
											lang_menu = false;
										}}
									>
										<!-- <Graphic class="material-icons">edit</Graphic> -->
										<img src={langAr['nl']} alt="Nederlands" />
									</Item>
									<Item
										on:SMUI:action={() => {
											$langs = 'de';
											setLang($langs);
											lang_menu = false;
										}}
									>
										<!-- <Graphic class="material-icons">edit</Graphic> -->
										<img src={langAr['de']} alt="Deutch" />
									</Item>
									<Item
										on:SMUI:action={() => {
											$langs = 'uk';
											setLang($langs);
											lang_menu = false;
										}}
									>
										<!-- <Graphic class="material-icons">edit</Graphic> -->
										<img src={langAr['uk']} alt="Український" />
									</Item>
									<Item
										on:SMUI:action={() => {
											$langs = 'ru';
											setLang($langs);
											lang_menu = false;
										}}
									>
										<img src={langAr['ru']} alt="Русский" />
									</Item>
								</List>
							</div>
						{/if}
					</Section>
				</Row>
			</TopAppBar>
			<div class="flexor-content"></div>
		</div>
	</header>
{/if}
{/if}

<style>
	header {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.top-app-bar-container {
		/* max-width: 480px; */
		/* width: 100%; */
		/* height: 100vh; */
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
		margin: 0 18px 18px 0;
		background-color: var(--mdc-theme-background, #fff);

		overflow: auto;
		display: inline-block;
	}

	img {
		width: 30px;
		opacity: 100%;
	}

	.sec_items {
		position: absolute;
		z-index: 2;
		/* left: 30%; */
		top: 15%;
	}

	button.sec_right {
		left: 100px;
	}
	.lang_list {
		background-color: white;
		/* opacity: 50%; */
	}
	@media (max-width: 480px) {
		.top-app-bar-container {
			margin-right: 0;
		}
	}

	.flexy {
		display: flex;
		flex-wrap: wrap;
	}

	.flexor {
		display: inline-flex;
		flex-direction: column;
	}

	.flexor-content {
		flex-basis: 0;
		/* height: 100vh; */
		flex-grow: 1;
		overflow: auto;
	}
	/* Стили для мобильных устройств */
	@media screen and (max-width: 767px) {
		.sec_items {
			position: absolute;
			left: 30%;
			top: 15%;
		}
	}
</style>
