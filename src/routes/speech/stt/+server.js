import path from 'path';
import { fileURLToPath } from 'url';

import translate from 'translate';
translate.engine = 'google';
// import { pipeline } from '@xenova/transformers';

// Allocate a pipeline for sentiment-analysis

// [{'label': 'POSITIVE', 'score': 0.999817686}]

import { HfInference } from '@huggingface/inference';
const HF_TOKEN = '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';
const inference = new HfInference(HF_TOKEN);

// import audioEncoder from 'audio-encoder';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request }) {
  // const audioBlob = await request.blob(); // Получаем Blob объект
  const formData = await request.formData();
  const fileContent = formData.get('file');
  const from_lang = formData.get('from_lang');
  const to_lang = formData.get('to_lang');

  // Преобразование Blob в Buffer
  const buffer = await fileContent.arrayBuffer();
  const nodeBuffer = Buffer.from(buffer);
  const blob = new Blob([nodeBuffer]);
  const arrayBuffer = await blob.arrayBuffer();
  let resp;

  // resp = await queryHF(buffer);

  if (from_lang == '_en') {
    resp = await stt_en(arrayBuffer, from_lang);
    if (resp) {
      resp = {
        [from_lang]: resp.text,
        [to_lang]: await Translate(resp.text, from_lang, to_lang),
      };
    }

  } else if (from_lang == 'nl') {
    resp = await stt_nl(arrayBuffer);
    if (resp) {
      resp = { [from_lang]: resp.text };
    }

  } else  {
    resp = await stt(arrayBuffer, from_lang);
    if (resp) {
      resp = {
        [from_lang]: resp.text,
        [to_lang]: await Translate(resp.text, from_lang, to_lang),
      };
    }

  }

  console.log(resp);
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}

async function Translate(text, from_lang, to_lang) {
  if (!text || !from_lang || !to_lang) return '';

  try {
    translate.from = from_lang;

    return await translate(text.trim(), to_lang);
  } catch (error) {
    console.error('Translation error:', error);
    return text; // или другое подходящее значение по умолчанию
  }
}

async function stt(arrayBuffer, from_lang) {
  try {
    return await inference.automaticSpeechRecognition({
      data: arrayBuffer,
      model: 'openai/whisper-large-v3',
      language: from_lang,
    });
  } catch (ex) {
    console.log(ex);
  }
}

async function stt_nl(arrayBuffer, from_lang) {
  try {
    return await inference.automaticSpeechRecognition({
      data: arrayBuffer,
      model: 'jonatasgrosman/wav2vec2-large-xlsr-53-dutch',
      language: 'nl',
    });
  } catch (ex) {
    console.log(ex);
  }
}

async function stt_en(arrayBuffer, from_lang) {
  try {
    return await inference.automaticSpeechRecognition({
      data: arrayBuffer,
      model: 'hannatoenbreker/whisper-dutch-small-v2',
      language: from_lang,
    });
  } catch (ex) {
    console.log(ex);
  }
}

async function queryHF(data) {
  const response = await fetch(
    // 'https://api-inference.huggingface.co/models/openai/whisper-large-v3',//English 5!
    // 'https://api-inference.huggingface.co/models/hannatoenbreker/whisper-dutch', //0
    // 'https://api-inference.huggingface.co/models/renesteeman/whisper-tiny-dutch',//3
    // 'https://api-inference.huggingface.co/models/nithinholla/wav2vec2-large-xlsr-53-dutch',//3
    // 'https://api-inference.huggingface.co/models/jonatasgrosman/wav2vec2-xls-r-1b-dutch',//0
    // 'https://api-inference.huggingface.co/models/jonatasgrosman/wav2vec2-large-xlsr-53-dutch',//0
    // 'https://api-inference.huggingface.co/models/simonsr/wav2vec2-large-xlsr-dutch',//1
    // 'https://api-inference.huggingface.co/models/wietsedv/wav2vec2-large-xlsr-53-dutch',//2
    // 'https://api-inference.huggingface.co/models/bartelds/wav2vec2-dutch-large-ft-cgn-3hrs',//0
    // 'https://api-inference.huggingface.co/models/MehdiHosseiniMoghadam/wav2vec2-large-xlsr-53-Dutch',//2
    // "https://api-inference.huggingface.co/models/Clementapa/wav2vec2-base-960h-phoneme-reco-dutch",//0
    // 'https://api-inference.huggingface.co/models/hannatoenbreker/whisper-dutch-small-v2',//!!!русский 5!!!
    // 'https://api-inference.huggingface.co/models/renesteeman/whisper-tiny-dutch',//3
    // 'https://api-inference.huggingface.co/models/renesteeman/whisper-tiny-dutch-25',//3
    // 'https://api-inference.huggingface.co/models/golesheed/whisper-non-native-children-0-dutch',//0
    // 'https://api-inference.huggingface.co/models/golesheed/whisper-non-native-adult-6-dutch', //English 5!
    'https://api-inference.huggingface.co/models/golesheed/whisper-9-dutch', // 5!!

    {
      headers: {
        Authorization: 'Bearer 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',
        language: 'nl',
      },
      method: 'POST',
      body: data,
    }
  );
  const result = await response.json();
  return result;
}

async function queryFF(text) {
  const url = 'https://api.forefront.ai/v1/chat/completions';
  const api_key = process.env.FOREFRONT_API_KEY;

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer ${api_key}',
    },
    body: JSON.stringify({
      model: 'beowolx/CodeNinja-1.0-OpenChat-7B',
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 128,
      temperature: 0.5,
    }),
  };

  try {
    const response = fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
