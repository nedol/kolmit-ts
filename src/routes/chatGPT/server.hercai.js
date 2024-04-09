// import Chat from 'chatgpt-unlimited';
// import { authToken } from './chatgpt_tokken.js';

import { Hercai } from 'hercai';
const herc = new Hercai();

import prompt_data from './prompt/prompt_data.json';

let prompt1 = `В котексте (context1, context2) дай ответ (a1) на вопрос (q1).
				Язык - бельгийский голландский. Ответ в json в формате: {q1: вопрос1 , a1:ответ1 }`;
let prompt2 = `Найти грамматические ошибки в тексте и записать в массив [error] . 
			   Расширенно привести нарушенные грамматические правила в массиве [rule].
			   Дать исправленный вариант- correct. Язык - фламандский.			   
			   Если есть ошибка - ответ в json: {error: [error], rule:[rule], correct:correct}. 
			   Если ошибки нет - ответ {error: none,correct:correct}`;

async function chatGPT(question) {
	try {
		/* Available Models */
		const models = ['v3', 'v3-32k', 'turbo', 'turbo-16k', 'gemini'];

		// Создаем массив промисов, используя map для отправки запроса для каждой модели
		const promises = models.map((model) =>
			herc.question({
				model: model,
				content: JSON.stringify({ model: model, context1: prompt2, q1: question })
			})
		);

		// Дожидаемся выполнения всех промисов
		const responses = await Promise.all(promises);

		// Возвращаем массив ответов, преобразуем каждый ответ, чтобы вернуть только reply
		return responses;
	} catch (error) {
		console.error('Ошибка при взаимодействии с Hercai:', error);
		// Возвращаем пустой массив или другое значение, чтобы обработать ошибку на уровне вызова функции
	}
}

async function Text2Image() {
	//  Available Models:
	//  "v1" , "v2" , "v2-beta" , "v3" (DALL-E) , "lexica" , "prodia", "simurg", "animefy", "raava", "shonin"
	// let response = await herc.question(https://hercai.onrender.com/{model}/text2image?prompt=4k red formula 1
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch, cookies }) {
	let { question } = await request.json();
	question = 'Waar woont uw familie?';

	let resp = await chatGPT(question);

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
