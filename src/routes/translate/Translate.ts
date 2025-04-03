import { WriteTranslate, ReadSpeech } from '$lib/server/db.ts'; //src\lib\server\server.db.ts
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
// Translation function with optimizations
export async function Translate(
  text: string,
  from: string,
  to: string,
  quiz: string
): Promise<string> {
  if (!text?.trim()) return '';

  // Pre-process text once
  const processedText = text.replace(/\r\n/g, ' ');
  const sentences = processedText.split(/(?<=[.!?])\s+/).filter(s => s.trim() && s !== '"');
  const translatedChunks: string[] = [];

  // Process sentences in parallel batches
  const batchSize = 5;
  const batchCount = Math.ceil(sentences.length / batchSize);

  for (let batchIndex = 0; batchIndex < batchCount; batchIndex++) {
    const start = batchIndex * batchSize;
    const end = start + batchSize;
    const chunk = sentences.slice(start, end).join(' ').trim();

    if (!chunk) continue;

    // Handle special quotes more efficiently
    const normalizedChunk = chunk.replace(/<</g, ' ').replace(/>>/g, ' ');
    const cacheKey = md5(normalizedChunk);

    // Check for pending translations first
    if (pendingTranslations.has(cacheKey)) {
      console.log(`Waiting for existing translation: ${chunk.substring(0, 30)}...`);
      translatedChunks.push(await pendingTranslations.get(cacheKey));
      continue;
    }

    // Check cache
    const cached = await ReadSpeech({ lang: to, key: cacheKey });
    if (cached?.translate) {
      translatedChunks.push(cached.translate);
      continue;
    }

    // Create and store translation promise
    const translationPromise = translateChunk(normalizedChunk, from, to, cacheKey, quiz || cached?.quiz);
    pendingTranslations.set(cacheKey, translationPromise);
    translatedChunks.push(await translationPromise);
  }

  return translatedChunks.join(' ').trim();
}

// Extracted chunk translation logic
async function translateChunk(
  chunk: string,
  from: string,
  to: string,
  cacheKey: string,
  quiz: string
): Promise<string> {
  let provider = '';
  let result = chunk;
  const { modifiedString, quotedTexts } = preserveQuotedText(chunk);

  try {
    if (langs.includes(to)) {
      // Try DeepL first for supported languages
      result = await translate(modifiedString, to.toUpperCase(), from.toUpperCase());
      provider = 'deepl';
    } else {
      // Fallback to Google Translate via English pivot
      const enText = await translate(modifiedString, "EN");
      const translated = await translatex(enText, {
        from: "en",
        to,
        forceBatch: true,
        requestOptions: { agent: new HttpsProxyAgent('https://164.132.175.159:3128') },
      });
      result = translated.text;
      provider = 'google';
    }
  } catch (primaryError) {
    console.error('Primary translation failed, using fallback:', primaryError);
    try {
      const fallbackResult = await translatex(modifiedString, {
        from,
        to,
        forceBatch: true,
        requestOptions: { agent: new HttpsProxyAgent('https://164.132.175.159:3128') },
      });
      result = fallbackResult.text;
      provider = 'google-fallback';
    } catch (fallbackError) {
      console.error('Fallback translation failed:', fallbackError);
    }
  }

  // Restore quoted text if we modified it
  result = restoreQuotedText(result, quotedTexts);

  // Cache the result if needed
  if (quiz) {
    await WriteTranslate({
      lang: to,
      key: cacheKey,
      text: chunk,
      translate: result,
      provider,
      quiz
    });
  }

  // Clean up
  pendingTranslations.delete(cacheKey);
  return result;
}