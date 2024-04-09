<script>
	import { onMount, getContext, onDestroy } from 'svelte';
	import translate from 'translate';
	import RV from '../../../speech/tts/RV.svelte';
	let voice;
	import CircularProgress from '@smui/circular-progress';

	import IconButton, { Icon } from '@smui/icon-button';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import {
		mdiPagePreviousOutline,
		mdiChevronDownCircleOutline,
		mdiHelp,
		mdiVolumeHigh,
		mdiPause,
		mdiPlay
	} from '@mdi/js';

	import pkg from 'lodash';
	const { merge } = pkg;

	translate.from = 'nl';
	translate.engine = 'google';
	import { langs } from '$lib/js/stores.js';

	import { lesson } from '$lib/js/stores.js';

	export let data;
	let bottomAppBar;
	let woorden = data.words,
		orig_text,
		text,
		trans = '',
		trans_div;

	let bottomOpen = true;
	let containerWidth = '100%';
	let containerHeight = '100vh';
	const abonent = getContext('abonent');
	let speaker = mdiVolumeHigh;

	$: if (data.name) {
		init();
	}

	async function init() {
		if (!orig_text)
			fetch(
				`/lesson?text=theme&level=${data.level}&theme=${data.theme}&title=${data.name}&abonent=${abonent}`
			)
				.then((response) => response.json())
				.then((data) => {
					orig_text = text = data.obj.text;
					fetchText();
				})
				.catch((error) => {
					console.log(error);
					return [];
				});
	}

	function fetchText() {
		fetch(`/lesson?dict=theme&level=${data.level}&theme=${data.theme}&abonent=${abonent}`)
			.then((response) => response.json())
			.then((data) => {
				woorden = merge(woorden, JSON.parse(data.data));
				highlightWords();
			})
			.catch((error) => {
				console.error('Error fetching text:', error);
				return [];
			});
	}

	async function handleBackClick() {
		$lesson.data = { quiz: '' }; // При клике на "Back" показываем компонент Lesson
	}

	async function Translate(text) {
		try {
			if (woorden[text]) {
				return woorden[text][$langs];
			} else {
				return await translate(text.trim().toLowerCase(), $langs);
			}
		} catch (error) {
			console.error('Translation error:', error);
			return text; // или другое подходящее значение по умолчанию
		}
	}

	function searchWordsWithPartialMatch(words, searchTerm, matchPercentage) {
		const searchTermLower = searchTerm.toLowerCase();

		function calculateMatchPercentage(str1, str2) {
			const longerStr = str1.length > str2.length ? str1 : str2;
			const shorterStr = str1.length > str2.length ? str2 : str1;
			const matchPercentage = (shorterStr.length / longerStr.length) * 100;

			return matchPercentage;
		}

		const matchedWords = words.filter((word) => {
			const wordLower = word.toLowerCase();
			const percentage = calculateMatchPercentage(wordLower, searchTermLower);
			return percentage >= matchPercentage;
		});

		return matchedWords;
	}

	onMount(async () => {
		const parentWidth = window.innerWidth;
		containerWidth = parentWidth + 'px';

		const parentHeight = window.innerHeight;
		containerHeight = parentHeight + 'px';
	});

	onDestroy(() => {});

	function measureTextSize(text, cb) {
		const measureElement = trans_div;
		measureElement.textContent = text;
		const computedStyle = window.getComputedStyle(measureElement);
		measureElement.style.font = computedStyle.fontSize;

		const width = measureElement.offsetWidth;
		const height = measureElement.offsetHeight;

		cb({ width, height });
	}

	function highlightWords() {
		Object.keys(woorden).forEach((woord) => {
			const regex = new RegExp(
				`\\b[${woord.charAt(0).toUpperCase()}${woord.charAt(0).toLowerCase()}]${woord.slice(1)}\\b`,
				'g'
			);

			text = text.replace(
				regex,
				`<span class="highlight" style="color: red;background-color: transparent" trans="${woorden[woord][$langs]}">${woord}</span>`
			);
		});
	}

	function TTSSpeak(text) {
		voice.Speak(text.replace(/<[^>]*>/g, ''));
	}

	function TTSPause() {
		voice.Pause();
	}

	function TTSResume() {
		voice.Resume();
	}
	async function onClickText(event) {
		let x, y;
		if (event.target.attributes['trans']) {
			x = event.clientX - 35;
			y = event.clientY - 40 + window.scrollY;
			trans_div.style.top = `${y}px`;
			trans_div.style.left = `${x}px`;
			trans_div.style.visibility = 'visible';
			trans = event.target.attributes['trans'].nodeValue;
			TTSSpeak(event.target.innerText);
		} else {
			let selection = window.getSelection();

			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();

			let word = selection.anchorNode.data.substring(
				selection.anchorOffset,
				selection.extentOffset
			);

			TTSSpeak(word);

			trans = await Translate(word);

			x = rect.x;
			y = rect.y - 28 + window.scrollY;

			trans_div.style.top = `${y}px`;
			trans_div.style.left = `${x}px`;
			trans_div.style.visibility = 'visible';

			await new Promise((resolve) => setTimeout(resolve, 0));

			measureTextSize(trans, (transSize) => {
				if (x + transSize.width > window.innerWidth) {
					trans_div.style.left = `${window.innerWidth - transSize.width - 50}px`;
					trans_div.style.width = `${transSize.width}`;
				}
			});
		}

		setTimeout(
			(trans_div) => {
				trans_div.style.visibility = 'hidden';
				trans = '';
			},
			2000,
			trans_div
		);
	}

	function onContinueClick() {
		paused = false;
		cnt++;
		fetchText();
	}

	let touchStartTime = 0;
	function onTouchStart(event) {
		// Запомните время начала касания
		touchStartTime = new Date().getTime();
	}

	async function onSelectionEnd(event) {
		let x, y;
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		const touchEndTime = new Date().getTime();
		const touchDuration = touchEndTime - touchStartTime;
		if (touchDuration >= 500) {
			if (selection && selection.toString().trim() !== '') {
				if (event.target.attributes['trans']) {
					x = rect.x;
					y = rect.y - 28 + window.scrollY;
					trans_div.style.top = `${y}px`;
					trans_div.style.left = `${x}px`;
					trans_div.style.visibility = 'visible';
					trans = event.target.attributes['trans'].nodeValue;
					await TTSSpeak(event.target.innerText);
					return;
				}

				// Выделение текста завершено
				const selectedText = selection.toString().trim();
				trans = await Translate(selectedText);
				x = rect.x;
				y = rect.y - 28 + window.scrollY;

				trans_div.style.top = `${y}px`;
				trans_div.style.left = `${x}px`;
				trans_div.style.visibility = 'visible';
			}
		}
	}

	function onSpeach(ev) {
		if (speaker === mdiVolumeHigh) {
			TTSSpeak(orig_text);
			speaker = mdiPause;
		} else if (speaker === mdiPause) {
			TTSPause();
			speaker = mdiPlay;
		} else if (speaker === mdiPlay) {
			TTSResume();
			speaker = mdiPause;
		}
	}
