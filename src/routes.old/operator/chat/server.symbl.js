import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
	apiKey:''
		
});

import prompt_data from './prompt/prompt_data.json';

let context1 = `Обучение голландскому языку. Ты - ассистент-преподаватель, ведущий диалог с пользователем на тему ('знакомство'), 
				цель - представиться, коротко рассказать о себе и получить основные данные пользователя, на языковом уровне ('1.1') голландскоого языка.
				Избегать общих вопросов, не дающих в ответе полезной информации.
				Ты ведешь диалог с пользователем в формате json
				('answer':'<ответ на вопрос или сообщение от пользователя>',
				'q': '<следующий вопрос>',
				'tr':<перевод следующего вопроса>)`;

let context2 = `context:Найти грамматические ошибки в тексте и записать в массив [error] . 
			   Расширенно привести нарушенные грамматические правила в массиве [rule].
			   Дать исправленный вариант- correct. Язык - английский.			   
			   Если есть ошибка - ответ в json: {error: [error], rule:[rule], correct:correct}. 
			   Если ошибки нет - ответ {error: none,correct:correct}`;

async function chat(question) {
	try {
		const message = await anthropic.messages
			.create({
				max_tokens: 1024,
				messages: [
					{
						role: 'user',
						content: 'context:' + context1 + 'question:' + question
					}
				],
				model: 'claude-2.1'
			})
			.catch((err) => {
				if (err instanceof Anthropic.APIError) {
					console.log(err.status); // 400
					console.log(err.name); // BadRequestError
					console.log(err.headers); // {server: 'nginx', ...}
				} else {
					throw err;
				}
			});

		console.log(message.content);

		// Возвращаем массив ответов, преобразуем каждый ответ, чтобы вернуть только reply
		return message.content[0].text;
	} catch (error) {
		console.error('Ошибка при взаимодействии:', error);
		// Возвращаем пустой массив или другое значение, чтобы обработать ошибку на уровне вызова функции
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch, cookies }) {
	let { question } = await request.json();
	// question = `text: Привет, как дела?`;

	let resp = await chat(question);

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
