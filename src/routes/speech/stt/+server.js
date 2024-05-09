import path from 'path';
import { fileURLToPath } from 'url';

import { pipeline } from '@xenova/transformers';

// Allocate a pipeline for sentiment-analysis

// [{'label': 'POSITIVE', 'score': 0.999817686}]

import { HfInference } from '@huggingface/inference';
const HF_TOKEN = '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';

const inference = new HfInference(HF_TOKEN);

const { RealtimeSession } = require('speechmatics');

const token = 'WWJSDBA5JAVB4WP4JNKULL2CAZ7JCPL7';


// import audioEncoder from 'audio-encoder';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request }) {
  // const audioBlob = await request.blob(); // Получаем Blob объект
  const formData = await request.formData();
  const fileContent = formData.get('file');

  // Преобразование Blob в Buffer
  const buffer = await fileContent.arrayBuffer();
  const nodeBuffer = Buffer.from(buffer);
  const blob = new Blob([nodeBuffer]);
  const arrayBuffer = await blob.arrayBuffer();
  let resp;

  try {
    resp = await inference.automaticSpeechRecognition({
      data: arrayBuffer,
      model: 'jonatasgrosman/wav2vec2-large-xlsr-53-dutch',
      language: 'nl',
    });
  } catch (ex) {
    console.log(ex);
  }

  // resp = await queryHF(buffer);

  resp = resp.text;
  console.log(resp);
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;

  // let resp = await sendAudioToSpeechmaticks(buffer);
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
    'https://api-inference.huggingface.co/models/golesheed/whisper-9-dutch',// 5!!

    {
      headers: {
        Authorization: 'Bearer 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',
        language:'nl'
      },
      method: 'POST',
      body: data,
    }
  );
  const result = await response.json();
  return result;
}

