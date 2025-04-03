<script>
	import { onMount, onDestroy } from 'svelte';

	import List, { Item, Graphic, Separator, Text } from '@smui/list';
	import IconButton from '@smui/button';

	let options;
	export let lang = 'nl';

	let isListOpen = false; // Добавляем переменную для отслеживания состояния списка

	options = [
		{
			id: 0,
			lang: 'en',
			src: 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-square-250.png',
			alt: 'English'
		},
		{
			id: 1,
			lang: 'nl',
			src: 'https://cdn.countryflags.com/thumbs/netherlands/flag-square-250.png',
			alt: 'Nederlands'
		},
		{
			id: 2,
			lang: 'fr',
			src: 'https://cdn.countryflags.com/thumbs/france/flag-square-250.png',
			alt: 'Français'
		},
		{
			id: 3,
			lang: 'de',
			src: 'https://cdn.countryflags.com/thumbs/germany/flag-square-250.png',
			alt: 'Deutch'
		},
		{
			id: 4,
			lang: 'uk',
			src: 'https://cdn.countryflags.com/thumbs/ukraine/flag-square-250.png',
			alt: 'Український'
		},
		{
			id: 5,
			lang: 'ru',
			src: 'https://cdn.countryflags.com/thumbs/russia_/flag-square-250.png',
			alt: 'Русский'
		}
	];

	let selected = {
		id: 0,
		src: 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-square-250.png',
		alt: 'English'
	};

	onMount(() => {
		document.addEventListener('click', handleDocumentClick);
	});

	// При уничтожении компонента удаляем обработчик события
	onDestroy(() => {
		document.removeEventListener('click', handleDocumentClick);
	});

	// Добавляем обработчик события на весь документ
	function handleDocumentClick(event) {
		const list = document.querySelector('.list');
		const button = document.querySelector('.collapsible');
		if (list && button) {
			if (!list.contains(event.target) && !button.contains(event.target)) {
				isListOpen = false;
			}
		}
	}
	function toggleList() {
		isListOpen = !isListOpen; // Переключаем состояние списка при клике
	}

	function onSelect(option) {
		lang = option.lang;
		selected = option;
		isListOpen = false; // Закрываем список после выбора варианта
	}
</script>

<div class="collapsible" style="display: flex; align-items: center;">
	<IconButton on:click={toggleList}>
		<div style="padding:10px">
			<img src={selected.src} alt="" />{selected.alt}
		</div>
	</IconButton>
</div>

{#if isListOpen}
	<div class="list">
		{#each options as option (option.id)}
			<span class="lang" on:click={() => onSelect(option)}>
				<img src={option.src} alt="" />
				{option.alt}
			</span>
		{/each}
	</div>
{/if}

<style>
	.collapsible {
		position: absolute;
		right: 0px;
		width: 140px;
		top: 0px;
		display: flex; /* делаем кнопку и изображение горизонтально */
		align-items: center; /* выравниваем элементы по вертикали */
		background-color: transparent;
		color: rgb(3, 3, 3);
		cursor: pointer;
		padding: 5px;
		border: none;
		outline: none;
	}
	.lang {
		display: flex; /* добавляем flex для иконки и текста */
		align-items: center; /* выравниваем элементы по вертикали внутри .lang */
		padding-top: 15px;
	}
	img {
		position: relative;
		width: 15px;
		/* padding-top: 20px; */
		margin-right: 5px;
	}

	.collapsible img {
		margin-left: 0px;
	}

	.list {
		position: absolute;
		right: 0px;
		padding-right: 25px;
		padding-left: 10px;
		top: 50px;
		max-width: 200px;
		overflow: hidden;
		transition: max-height 0.2s ease-out;
		color: black;
		background-color: #f1f1f1;
	}
</style>
