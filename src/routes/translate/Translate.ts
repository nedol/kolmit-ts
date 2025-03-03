import { WriteSpeech, ReadSpeech } from '$lib/server/db.ts'; //src\lib\server\server.db.ts
import md5 from 'md5'; // Импортируем библиотеку для генерации md5
import { HttpsProxyAgent } from 'https-proxy-agent';
import translatex from 'google-translate-api-x';
import { translate } from 'deeplx';

// Define supported languages
const langs = [
  "bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "hu", "id", "it", "ja", "ko", "lt", "lv", "nb", "nl", "pl", "pt", "ro", "ru", "sk", "sl", "sv", "zh"
];

// Map to track pending translations (caching)
const pendingTranslations = new Map<string, Promise<string>>(); 

// Translation function
export async function Translate(text: string, from: string, to: string): Promise<string> {
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
    let translationPromise = (async () => {
      let res = '';

      try {
        if (langs.includes(to)) {
          // Use DeepL for supported languages
          res = await translate(chunk, to.toUpperCase());
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
          res = res.text;
        }

        // Restore special characters (<< >>)
        if (hasQuotes) {
          // res = res.text.replace(/\<(.*?)\>/g, '<<$1>>');                                                       
        }

        // Cache the translation in the database
        await WriteSpeech({ lang: to, key: cacheKey, text: chunk, translate: res });

      } catch (error) {
        console.error('Ошибка перевода:', error);
        res = chunk; // Return original text if translation fails
      }

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
