import path from 'path';
import { fileURLToPath } from 'url';

import ISO6391 from 'iso-google-locales';

import { Translate } from '../../translate/Translate';

import { client } from '@gradio/client';

// const response_0 = await fetch(
//   'https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav'
// );
// const exampleAudio = await response_0.blob();

let app;


import { HfInference } from '@huggingface/inference';
const HF_TOKEN = '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';//'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';
const inference = new HfInference(HF_TOKEN);
// import { HfAgent, LLMFromHub, defaultTools } from '@huggingface/agents';
// const agent = new HfAgent(HF_TOKEN, LLMFromHub(HF_TOKEN), [...defaultTools]);

    async function convertBlobToBase64(arrayBuffer) {
      const uint8Array = new Uint8Array(arrayBuffer);
      let binaryString = '';

      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }

      return btoa(binaryString);
    }


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
  const audioUrl = await URL.createObjectURL(blob);
  // let wav = new wavefile.WaveFile(nodeBuffer);
  // wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
  // wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
  // let audioData = nodeBuffer; // wav.getSamples(); //

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

    const result = await stt_sm4(blob, from_lang, to_lang);
    // const result = await stt_mms(arrayBuffer, from_lang, to_lang);

    if (result) {
      resp = {
        [from_lang]: result,
        [to_lang]: await Translate(result, from_lang, to_lang),
      };
    }
  } else {
    const result = await stt_sm4(blob, from_lang);
    // resp = await stt_as(audioUrl);
    if (result) {
      resp = {
        [from_lang]: result.text,
        [to_lang]: await Translate(result.text, from_lang, to_lang),
      };
    }
  }

  console.log(resp);
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}


async function stt_sm4(blob, from_lang, to_lang) {
   const app = await client(
      'https://facebook-seamless-m4t-v2-large.hf.space/--replicas/fxh8b/'
  );
  const app_info = await app.view_api();
  const from = ISO6391.getName(from_lang);
   const to = ISO6391.getName(to_lang);
  const result = await app.predict('/s2tt', [
    blob, // blob in 'Input speech' Audio component
    from, // string  in 'Source language' Dropdown component
    from, // string  in 'Target language' Dropdown component
  ]);
  return result.data[0];
}


async function stt_mms(arrayBuffer,  from_lang, to_lang) {
  const app = await client('https://mms-meta-mms.hf.space/');
    const from = ISO6391.getName(from_lang);
    const to = ISO6391.getName(to_lang);
  const result = await app.predict('/predict', [
    'Record from Mic',
    {
      data: await convertBlobToBase64(arrayBuffer),
      name: 'audio.wav',
    },
    null, // string  in 'Task' Radio component
    'nld (Dutch)',
    null,
  ]);
  return result.data[0];
}



async function stt_as(audioUrl) {
  const params = {
    audio: audioUrl,
  };
  const transcript = await client.transcripts.transcribe(params);
  return transcript;
}

async function stt(arrayBuffer, from_lang) {
  try {
    return await inference.automaticSpeechRecognition({
      data: arrayBuffer,
      model: 'openai/whisper-large-v3',
    });
  } catch (ex) {
    console.log(ex);
  }
}

async function stt_nl(arrayBuffer, from_lang) {
  try {
    const result =  await inference.automaticSpeechRecognition({
      data: arrayBuffer,
      model: 'golesheed/whisper-9-dutch',
    });
    return result.text;
  } catch (ex) {
    console.log(ex);
  }
}

async function stt_en(arrayBuffer, from_lang) {
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

async function queryHF(data) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/openai/whisper-large-v3', //English 5!
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
    // 'https://api-inference.huggingface.co/models/golesheed/whisper-9-dutch', // 5!!

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

async function queryT(arrayBuffer) {
  const float32Array = new Float32Array(arrayBuffer);
  let transcriber = await pipeline(
    'automatic-speech-recognition',
    'Xenova/whisper-tiny.en'
  );
  let out = await transcriber(float32Array);
  console.log(out);
  return out;
}
