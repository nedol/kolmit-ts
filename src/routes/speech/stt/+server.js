import path from 'path';
import { dirname, join } from 'path'; // Импортируем join вместе с dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import fs from 'fs';

import { exec } from "child_process";

import ISO6391 from 'iso-google-locales';

import { Transloc } from '../../translate/Transloc';

import { Client } from '@gradio/client';

import speech from '@google-cloud/speech';

import {SaveSTT} from '../../../lib/server/db';

import { config } from 'dotenv';
config();
const HF_TOKEN = process.env.HF_TOKEN_2;

// const response_0 = await fetch(
//   'https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav'
// );
// const exampleAudio = await response_0.blob();

let app;


import { HfInference } from '@huggingface/inference';
// const HF_TOKEN = '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';//'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';
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
  const operator = formData.get('operator');
  const original = formData.get('original');

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
        [to_lang]: await Transloc(resp.text, from_lang, to_lang),
      };
    }
  } else if (from_lang == 'nl') {

    // const result = await queryHF(buffer);?

    // const result = await stt_karim_space(blob, from_lang, to_lang);//!

    // const result = await stt_mms(blob, from_lang, to_lang);//!


    const result = await stt_google(nodeBuffer,from_lang);   

    if (result) {
      resp = {
        [from_lang]: result,
        // [to_lang]: await Transloc(result, from_lang, to_lang),
      };

      SaveSTT(operator,result,from_lang, original);
    }
  } else {
    const result = await stt_whisper(arrayBuffer, from_lang,from_lang );
    // resp = await stt_as(audioUrl);
    if (result) {
      resp = {
        [from_lang]: result,
        [to_lang]: await Transloc(result, from_lang, to_lang),
      };
    }
  }

  console.log(resp);

  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}


const transcribeAudio = async(arrayBuffer, language) => {

  const audioFilePath =// path.resolve(__dirname, 'audio.wav');
    '/opt/render/project/src/src/routes/speech/stt/audio.wav'
  const tempFilePath = path.resolve(__dirname, 'temp_output.mp3');

  // Удаляем временный файл, если он существует
  if (fs.existsSync(tempFilePath)) {
    await fs.promises.unlink(tempFilePath);  // Асинхронное удаление файла
  }

  try{

    const buffer = Buffer.from(arrayBuffer); // Преобразуем ArrayBuffer в Buffer
    await fs.promises.writeFile(audioFilePath, buffer);

  }catch(ex){
    console.log()
  }

  return new Promise((resolve, reject) => {
    // Полный путь к whisper_transcribe.py
    // const scriptPath = path.join(__dirname, '', 'whisper_transcribe.py');
    // Полный путь к whisper_transcribe.py
    const scriptPath = '/opt/render/project/src/src/routes/speech/stt/whisper_transcribe.py';  // Указываем правильный путь

    exec(`python "${scriptPath}" "${audioFilePath}" "${language}"`, (error, stdout, stderr) => {
      if (error) {
        return reject(error); 
      }

      // Парсим результат JSON
      const result = JSON.parse(stdout.trim());

      // Получаем текст
      const text = result.text;

      // Получаем временные метки
      // const segments = result.segments.map(segment => ({
      //   start: segment.start,  // Начало сегмента
      //   end: segment.end,      // Конец сегмента
      //   text: segment.text     // Текст сегмента
      // }));

      resolve(text);
    });
  });
};



// const client = await Client.connect("rafaaa2105/crisper-whisper");
const client = await Client.connect("karim23657/Persian_Automatic_Speech_Recognition-asr");

async function stt_karim_space(arrayBuffer,  from_lang, to_lang) {

  try{
    
    const result = await client.predict("/g_rec", { 
        audio_File: arrayBuffer, 		
        language: "nl-BE", 
    });

    // const result = await client.predict("/predict", { 
    //     inputs: arrayBuffer,
    //     yt_url:'', 		
    //     task: "transcribe", 
    // });
    
    if(!result.data[0].includes('Exception:'))
      return result.data[0].replace("Text:", '').trim();
  }catch(ex){
    console.log(ex)
  }
}

async function stt_google(arrayBuffer,  from_lang, to_lang) {

  try{
    
    const client = new speech.SpeechClient();
    // const audioBytes = fs.readFileSync(filePath).toString('base64');

    const audio = {
      content: arrayBuffer,
    };
    const config = {
      encoding: 'WEBM_OPUS', // Убедитесь, что это соответствует кодированию вашего аудио
      sampleRateHertz: 48000, // Убедитесь, что это соответствует частоте дискретизации вашего аудио
      languageCode: 'nl-BE', // Измените на желаемый язык (например, 'en-US' для английского)
    };

    const request = {
      audio: audio,
      config: config,
    };

    // Выполняем распознавание
    const [response] = await client.recognize(request);
    return response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
  
  }catch(ex){
    console.log(ex)
  }   
  return result;
} 
