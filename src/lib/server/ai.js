import { config } from 'dotenv';
config();

const HF_TOKEN = process.env.HF_TOKEN;

import { Client, client } from '@gradio/client';

import Groq from 'groq-sdk';
const groq = new Groq({
  apiKey: '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', //process.env.GROQ_API_KEY,
});

export async function CreateContent(par) {
  const content = await chatGroq(par.prompt.system, '');

  return content;
}

async function chatLlama(system, task) {
  const app = await Client.connect('huggingface-projects/llama-2-7b-chat', {
    hf_token: HF_TOKEN,
  });

  const app_info = await app.view_api();

  let result;

  try {
    result = await app.predict('/chat', {
      message: task,
      system_prompt: system,
      max_new_tokens: 1024,
      temperature: 0.6,
      top_p: 0.9,
      top_k: 50,
      repetition_penalty: 1,
    });
  } catch (ex) {}

  return result.data[0];

  // async function query(data) {
  //   const response = await fetch(
  //     'https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf',
  //     {
  //       headers: {
  //         Authorization: 'Bearer ' + HF_TOKEN,
  //       },
  //       method: 'POST',
  //       body: JSON.stringify(data),
  //     }
  //   );
  //   if (!response.ok) {
  //     // Read the response as text to log the error message
  //     const errorText = await response.text();
  //     throw new Error(
  //       `HTTP error! status: ${response.status}, message: ${errorText}`
  //     );
  //   }
  //   return await response.text();
  // }

  // const response = await query({
  //   inputs: 'Can you please let us know more details about your ',
  // });
  // return response.data;
}

async function chatGPTo(system, task) {
  const app = await Client.connect('KingNish/OpenGPT-4o', {
    hf_token: HF_TOKEN,
  });
  const app_info = await app.view_api();

  console.log(app_info.named_endpoints['/chat']);
  const result = await app.predict('/chat', {
    user_prompt: { text: system, files: [] },
    model_selector: 'idefics2-8b-chatty',
    decoding_strategy: 'Top P Sampling',
    temperature: 0.5,
    max_new_tokens: 2048,
    repetition_penalty: 0.01,
    top_p: 0.9,
    web_search: true,
    audio: '', // Add this line to include an audio parameter
    image3: '',
  });

  return result.data;
}

async function chatGroq(system, task) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: system,
        },
        {
          role: 'user',
          content: task,
        },
      ],
      model: 'mixtral-8x7b-32768', //'llama2-70b-4096',//
      temperature: 0.9,
      top_p: 1,
      stop: null,
      max_tokens: 4096,
      stream: false,
    });

    return chatCompletion.choices[0].message.content;

    // Возвращаем массив ответов, преобразуем каждый ответ, чтобы вернуть только reply
  } catch (error) {
    console.error('Ошибка при взаимодействии:', error);
    // Возвращаем пустой массив или другое значение, чтобы обработать ошибку на уровне вызова функции
  }
}
