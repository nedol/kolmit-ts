import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

import { HfInference } from '@huggingface/inference';
const inference = new HfInference('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');






/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch, cookies}) {
  let { question } = await request.json();


  let response = await chatCompletion({
    inputs: question,
  });

  // let response = await queryTextGeneration({
  //   inputs: 'Can you please let us know more details about your ',
  // });
  
  // let response = await query({
  //   inputs: {
  //     question: 'What is my name?',
  //     context: 'My name is Clara and I live in Berkeley.',
  //   },
  // });

  console.log(JSON.stringify(response));

  response = new Response(JSON.stringify({ response}));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}

async function chatCompletion(text) {
  // const mistal = inference.endpoint(
  //   'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2'
  // );
	const response = await fetch(
    'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
    {
      headers: {
        Authorization: 'Bearer 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',
      },
      method: 'POST',
      body: JSON.stringify(text.inputs),
    }
  );
	const result = await response.json();
	return result[0].generated_text;
}

async function queryTextGeneration(data) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/bigscience/bloom',
    {
      headers: {
        Authorization: 'Bearer ' + process.env.HF_TOKEN,
      },
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}


async function queryAnsweringQuestionInContext(data) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
    {
      headers: {
        Authorization: 'Bearer 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',
      },
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

