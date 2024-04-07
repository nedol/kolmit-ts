import path from 'path';
import { fileURLToPath } from 'url';

const https = require('https');
const fs = require('fs');

const url_deepgram = 'https://api.deepgram.com/v1/speak?model=aura-asteria-nl';

// Set your Deepgram API key
const apiKey_deepgram = 'a9e8cd740788fd5fbee5a56dbb7c16907d65ae8d';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request, response }) {
	let resp;
	let abonent = url.searchParams.get('abonent');
	const { par } = await request.json();
	const q = par;

	switch (q.func) {
		case 'tts':
			resp = await textToSpeechDeepgram(q.text);
			break;
	}

	response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}

async function textToSpeech(text) {
	const url = 'https://api.wit.ai/synthesize?v=20230215';
	// Замените на ваш токен
	const headers = {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
		Accept: 'audio/pcm'
	};

	const requestData = {
		q: text,
		voice: 'Rebecca'
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(requestData)
		});

		if (!response.ok) {
			throw new Error(`Ошибка: ${response.status}`);
		}

		const blob = await response.blob();
		return response;
	} catch (error) {
		console.error('Ошибка запроса:', error);
		let response = new Response(JSON.stringify({ error }));
		response.headers.append('Access-Control-Allow-Origin', `*`);
		return response;
	}
}

async function textToSpeechDeepgram(text) {
	const options = {
		method: 'POST',
		headers: {
			Authorization: `Token ${apiKey_deepgram}`,
			'Content-Type': 'application/json'
		}
	};

	// Define the payload
	const data = JSON.stringify({
		text: text
	});

	// Make the POST request
	const req = https.request(url_deepgram, options, (res) => {
		// Check if the response is successful
		if (res.statusCode !== 200) {
			console.error(`HTTP error! Status: ${res.statusCode}`);
			return;
		}
		// Save the response content to a file
		const dest = fs.createWriteStream('./routes/src/speech/tts/output.mp3');
		res.pipe(dest);
		dest.on('finish', () => {
			console.log('File saved successfully.');
		});
	});

	// Handle potential errors
	req.on('error', (error) => {
		console.error('Error:', error);
	});

	// Send the request with the payload
	req.write(data);
	req.end();
}
