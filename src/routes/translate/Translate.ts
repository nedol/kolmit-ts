import { WriteSpeech, ReadSpeech } from '$lib/server/db.ts'; //src\lib\server\server.db.ts
import md5 from 'md5'; // Импортируем библиотеку для генерации md5
import { HttpsProxyAgent } from 'https-proxy-agent';
import translatex from 'google-translate-api-x';
import { translate } from 'deeplx';
import { query } from '@ifyour/deeplx';

// Define supported languages
const langs = [
  "bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "hu", "id", "it", "ja", "ko", "lt", "lv", "nb", "nl", "pl", "pt", "ro", "ru", "sk", "sl", "sv", "zh"
];

// Map to track pending translations (caching)
const pendingTranslations = new Map<string, Promise<string>>(); 

async function deeplx_query(text, to, from) { 
  
  // 🔹 Отладка: что было ДО и ПОСЛЕ замены
  // console.log("Before protection:", text);
  text = protectQuotedText(text);
  // console.log("After protection:", text);

  const params = {
    "text": text,
    "source_lang": from,
    "target_lang": to,
    "preserve_formatting": 1
  };

  // 🔹 Проверяем, что отправляется в API
  console.log("Query params:", params);

  const res = await query(params);
  res.data = revertProtectedText(res.data);
  return res.data;
}

function preserveQuotedText(str) {
  // Регулярное выражение для поиска текста в кавычках
  const regex = /(['"])(.*?)\1/g;
  
  // Массив для хранения текста в кавычках
  let quotedTexts = [];
  
  // Ищем все фрагменты в кавычках и сохраняем их
  str = str.replace(regex, (match, quote, text) => {
      quotedTexts.push(text);
      return `${quote}__@__${quote}`; // Заменяем фрагмент на плейсхолдер
  });

  // Возвращаем объект с исходной строкой и массивом найденных фрагментов
  return {
      modifiedString: str,
      quotedTexts: quotedTexts
  };
}

function restoreQuotedText(modifiedString, quotedTexts) {
  return modifiedString.replace(/__@__/g, () => {
      return quotedTexts.shift(); // Вставляем фрагмент обратно
  });
}


// Translation function
export async function Translate(text: string, from: string, to: string, quiz: string): Promise<string> {
  if (!text) return '';

  // Clean the input text
  text = text.replace(/\r\n/g, ' ');

  // Split the text into sentences
  const sentences = text.split(/(?<=[.!?])\s+/);
  let translatedText = '';

  // Process sentences in chunks of 5
  for (let i = 0; i < sentences.length; i += 5) {
    let chunk = sentences.slice(i, i + 5).join(' ').trim();
    if (!chunk || chunk === '"') continue;

   
    // Handle special characters like <<
    const hasQuotes = chunk.includes('<<');
    if (hasQuotes) {
      chunk = chunk.replace(/<</g, ' ').replace(/>>/g, ' ');
    }

    const cacheKey = md5(chunk);

    // Wait for existing translation if one is in progress
    if (pendingTranslations.has(cacheKey)) {
      console.log(`Ожидание перевода: ${chunk}`);
      translatedText += await pendingTranslations.get(cacheKey);
      continue;
    }

    // Check if the translation is already cached in the database
    const resp = await ReadSpeech({ lang: to, key: cacheKey });
    if (resp?.translate) {
      // console.log(`Файл уже существует`);
      translatedText += `${resp.translate} `;
      continue;
    }

    console.log(`Файл НЕ существует`);
    let pqt;
    let provider=''
    
    let translationPromise = (async () => {
      let res = '';
      
      try {
        pqt = preserveQuotedText(chunk);

        if (langs.includes(to)) {
          // Use DeepL for supported languages
          res = await translate(pqt.modifiedString, to.toUpperCase(), from.toUpperCase(),undefined, undefined, false);
          provider = 'deepl'
          res = restoreQuotedText(res,pqt.quotedTexts);
          // res = deeplx_query(chunk, to, from)
        } else {
          // Use Google Translate API for unsupported languages
          const en = await translate(chunk, "EN");
          res = await translatex(en, {
            from: "en",
            to: to,
            forceBatch: true,
            requestOptions: {
              agent: new HttpsProxyAgent('https://164.132.175.159:3128'),
            },
          });
          provider = 'deepl'
          res = res.text;
        }
      } catch (error) {
        console.error('Ошибка перевода с DeepL, используем fallback на translatex:', error);
        
        // If an exception occurs with translate(), fall back to translatex()
        try {          

          res = await translatex(chunk, {
            from: from,
            to: to,
            forceBatch: true,
            requestOptions: {
              agent: new HttpsProxyAgent('https://164.132.175.159:3128'),
            },
          });
          provider = 'google'
          res = res.text;
        } catch (fallbackError) {
          console.error('Ошибка перевода с fallback (translatex):', fallbackError);
          res = chunk; // Return the original text if both translation services fail
        }

        res = restoreQuotedText(res,pqt.quotedTexts);
      }

      // Cache the translation in the database
      await WriteSpeech({ 
        lang: to, 
        key: cacheKey, 
        text: chunk, 
        translate: res,
        provider: provider,
        quiz: quiz || resp?.quiz || '' // Берём новый quiz или оставляем старый 
      });

      // Remove the item from the queue after translation
      pendingTranslations.delete(cacheKey);

      return res;
    })();

    // Add the translation task to the queue
    pendingTranslations.set(cacheKey, translationPromise);
    translatedText += await translationPromise;
  }

  return translatedText.trim();
}
