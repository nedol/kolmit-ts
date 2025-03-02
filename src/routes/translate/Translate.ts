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
export async function Translate(text: string, from: string, to: string, quiz: string): Promise<string> {
  if (!text) return '';

  // Очистка текста от переносов строк
  text = text.replace(/\r\n/g, ' ').trim();
  const cacheKey = md5(text);

  // Проверяем наличие перевода в базе
  let resp = await ReadSpeech({ lang: to, key: cacheKey });

  if (!resp?.translate) {
    console.log(`Текст отсутствует в базе, выполняем перевод: ${text}`);

    try {
      let translated = '';

      if (langs.includes(to)) {
        translated = await translate(text, to.toUpperCase());
      } else {
        const en = await translate(text, "EN");
        translated = await translatex(en, {
          from: "en",
          to: to,
          forceBatch: true,
          requestOptions: {
            agent: new HttpsProxyAgent('https://164.132.175.159:3128'),
          },
        });
        translated = translated.text;
      }

      // Сохраняем в базу, если перевели
      await WriteSpeech({
        lang: to,
        key: cacheKey,
        text: text,
        translate: translated,
        quiz: quiz || resp?.quiz || '', // Берём новый quiz или оставляем старый
      });

      resp = { translate: translated, quiz: quiz }; // Обновляем resp для возврата

    } catch (error) {
      console.error('Ошибка перевода:', error);
      return text; // Если произошла ошибка, возвращаем исходный текст
    }
  } else {
    console.log(`Текст уже есть в базе`);
  }

  return resp.translate;
}

