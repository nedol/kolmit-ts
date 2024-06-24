import path from 'path';
import { fileURLToPath } from 'url';

 import axios from 'axios';

import { config } from 'dotenv';
config();

const HF_TOKEN = process.env.HF_TOKEN;

import ISO6391 from 'iso-google-locales';

const https = require('https');
const fs = require('fs');

import { client } from '@gradio/client';

const projectId = 'firebase-infodesk'


/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request, response }) {
  let resp;
  let abonent = url.searchParams.get('abonent');
  const { par } = await request.json();
  const q = par;

  switch (q.func) {
    case 'tts':
      resp = { audio: await tts_sm4(q.text, 'nl', 'nl') };
      break;
  }

  response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}


async function tts_huggin(text, from, to) {
  const ttsUrl = 'https://api.dialogflow.com/v1/tts';
  const ttsHeaders = {
    'Authorization': 'Bearer ' + HF_TOKEN,
    'Content-Type': 'application/json',
  };
  const ttsData = {
    text: text,
    languageCode: 'nl-BE',
    voice: 'female',
  };

  try {
    const ttsRes = await axios.post(ttsUrl, ttsData, { headers: ttsHeaders });
    ttsResponse = ttsRes.data.audioContent;
  } catch (error) {
    console.error(error);
  }
  let result;
}

async function tts_sm4(text, from_lang, to_lang) {
  const app = await client(
    'https://facebook-seamless-m4t-v2-large.hf.space/--replicas/fxh8b/'
  );
  const app_info = await app.view_api();
  const from = ISO6391.getName(from_lang);
  const to = ISO6391.getName(to_lang);
  const result = await app.predict('/t2st', [
    text, // 'Input speech' Audio component
    from, // string  in 'Source language' Dropdown component
    to, // string  in 'Target language' Dropdown component
  ]);

  return (
    'https://facebook-seamless-m4t-v2-large.hf.space/file=' +
    result.data[0].path
  );
}


  async function tts_google(text, language) {
    try {
      const client = new textToSpeech.TextToSpeechClient();

        // Construct the request
      const request = {
        input: {text: text},
        // Select the language and SSML voice gender (optional)
        voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
        // select the type of audio encoding
        audioConfig: {audioEncoding: 'MP3'},
      };
      const [response] = await client.synthesizeSpeech(request);

      return response;
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  }

async function tts_mms(text) {    
	const app = await client('https://nedol-mms.hf.space/', { hf_token: HF_TOKEN });  
	const result = await app.predict('/predict_1', [
	    text, // string  in 'Input text' Textbox component
	    'nld (Nederlands)', //
	    1, // number (numeric value between 0.1 and 4.0) in 'Speed' Slider component
	  ]);
	  return 'https://nedol-mms.hf.space/file=' + result.data[0].value.name; // await textToSpeechDeepgram(q.text);
}

async function tts_xVASynth(text) {
  const app = await client('Pendrokar/xVASynth');
  const result = await app.predict('/predict', [
    text, // string  in 'Input Text' Textbox component
    'ccby_nvidia_hifi_92_F', // string  in 'Voice' Radio component //ccby_nvidia_hifi_6671_M//ccby_nvidia_hifi_92_F
    'nl', // string  in 'Language' Radio component
    0.9, // number (numeric value between 0.5 and 2.0) in 'Duration' Slider component
    0, // number (numeric value between 0 and 1.0) in 'Pitch' Slider component
    0.1, // number (numeric value between 0.1 and 1.0) in 'Energy' Slider component
    0, // number (numeric value between 0 and 1.0) in '😠 Anger' Slider component
    0.2, // number (numeric value between 0 and 1.0) in '😃 Happiness' Slider component
    0, // number (numeric value between 0 and 1.0) in '😭 Sadness' Slider component
    0, // number (numeric value between 0 and 1.0) in '😮 Surprise' Slider component
    true, // boolean  in 'Use DeepMoji' Checkbox component
  ]);

  return result.data[0].url;
}

async function tts_Deepgram(text) {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey_deepgram}`,
      'Content-Type': 'application/json',
    },
  };

  // Define the payload
  const data = JSON.stringify({
    text: text,
  });

  // Make the POST request
  const req = https.request(url_deepgram, options, (res) => {
    // Check if the response is successful
    if (res.statusCode !== 200) {
      console.error(`HTTP error! Status: ${res.statusCode}`);
      return;
    }
    // Save the response content to a file
    const dest = fs.createWriteStream('./routes/src/speech/tts/output.mp3');
    res.pipe(dest);
    dest.on('finish', () => {
      console.log('File saved successfully.');
    });
  });

  // Handle potential errors
  req.on('error', (error) => {
    console.error('Error:', error);
  });

  // Send the request with the payload
  req.write(data);
  req.end();
}
