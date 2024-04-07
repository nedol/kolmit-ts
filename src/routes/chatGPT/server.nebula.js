const axios = require('axios');

const symblAPI = '4b50364e6f507932516870634a7877444249785a494b3768716d39356b6c7977';

const symblSecret =
	'354e5f6267452d784965444f59544f4c625037717538526c6234615671706e4c474a61646a79366d523943454d4947704c7132414b6946625176346854366e6b';

import prompt_data from './prompt/prompt_data.json';

let context1 = `Дай ответ (a1) на вопрос (q1).
				Язык - бельгийский голландский. Ответ в json в формате: {q1: вопрос1 , a1:ответ1 }`;
let context2 = `context:Найти грамматические ошибки в тексте и записать в массив [error] . 
			   Расширенно привести нарушенные грамматические правила в массиве [rule].
			   Дать исправленный вариант- correct. Язык - английский.			   
			   Если есть ошибка - ответ в json: {error: [error], rule:[rule], correct:correct}. 
			   Если ошибки нет - ответ {error: none,correct:correct}`;

async function chatGPT(question) {
	try {
		const data = {
			max_new_tokens: 1024,
			top_p: 0.95,
			top_k: 1,
			system_prompt:
				'You are a sales coaching assistant. You help user to get better at selling. You are respectful, professional and you always respond politely.',
			messages: [{ role: 'human', text: 'Hi' }]
		};

		let response = await axios
			.post('https://api-nebula.symbl.ai/v1/model/chat', data, {
				headers: {
					ApiKey: symblAPI,
					'Content-Type': 'application/json'
				}
			})
			.catch((error) => console.log(error));

		console.log(response.data);

		// Возвращаем массив ответов, преобразуем каждый ответ, чтобы вернуть только reply
		return response.data;
	} catch (error) {
		console.error('Ошибка при взаимодействии:', error);
		// Возвращаем пустой массив или другое значение, чтобы обработать ошибку на уровне вызова функции
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch, cookies }) {
	let { question } = await request.json();
	// question = `text: Привет, как дела?`;

	let resp = await chatGPT(question);

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
