import { config } from 'dotenv';
config();

import { Client, client } from '@gradio/client';

import { GetPrompt } from '../../../lib/server/db';

import { Translate } from './../../translate/Translate';

import Groq from 'groq-sdk';
// import { HF_TOKEN } from '$env/static/private';
const HF_TOKEN = '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';

const groq = new Groq({
  apiKey: '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',
});

// import prompt_data from './prompt/prompt_data.json';
let assistant = '';
let resp = '';
let messages = [];
let cnt = 0;

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  let { question } = await request.json();

  const prompt = await GetPrompt('chat');

  const task = await Translate(question.text, question.lang, 'en');

  let answer = await chatGroq(prompt.prompt.system, task);

  let res = {
    ['nl']: await Translate(answer, question.llang, 'nl'),
    ['en']: await Translate(answer, question.llang, 'en'),
    [question.lang]: await Translate(answer, question.llang, question.lang),
  };

  // let task2 = `[continue]{dialogue:${JSON.stringify(dialog)}}`;
  // let user2 = await chat(chatGroq2, system2, task2);

  let response = new Response(JSON.stringify({ res }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}


async function chatLlama(system, task) {
  const app = await Client.connect('huggingface-projects/llama-2-7b-chat', {
    hf_token: HF_TOKEN,
  });

  const result = await app.predict('/chat', {
    message: task,
    request: system,
    param_3: 1024,
    param_4: 0.6,
    param_5: 0.9,
    param_6: 50,
    param_7: 1,
  });

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

async function chatTranformers(system, task) {
  const pipe = await pipeline(
    'text-generation',
    'Felladrin/onnx-TinyMistral-248M-Chat-v2'
  );

  const response = await pipe(task, {
    max_new_tokens: 500,
    temperature: 0.9,
  });
  return response;

  // let model = await AutoModel.from_pretrained(
  //   'robinsmits/Qwen1.5-7B-Dutch-Chat'
  // );

  // let model = await AutoModelForCausalLM.from_pretrained(
  //   'Salesforce/codegen-350M-mono'
  // );

  // let tokenizer = await AutoTokenizer.from_pretrained(
  //   'Salesforce/codegen-350M-mono'
  // );

  // let text = 'def hello_world():';
  // let input_ids = tokenizer(text, { return_tensors : 'pt' }).input_ids;

  // let generated_ids = model.generate(input_ids, { max_length : 128 });

  //   const messages = [
  //     {
  //       role: 'user',
  //       content: 'Hoi hoe gaat het ermee? Wat kun je me vertellen over appels?',
  //     },
  //   ];

  //   const encoded_ids = tokenizer.apply_chat_template(messages, true, 'pt');

  //   const input_ids = encoded_ids.to('cuda');
  //   const generated_ids = model.generate(input_ids, 256, true);
  // }
}
