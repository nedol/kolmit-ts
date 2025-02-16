
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


const pendingTranslations = new Map(); // Очередь выполняемых переводов

export async function Translate(text, from, to) {
  if (!text) return '';

  // Удаляем лишние символы новой строки
  text = text.replace(/\r\n/g, ' ');

  // Разбиваем текст на предложения
  const sentences = text.split(/(?<=[.!?])\s+/);
  let translatedText = '';

  // Формируем группы из 5 предложений
  for (let i = 0; i < sentences.length; i += 5) {
    let chunk = sentences.slice(i, i + 5).join(' ').trim();
    if (!chunk || chunk === '"') continue;

    // Проверяем наличие << >> и заменяем на безопасные символы
    const hasQuotes = chunk.includes('<<');
    if (hasQuotes) {
      chunk = chunk.replace(/<</g, ' ').replace(/>>/g, ' ');
    }

    const cacheKey = md5(chunk);

    // Если перевод уже выполняется — ждем его завершения
    if (pendingTranslations.has(cacheKey)) {
      console.log(`Ожидание перевода: ${chunk}`);
      translatedText += await pendingTranslations.get(cacheKey);
      continue;
    }

    // Проверяем, есть ли перевод в базе
    const resp = await ReadSpeech({ lang: to, key: cacheKey });
    if (resp?.translate) {
      console.log(`Файл уже существует`);
      translatedText += `${resp.translate} `;
      continue;
    }

    console.log(`Файл НЕ существует`);
    let translationPromise = (async () => {
      let res = '';

      try {
        if (langs.includes(to)) {
          res = await translate(chunk, to.toUpperCase());
        } else {
          const en = await translate(chunk, "EN");
          res = await translatex(en, {
            from: "en",
            to: to,
            forceBatch: true,
            requestOptions: {
              agent: new HttpsProxyAgent('https://164.132.175.159:3128'),
            },
          });
          res = res.text;
        }

        // Восстанавливаем << >> после перевода
        if (hasQuotes) {
          // res = res.text.replace(/\<(.*?)\>/g, '<<$1>>');                                                       
        }

        // Записываем в базу только если перевода не было
        await WriteSpeech({ lang: to, key: cacheKey, text: chunk, translate: res });

      } catch (error) {
        console.error('Ошибка перевода:', error);
        res = chunk; // Если перевод не удался, возвращаем оригинальный текст
      }

      // Убираем `chunk` из очереди
      pendingTranslations.delete(cacheKey);

      return res;
    })();

    // Добавляем в очередь
    pendingTranslations.set(cacheKey, translationPromise);
    translatedText += await translationPromise;
  }

  return translatedText.trim();
}




