<script>
	import { onMount, onDestroy } from 'svelte';
	// import words from './80.json';
	import { langs } from '$lib/js/stores.js';

	import CircularProgress from '@smui/circular-progress';

	import RV from '../../../speech/tts/RV.svelte';
	let voice;

	import BottomAppBar, { Section, AutoAdjust } from '@smui-extra/bottom-app-bar';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
	import {
		mdiPagePreviousOutline,
		mdiChevronDownCircleOutline,
		mdiHelp,
		mdiVolumeHigh,
		mdiShareVariant
	} from '@mdi/js';

	import { dicts } from '$lib/js/stores.js';

	let dict = $dicts;

	import { lesson } from '$lib/js/stores.js';
	import { dc_oper } from '$lib/js/stores.js';
	import { dc_user } from '$lib/js/stores.js';
	import { call_but_status } from '$lib/js/stores.js';
	import { operator } from '$lib/js/stores.js';
	import { find } from 'lodash';
	export let data;

	let words = [],
		word = '';
	let hints;
	let currentWordIndex = 0;
	let currentWord;
	let hl_words = data.highlight ? data.highlight.split(',') : [];
	let share_mode = false;
	let share_button = false;
	let style_button;
	const style_button_non_shared = `position: relative;
		font-size: 1.5em;	
		color: grey;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		width: 50px`;
	const style_button_shared = `position: relative;
		font-size: 1.5em;
		color: blue;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		width: 50px`;

	let arrayOfArrays;
	let userContent = '';
	let div_input;
	let result = '';
	let hintIndex = 0;
	let errorIndex = 0;

	let showSpeakerButton = false;
	let focus_pos = 0;

	import { msg_user } from '$lib/js/stores.js';
	$: if ($msg_user && $msg_user.obj) {
		word = $msg_user.obj.obj.translation[$langs];
		result = '';
	}

	import { msg_oper } from '$lib/js/stores.js';
	$: if ($msg_oper && $msg_oper.obj) {
		word = $msg_oper.obj.obj.translation[$langs];
		result = '';
	}

	$: switch ($call_but_status) {
		case 'talk':
			share_button = true;
			break;
		default:
			share_button = false;
			share_mode = false;
			style_button = style_button_non_shared;
			break;
	}

	let counter = 0;
	let isVisible = false;

	let names = data.name.split(',');

	for (let n in names) {
		// Создаем массив промисов для каждого запроса
		const fetchPromises = names.map((name) => {
			return fetch(`./lesson?words=theme&name=${name}&owner=${$operator.abonent}`)
				.then((response) => response.json())
				.then((data) => data.data)
				.catch((error) => {
					console.log(error);
					return [];
				});
		});
		// Ждем завершения всех запросов
		Promise.all(fetchPromises)
			.then((allData) => {
				// allData - это массив результатов каждого запроса
				words = [].concat(...allData); // Объединяем массивы в один
				// console.log(words);
				hints = [...words];
				// shuffle(hints);
				// currentWord = words[currentWordIndex];
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	}

	function highlightWords() {
		hl_words.forEach((woord) => {
			const regex = new RegExp(
				`\\b[${woord.charAt(0).toUpperCase()}${woord.charAt(0).toLowerCase()}]${woord.slice(1)}\\b`,
				'g'
			);

			userContent = userContent.replace(
				regex,
				`<span class="highlight" style="color: green;background-color: transparent">${woord}</span>`
			);
		});

		Object.keys(words).forEach((i) => {
			const woord = words[i].original;
			const regex = new RegExp(
				`\\b[${woord.charAt(0).toUpperCase()}${woord.charAt(0).toLowerCase()}]${woord.slice(1)}\\b`,
				'g'
			);

			userContent = userContent.replace(
				regex,
				`<span class="highlight" style="color: green;background-color: transparent">${woord}</span>`
			);
		});
	}

	let bottomAppBar;

	// $: if (div_input) div_input.focus();

	$: if (currentWord) {
		word = currentWord.translation[$langs];
		// Устанавливаем фокус в конец строки
		setFocus();
	}

	onMount(async () => {});

	onDestroy(() => {
		// Очищаем интервал при размонтировании компонента

		console.log('Компонент размонтирован');
	});

	function handleBackClick() {
		$lesson.data = { quiz: '' }; // При клике на "Back" показываем компонент Lesson
	}

	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	function defineWordsArray() {
		const originalArray = words;

		// Определение длины массива
		const arrayLength = originalArray.length;

		// Определение количества подмассивов
		const chunkSize = 10;
		const numberOfChunks = Math.ceil(arrayLength / chunkSize);

		// Разбиваем массив на подмассивы по 10 элементов
		arrayOfArrays = [];

		for (let i = 0; i < numberOfChunks; i++) {
			const start = i * chunkSize;
			const end = (i + 1) * chunkSize;
			const chunk = originalArray.slice(start, end);
			arrayOfArrays.push(chunk);
		}

		// console.log(arrayOfArrays);
	}

	function setFocus() {
		return;
		setTimeout(() => {
			const range = document.createRange();
			const selection = window.getSelection();
			range.selectNodeContents(div_input);
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);
		});
	}

	function checkInput() {
		const targetWord = words[currentWordIndex].original;
		userContent = userContent.replace(/&nbsp;/g, '').replace(/<\/?[^>]+(>|$)/g, '');
		const trimmedUserContent = userContent.trim();
		focus_pos = 0;

		if (trimmedUserContent.toLowerCase() === targetWord.toLowerCase()) {
			showCheckMark = true; // Показываем галочку
			showNextButton = true;
			speak(currentWord.original);

			if (hintIndex != 0 || errorIndex != 0) {
				// Перемещаем текущее слово в конец своей "десятки" в words
				words.splice(currentWordIndex, 1);
				words.splice(parseInt(currentWordIndex / 10) * 10 + 9, 0, currentWord);
				// Создаем клон текущего слова
				const currentWordClone = { ...currentWord };
				// Проверяем, достаточно ли элементов в массиве words для добавления в следующую "двадцатку"
				if (currentWordIndex + 20 < words.length) {
					// Вычисляем индекс конечного элемента в следующей "двадцатке"
					const nextTwentyIndex = currentWordIndex + 20;
					// Вставляем клон currentWord в конец следующей "двадцатки"
					words.splice(nextTwentyIndex, 0, currentWordClone);
				} else {
					// Если условие не выполняется, вставляем клон currentWord в конец массива words
					words.push(currentWordClone);
				}

				words = words;
				currentWordIndex = currentWordIndex - 1;
				errorIndex = 0;
			}

			userContent = currentWord.example;
			highlightWords(userContent);
			// nextWord();
		} else {
			showCheckMark = false;
			result = '';

			let i = 0;

			while (i < targetWord.length || i < trimmedUserContent.length) {
				if (!trimmedUserContent[i]) {
					// Недостающие символы выделяются пустым span с красной окантовкой
					result += `<span class="empty_block" onchage="onChangeUserContent" 
					style="display: inline-block; 
						background-color:rgba(255, 240, 251, 0.9);
						border:1px solid rgba(255, 240, 251, 0.9); 
						width:10px">&nbsp;</span>`;
				} else if (trimmedUserContent[i] === targetWord[i]) {
					// Совпадающие символы
					result += `<span class="correct">${targetWord[i]}</span>`;
					focus_pos = i + 1;
				} else {
					// Несовпадающие символы
					result += `<span style="color:red;  ">${trimmedUserContent[i]}</span>`;
					errorIndex++;
				}

				i++;
			}

			userContent = result;
			// Устанавливаем фокус в конец строки в div_input
			setFocus();
		}
	}

	function onChangeUserContent(ev) {
		return;
		let ar = document.getElementsByClassName('empty_block');
		if (ar.length > 0) {
			// console.log(ar.length);
			ar[0].remove();
		}
	}

	function showHint() {
		// wordsString = shuffleWords(wordsString);
		if (currentWord && hintIndex < currentWord.original.length) {
			if (hintIndex === 0) {
				userContent = '';
			}
			userContent += currentWord.original[hintIndex];
			hintIndex++;

			result = ''; // Очистим результат при каждой новой подсказке
			showSpeakerButton = true; // Устанавливаем видимость кнопки
			setFocus();
		}
	}

	function onSpeach() {
		speak(currentWord.original);
	}

	function speak(text) {
		setTimeout(() => {
			voice.Speak(text);
		}, 0);

		// }

		setFocus();
	}

	function OnClickHint(ev) {
		userContent = ev.target.innerHTML.replace(/&nbsp;/g, '').trim();
		const obj = find(words, { original: userContent });
		if (obj) {
			word = obj.translation[$langs];
			result = userContent;
		}

		SendData(obj);
	}

	async function onShare() {
		// Обработчик нажатия на кнопку "share"
		share_mode = !share_mode;
		style_button = share_mode ? style_button_shared : style_button_non_shared;
		const dc = $dc_user || $dc_oper;
		if (share_mode && dc) {
			await dc.SendData(
				{
					lesson: {
						quiz: data.quiz,
						name: data.name
					}
				},
				(ex) => {
					console.log(ex);
				}
			);
		}
	}

	async function SendData(obj) {
		const dc = $dc_user || $dc_oper;
		if (dc)
			await dc.SendData(
				{
					obj: { obj }
				},
				(ex) => {
					console.log(ex);
				}
			);
	}
</script>

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>

<RV bind:this={voice}></RV>

<main>
	{#if !words[0]}
		<div style="text-align:center">
			<span class="material-symbols-outlined" style="font-size: 20px; color: blue; scale:1.5;">
				<CircularProgress style="height: 50px; width: 50px;" indeterminate />
			</span>
		</div>
	{/if}

	{#if words}
		<div style="position:relative;float:left">
			<!-- <IconButton class="material-icons"  on:click={showHint}>
				<Icon tag="svg" viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiHelp} />
				</Icon>
			</IconButton> -->

			<button class="hint-button" on:click={showHint}>
				<span class="material-symbols-outlined"> ? </span>
				<!-- <IconButton class="material-icons" on:click={showHint}>
					<Icon tag="svg" viewBox="0 0 24 24">
						<path fill="currentColor" d={mdiHelp} />
					</Icon>
				</IconButton> -->
			</button>

			<div style="position:relative;float:right">
				<button on:click={checkInput} class="check-button">{dict['Проверить'][$langs]}</button>
			</div>
		</div>

		<div class="title">{dict['Твой ход'][$langs]}:</div>

		<div class="word">
			<!-- {@debug currentWord} -->
			<h3>{word}</h3>

			{#if showSpeakerButton}
				<div class="speaker-button">
					<IconButton on:click={onSpeach}>
						<Icon tag="svg" viewBox="0 0 24 24">
							<path fill="currentColor" d={mdiVolumeHigh} />
						</Icon>
					</IconButton>
				</div>
				<!-- <button on:click={onSpeach} class="speaker-button">
					<span class="material-symbols-outlined" style="font-size: 15px; color: blue; scale:1.5">
						volume_up
					</span>
				</button> -->
			{/if}
		</div>

		<div>{currentWordIndex + 1}/{words.length}</div>

		<div class="input-container">
			<div
				class="input"
				contenteditable="true"
				on:input={onChangeUserContent}
				bind:this={div_input}
				
			>
				{@html result}
			</div>
		</div>
		<div class="title">Выбери слово:</div>
		<!-- {#if hintIndex != 0} -->
		<div class="words_div accordion-container">
			{#if hints}
				<Panel>
					<Content style="line-height: 2.2;">
						{#each hints as hint}
							<span class="hint_button" on:click={OnClickHint}>
								{@html hint.original + '&nbsp;' + '&nbsp;'}
							</span>
						{/each}
					</Content>
				</Panel>
			{/if}
		</div>

		<!-- {/if} -->
	{/if}
</main>

{#if share_button && $call_but_status === 'talk'}
	<div class="share_button_div" on:click={onShare}>
		<IconButton>
			<Icon tag="svg" viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiShareVariant} />
			</Icon>
		</IconButton>
	</div>
{/if}

<style>
	main {
		background-color: #fff;
		transition: transform 0.3s ease-in-out;
		width: 90%;
		margin: 0 auto;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.5s;
		height: 90vh;
	}
	.title {
		color: grey;
		position: relative;
		text-align: center;
		margin: 15px;
	}

	.share_button_div {
		position: fixed;
		bottom: 55px;
	}

	.hint_button {
		display: inline-block;
		border: solid 0.1em #9f3f3f;
		border-radius: 5px;
		text-align: center;
		width: auto;
		padding-left: 8px;
		margin: 5px;
		background-color: transparent;
	}

	/* Стилизуйте компонент по вашему усмотрению */
	.word {
		flex-direction: column;
		align-items: center;
		margin: 0;
		text-align: center;
	}

	h1 {
		margin-bottom: 20px;
	}

	.hidden {
		opacity: 0;
		pointer-events: none;
	}

	p {
		position: relative;
		transition: opacity 0.5s ease;
		text-align: center;
		font-size: xx-large;
		margin: 0;
	}

	.speaker-button {
		position: absolute;
		flex: auto;
		top: 260px;
		right: 30px;
		transform: translate(50%, 0%);
		font-size: large;
	}

	.input-container {
		position: relative;
		width: 90%;
		margin: 0px auto;
		display: flex; /* Добавлено свойство display: flex; */
		align-items: center; /* Добавлено свойство align-items: center; */
	}

	.words_div {
		/* width: 95%; */
		margin-top: 5px;
		text-align: center;
		overflow-y: auto;
	}

	.input {
		flex: 1;
		letter-spacing: 2px;
		padding: 5px;
		text-align: center;
		color: blue;
		background-color: aliceblue;
		border: none;
		font-size: large;
	}

	.input:focus {
		outline: none;
	}

	.check-button,
	.next-button {
		margin-top: 50px;
		padding: 8px 10px;
		font-size: 16px;
		font-weight: 500;
		border-color: #2196f3;
		border-radius: 5px;
		cursor: pointer;
		color: #2196f3;
	}

	.material-symbols-outlined {
		font-size: 15px;
		scale: 1.5;
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}

	.hint-button {
		color: white;
		background-color: #2196f3;
		border-radius: 3px;
		padding: 8px 20px;
		margin-top: 50px;
	}
</style>