</script>

<RV bind:this={voice}></RV>

<!-- <button  class="speaker-button"> -->
<main>
	{#if !text}
		<span class="material-symbols-outlined" style="font-size: 20px; color: blue; scale:1.5">
			<CircularProgress style="height: 30px; width: 30px;" indeterminate />
		</span>
	{:else}
		<div class="speaker_div" on:click|preventDefault|stopPropagation={onSpeach}>
			<IconButton class="material-icons">
				<Icon tag="svg" viewBox="0 0 24 24">
					<path fill="currentColor" d={speaker} />
				</Icon>
			</IconButton>
		</div>
	{/if}

	<!-- </button> -->
	<div class="accordion-container">
		<Accordion>
			<Panel>
				<Header>
					<h3>{data.title}</h3>
					<IconButton class="material-icons">
						<Icon tag="svg" viewBox="0 0 24 24">
							<path fill="currentColor" d={mdiChevronDownCircleOutline} />
						</Icon>
					</IconButton>
				</Header>
				<Content style="line-height: 2.2;">
					<div
						class="text_container"
						style="height:{window.innerHeight};"
						on:touchend={onSelectionEnd}
						on:mouseup={onSelectionEnd}
					>
						{@html text}
					</div>
				</Content>
			</Panel>
		</Accordion>
	</div>
</main>

<div id="translationOverlay" bind:this={trans_div}>{trans}</div>

<style>
	main {
		text-align: center;
		width: 90%;
		margin: 0 auto;
	}
	#translationOverlay {
		display: block;
		position: absolute;
		/* width: 400px; */
		word-break: break-all;
		background-color: rgba(255, 255, 255, 0.61);
		right: 5px;
		/* padding: 5px; */
		/* white-space: nowrap; */
		height: auto;
		color: green;
		visibility: hidden;
	}

	.text_container {
		width: 90%;
		line-height: 50px;
		/* font-weight: 100; */
		margin: 0 auto;
		text-align: justify;
	}
	.speaker_div {
		position: fixed;
		right: 12px;
		top: 22vh;
		z-index: 2;
		border: darkgrey solid 1px;
		border-radius: 25px;
	}

	::selection {
		color: rgb(27, 155, 49);
		background: yellow;
	}
</style>
