<script>
	import { onMount } from 'svelte';
	import { startAudioMonitoring } from '/src/routes/speech/stt/Stt.js';

	import {
		mdiPagePreviousOutline,
		mdiArrowRight,
		mdiArrowLeft,
		mdiShareVariant,
		mdiMicrophone,
		mdiMicrophoneOutline,
		mdiAccountConvertOutline,
		mdiVolumeHigh,
		mdiPlay
	} from '@mdi/js';

	import IconButton, { Icon } from '@smui/icon-button';

	let userInput = '';
	let messages = [];

	
	// Function to call ChatGPT
	async function callChatGPT() {
		try {
			if (!userInput) return;

			userInput = userInput.slice(0, 500);

			messages = [{ text: userInput, isQuestion: 'question' }, ...messages];

			const response = await fetch(`/chatGPT`, {
				method: 'POST',
				body: JSON.stringify({ question: userInput }),
				headers: { 'Content-Type': 'application/json' }
			});

			userInput = '';

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			const resp = data.resp;
			console.log('resp', resp);
			// Переворачиваем массив для обработки с конца
			// const reversedArray = resp.slice().reverse();

			// Извлекаем значение 'correct' из каждого объекта в перевернутом массиве
			// const correctValues = resp.map((item) => {
			// 	if (item.reply) return JSON.parse(item.reply).correct;
			// });

			// let answer = resp ? resp.correct : 'no answer';

			messages = [{ text: resp, isQuestion: 'answer' }, ...messages];
		} catch (error) {
			console.error('Произошла ошибка при обращении к серверу:', error);
		}
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			callChatGPT();
		}
	}

	onMount(() => {
		callChatGPT(); // Call on component mount for initial question
	});

	function micClicked() {
		function sttResult(data) {
			userInput = data;
			callChatGPT();
		}
		startAudioMonitoring(sttResult); // Здесь должен быть ваш код для активации микрофона
	}
</script>

<div>
	<div
		class="chat-container"
		style="overflow-y: auto;"
	>
		{#each messages as { text, isQuestion }, index (index)}
			<div class="userMessage {isQuestion}" key={index}>
				{text}
			</div>
		{/each}
	</div>
	<div class="input-container">
		<button on:click={callChatGPT}>Отправить</button>
		<div class="mic-button">
			<IconButton on:click={micClicked}>
				<Icon tag="svg" viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiMicrophone} />
				</Icon>
			</IconButton>
		</div>
	</div>

	<div class="textarea-container">
		<textarea
			id="myTextarea"
			maxlength="500"
			bind:value={userInput}
			on:keydown={handleKeyDown}
			placeholder="Задайте вопрос..."
		></textarea>
		<!-- <button class="mic-button" on:click={micClicked}>
			<Icon tag="svg" viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiMicrophone} />
			</Icon>
		</button> -->
	</div>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column-reverse;
		position: relative;
		width: 100%;
		height: 70vh;
		background-color: #f4f4f8;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		padding-bottom: 6px; /* Оставляем место для поля ввода и кнопки */
	}

	.userMessage {
		margin: 5px;
		padding: 8px;
		border-radius: 8px;
		
	}

	.userMessage.question {
		width: 80%;
		background-color: #cce5ff;
		float: left;
	}

	.userMessage.answer {
		width: 80%;
		background-color: #e0e0e0;
		/* margin-left: 60px; */
		float: right;
	}

	.input-container {
		position: relative;
		bottom: 0px;
		width: 95%;
		padding: 0 10px; /* Добавляем отступы */
	}

	button {
		position: relative;
		bottom: 0px; /* Кнопка выше нижней границы на 30px */
	}

	.textarea-container {
		position: relative;
		display: inline-block;
		width: 98%;
	}

	.textarea-container textarea {
		height: 10vh;
		position: relative;
		bottom: 0;
		width: 98%;
	}

	.mic-button {
		position: absolute;
		top: 50%;
		right: 10px; /* Отступ от правого края контейнера */
		transform: translateY(-50%); /* Центрирование по вертикали */
		background: transparent;
		border: none;
		font-size: 20px; /* Размер иконки */
		cursor: pointer;
	}

	/* Стилизация textarea и кнопки по желанию */
</style>
