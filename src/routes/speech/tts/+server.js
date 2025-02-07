import path from 'path';
import { dirname, join } from 'path'; // Импортируем join вместе с dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// import { fileURLToPath } from 'url';

import * as googleTTS from 'google-tts-api';
import { speak } from 'google-translate-api-x';
// import textToSpeech from '@google-cloud/text-to-speech';
import speech from "@google-cloud/speech";
const speechClient = new speech.SpeechClient();


import { WriteSpeech, ReadSpeech } from '$lib/server/db.js'; //src\lib\server\server.db.js


import { Buffer } from 'buffer';

import wav from 'wav';  // Модуль для работы с WAV файлами

import md5 from 'md5'; // Импортируем библиотеку для генерации md5
import fs from 'fs-extra'; // Импортируем fs-extra для работы с файловой системой

import { json } from '@sveltejs/kit';

import axios from 'axios';

import { config } from 'dotenv';
config();

const HF_TOKEN = process.env.HF_TOKEN_3;

import ISO6391 from 'iso-google-locales';

const audioDir = path.join(__dirname, 'audio'); // Директория для сохранения аудиофайлов

import { client } from '@gradio/client';

const projectId = 'firebase-infodesk';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request, response }) {
  let resp;
  let abonent = url.searchParams.get('abonent');
  const { par } = await request.json();
  const q = par;

  switch (q.func) {
    case 'tts':
      resp = await tts_google(q.text, q.lang, abonent, q.quiz)

      break;
  }

  response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}

//FAKE:
async function tts_huggin(text, from, to) {
  const ttsUrl = 'https://api.dialogflow.com/v1/tts';
  const ttsHeaders = {
    Authorization: 'Bearer ' + HF_TOKEN,
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


async function tts_google(text, lang, abonent, quiz) {
   
    // Генерируем md5-хеш для текста
    const fileName = md5(text) + '.mp3';
    const filePath = join(audioDir, fileName); // Полный путь к файлу

    try{
        let base64  = '';
        let url_b64 = await googleTTS.getAllAudioBase64(text, {
          //getAudioUrl(text, {
          lang: lang,
          slow: false,
          host: 'https://translate.google.com',
          timeout: 10000,
        });

       
        url_b64.map((e) => {
          base64 += e.base64;
        });

        // url_b64 = await speak(text, {to: lang}); 
        // let base64_2 = url_b64 

        let timestamps = []       
     
        return  {audio:'data:audio/mpeg;base64,' + base64 , ts:timestamps}

    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
}


import ffmpeg from 'fluent-ffmpeg';


// Функция для удаления временного файла, если он существует
function safeDelete(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log('Temporary file deleted:', filePath);
  } else {
    console.log('File not found, skipping deletion:', filePath);
  }
}

function base64ToWav(base64Str, filePath) {
  // Убираем префикс данных, если он есть (например, "data:audio/wav;base64,")
  const base64Data = base64Str.replace(/^data:audio\/wav;base64,/, '');
  
  // Декодируем строку Base64 в буфер
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Записываем буфер в файл
  fs.writeFile(filePath, buffer, (err) => {
      if (err) {
          console.error('Ошибка записи файла:', err);
      } else {
          console.log('Файл сохранён:', filePath);
      }
  });
}


// Основная серверная функция
async function processAudio(base64Str) {

  const audioFilePath = path.resolve(__dirname, "audio.wav");
  const tempFilePath = path.resolve(__dirname, 'temp_output.wav');

  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);  // Удаляет файл, если он существует
  }

  // Конвертируем Base64 в ArrayBuffer
  await base64ToWav(base64Str,audioFilePath);

  // const resultPath = await convertToAvi(audioFilePath, aviFilePath);

  // Извлекаем временные метки пауз
  try {
    const timestamps = await extractSilenceTimestamps(audioFilePath,tempFilePath);
    console.log('Timestamps of silence:', timestamps);
    return timestamps;
  } catch (err) {
    console.error('Error processing audio:', err);
    return [];
  } finally {
    // Безопасно удаляем временный файл
  }
}

// Функция для извлечения временных меток пауз (как раньше)
function extractSilenceTimestamps(filePath,audioFilePath) {
  return new Promise((resolve, reject) => {
    const timestamps = [];
    audioFilePath = 'D:\\VSCodeProjects\\git\\kolmit-ts\\src\\routes\\speech\\tts\\temp_output.wav';
    ;

    ffmpeg(filePath)
      .inputFormat('mp3') 
      .audioFilters(
        'rubberband=pitch=1.2', // Увеличиваем высоту тона в 1.2 раза
        'silencedetect=n=-12dB:d=0.08')
      .output(audioFilePath)
      // .output('/dev/null') // Отключаем вывод в файл
      .audioCodec("pcm_s16le")     // Кодек для аудио
      .on('stderr', (stderrLine) => {
        console.error('FFmpeg STDERR: ', stderrLine);
        const match = stderrLine.match(/silencedetect.*silence_start: (\d+\.\d+)/);
        if (match) {
          timestamps.push(parseFloat(match[1]));
        }
      })
      .on("start", (cmd) => console.log(`FFmpeg started: ${cmd}`)) 
      .on('end', () => {
        resolve(timestamps);
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
}



async function transcribeAudio(base64Audio, text) {
  // Расшифровка Base64 и сохранение файла
  const audioBuffer = Buffer.from(base64Audio, "base64");
  const audioPath = "audio.wav";
  fs.writeFileSync(audioPath, audioBuffer);

  // Настройка запроса
  const audio = {
    content: audioBuffer.toString("base64"),
  };
  const config = {
    encoding: "LINEAR16", // или другой формат
    sampleRateHertz: 16000, // Убедитесь, что совпадает с частотой аудио
    languageCode: "en-US", // Укажите нужный язык
    enableWordTimeOffsets: true,
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Отправка аудио на распознавание
  const [response] = await speechClient.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0])
    .map(alt => ({
      transcript: alt.transcript,
      words: alt.words.map(word => ({
        word: word.word,
        startTime: word.startTime.seconds + word.startTime.nanos * 1e-9,
        endTime: word.endTime.seconds + word.endTime.nanos * 1e-9,
      })),
    }));

  // Сопоставление слов с текстом
  console.log(JSON.stringify(transcription, null, 2));
}

function Vosk(base64Audio){
  const WebSocket = require('ws');
  // const fs = require('fs');  
  // Подключение к серверу Vosk через WebSocket
  const ws = new WebSocket('ws://localhost:2700');

  // Слушаем события для получения результатов
  ws.on('open', function open() {
    console.log('Connected to Vosk server');


      // Декодирование Base64 в бинарный буфер
    const audioBuffer = Buffer.from(base64Audio, 'base64');

    const reader = new wav.Reader();

    reader.on('format', function (format) {
      if (format.sampleRate !== 16000) {
        console.log('Vosk требует 16kHz WAV аудио!');
        return;
      }
  
      // Отправляем данные на сервер
      reader.on('data', function (chunk) {
        ws.send(chunk);
      });
  
      // Сообщаем серверу о завершении
      reader.on('end', function () {
        console.log('Audio processing finished.');
        ws.send(JSON.stringify({ eof: true }));
      });
    });
  
    // Передаём аудио-данные в reader
    reader.end(audioBuffer);
  });

  ws.on('message', function incoming(data) {
    console.log('Received data: ', data);
  });

  ws.on('close', function close() {
    console.log('Connection closed');
  });
  // Обрабатываем ошибки WebSocket
  ws.on('error', function error(err) {
    console.error('WebSocket error: ', err.message);
  });

}



