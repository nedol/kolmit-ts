
import { WriteSpeech, ReadSpeech } from '$lib/server/db.js'; //src\lib\server\server.db.js
import md5 from 'md5'; // Импортируем библиотеку для генерации md5

import {HttpsProxyAgent} from 'https-proxy-agent';

import translatex from 'google-translate-api-x';

// import translate from '@mgcodeur/super-translator';

// import translate from 'translate';
// translate.engine = 'deepl';//'yandex';//'deepl'; //'google'//  
// translate.key = '203cca0d-8540-4d75-8c88-d69ac40b6d57:fx';//'0834516e-29b0-45d1-812e-b903d5962e12:fx'; //process.env.DEEPL_API_KEY;

import { translate } from 'deeplx'

const langs = [
  "bg",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "es",
  "et",
  "fi",
  "fr",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "lv",
  "nb",
  "nl",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sv",
  "zh"
]


export async function Translate(text, from, to) {
  if (!text) return '';

  // Удаляем лишние символы новой строки
  text = text.replace(/\r\n/g, ' ');

  // Разбиваем текст на предложения
  const sentences = text.split(/(?<=[.!?])\s+/);
  let translatedText = '';

  // Формируем группы из трёх предложений
  for (let i = 0; i < sentences.length; i += 5) {
    const chunkGroup = sentences.slice(i, i + 5).join(' ').trim();
    if (!chunkGroup || chunkGroup=='"') continue;

    let chunk = chunkGroup.replaceAll('"','');
    let res = '';

    // Проверяем наличие << >> и заменяем на безопасные символы
    const hasQuotes = chunk.includes('<<');
    if (hasQuotes) {
      chunk = chunk.replace(/<</g, ' ').replace(/>>/g, ' ');
    }


    // Проверяем наличие файла
    const resp =  await ReadSpeech({ lang: to, key: md5(chunk) });
    if (resp?.translate) {
        try {
          console.log(`Файл уже существует`);
          
          return resp.translate;
        } catch (error) {
          console.error('Error converting text to speech:', error);
        }
    }else{
      console.log(`Файл  НЕ существует`);
      // Попытка перевода через Google Translate API
      try {
     
          if(langs.includes(to)){
            res = await translate(chunk,  to.toUpperCase()) 
          }else{
            const en = await translate(chunk,  "EN") 
            res = await translatex(en, { from: "en" , to: to, forceBatch: true ,
              requestOptions: {
                agent: new HttpsProxyAgent('https://164.132.175.159:3128')
              }
            });  
            res = res.text;
          }
    

          WriteSpeech({ lang: to, key: md5(text), text: text, translate: res});  

      } catch (error) {
        res = chunk; // Если перевод не удался, возвращаем оригинальный текст
      }

      // Восстанавливаем << >> после перевода
      if (hasQuotes) {
        // res = res.text.replace(/\<(.*?)\>/g, '<<$1>>')                                                       
      }
    }

    translatedText += `${res} `;
  }

  // Убираем лишние пробелы
  return translatedText.trim();
}




