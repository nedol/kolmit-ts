import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

import { HfInference } from '@huggingface/inference';
const hf = new HfInference(process.env.HF_TOKEN);


async function query(data) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/facebook/m2m100_1.2B', //  google/gemma-7b',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
      },
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch, cookies }) {
  let { topic, dialog } = await request.json();

  query({ inputs: 'The answer to the universe is' }).then((response) => {
    console.log(JSON.stringify(response));
  });

  let data = { content: [{}] };
  let response = new Response(JSON.stringify({ data }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}
