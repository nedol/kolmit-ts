import path from 'path';
import { fileURLToPath } from 'url';

const { Wit } = require('node-wit');
const { RealtimeSession } = require('speechmatics');


const client = new Wit({ accessToken: 'WWJSDBA5JAVB4WP4JNKULL2CAZ7JCPL7' });
const token = 'WWJSDBA5JAVB4WP4JNKULL2CAZ7JCPL7';

const SpeechmaticksApiKey = 'qL5GWJx1JRZToID2YkyPnLFQpwOXCXdO';

// import audioEncoder from 'audio-encoder';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request }) {
	// const audioBlob = await request.blob(); // Получаем Blob объект
	const formData = await request.formData();
	let fileContent = formData.get('file');

	// Преобразование Blob в Buffer
	const buffer = await fileContent.arrayBuffer();
	let nodeBuffer = Buffer.from(buffer);

	// const resp = await client.speech('audio/ogg', audioBlob);
	// let resp = await sendAudioToWitAI(nodeBuffer);

	let resp = await sendAudioToSpeechmaticks(buffer);

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}

async function sendAudioToWitAI(audioFile) {
	const token = 'WWJSDBA5JAVB4WP4JNKULL2CAZ7JCPL7'; // Замените на ваш серверный токен доступа
	const context = 'context=' + encodeURIComponent('{ "locale": "nl_NL"}');
	const url = `https://api.wit.ai/speech?v=20230215&${context}`;

	let res;

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'audio/wav' //audio/ogg'
			},
			body: audioFile

			// duplex: 'half' // Указывает, что поток только для чтения
		})
			.then((response) => response.text())
			.then((data) => (res = data))
			.catch((error) => console.error('Ошибка от Wit.ai:', error));

		// if (!response.ok) {
		// 	throw new Error(`Ошибка от Wit.ai: ${response.status}`);
		// }

		// const data = await response.json();
		console.log('Ответ Wit.ai:', res);
		return res;
	} catch (error) {
		console.error('Ошибка при отправке аудио в Wit.ai:', error);
	}
}

async function sendAudioToSpeechmaticks(buffer) {
	let transcript = '';
	return new Promise((resolve, reject) => {
		const session = new RealtimeSession({ apiKey: SpeechmaticksApiKey });

		session.addListener('Error', (error) => {
			console.log('session error', error);
			reject(error);
		});

		session.addListener('AddTranscript', (message) => {
			console.log('AddTranscript', message.metadata.transcript);
			session.stop(); // Остановить сессию после получения первого полного транскрипта
			// resolve(message.metadata.transcript); // Разрешить промис с полученным транскриптом
			if (message.metadata.transcript) transcript += message.metadata.transcript;
		});

		session.addListener('EndOfTranscript', () => {
			console.log('EndOfTranscript');
			resolve(transcript); // Разрешить промис без данных, если транскрипт не был добавлен
		});

		session
			.start({
				transcription_config: {
					language: 'nl',
					operating_point: 'enhanced',
					enable_partials: true,
					max_delay: 2
				},
				audio_format: { type: 'file' }
			})
			.then(() => {
				session.sendAudio(buffer);
			})
			.catch((error) => {
				console.log('error', error.message);
				reject(error);
			});
	});
}
