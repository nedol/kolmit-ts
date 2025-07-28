import { WriteTranslate, ReadSpeech } from '$lib/server/db.ts';
import md5 from 'md5';
import { HttpsProxyAgent } from 'https-proxy-agent';
import translatex from 'google-translate-api-x';
import { translate as deeplTranslate } from 'deeplx';
import { query as deeplxQuery } from '@ifyour/deeplx';
import { config } from 'dotenv';
import { TranslationServiceClient } from '@google-cloud/translate';
import fs from 'fs';

// Load environment variables
config();

// Google Cloud Project ID
const GOOGLE_PROJECT_ID: string | undefined = process.env.GOOGLE_PROJECT_ID;

// Prepare Google credentials for Translation API
if (process.env.GOOGLE_CREDENTIALS_BASE64) {
  const decoded = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
  fs.writeFileSync('/tmp/service-account.json', decoded);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = '/tmp/service-account.json';
}

// Supported languages for DeepL
const langs: string[] = [
  'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'zh'
];

// Google Translation API client
const googleClient = new TranslationServiceClient();

/**
 * Preserve quoted text from translation by replacing with placeholders.
 */
function preserveQuotedText(str: string): { modifiedString: string; quotedTexts: string[] } {
  const regex = /(['"])(.*?)\1/g;
  const quotedTexts: string[] = [];

  const modifiedString = str.replace(regex, (match, quote, text) => {
    quotedTexts.push(text);
    return `${quote}__@__${quote}`;
  });

  return { modifiedString, quotedTexts };
}

/**
 * Restore previously preserved quoted text back to translated string.
 */
function restoreQuotedText(modifiedString: string, quotedTexts: string[]): string {
  return modifiedString.replace(/__@__/g, () => quotedTexts.shift() || '');
}

/**
 * Call DeepLx API for translation.
 */
async function deeplx_query(text: string, to: string, from: string): Promise<string> {
  const preserved = preserveQuotedText(text);
  const params = {
    text: preserved.modifiedString,
    source_lang: from,
    target_lang: to,
    preserve_formatting: 1
  };

  try {
    const res = await deeplxQuery(params);
    return restoreQuotedText(res.data, preserved.quotedTexts);
  } catch (err) {
    console.error('DeepLx query failed:', err);
    throw new Error('DeepLx API error');
  }
}

/**
 * Call Google Cloud Translation API.
 */
async function translate_(text: string, from = 'nl', to = 'ru'): Promise<string> {
  if (!GOOGLE_PROJECT_ID) throw new Error('Missing GOOGLE_PROJECT_ID');

  const request = {
    parent: `projects/${GOOGLE_PROJECT_ID}/locations/global`,
    contents: [text],
    mimeType: 'text/plain',
    sourceLanguageCode: from,
    targetLanguageCode: to
  };

  const [response] = await googleClient.translateText(request);
  return response.translations?.[0]?.translatedText || '';
}

/**
 * Translate single chunk using multiple providers (DeepLx → Google fallback)
 */
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
      // Short sentences → use google-translate-api-x, otherwise DeepLx
      if (modifiedString.split(' ').length < 4) {
        const googleX = await translatex(modifiedString, {
          from,
          to,
          forceBatch: true,
          requestOptions: {
            agent: new HttpsProxyAgent('https://164.132.175.159:3128')
          }
        });
        result = googleX.text;
        provider = 'google-x';
      } else {
        result = await deeplx_query(modifiedString, to.toUpperCase(), from.toUpperCase());
        provider = 'deepl';
      }
    } else {
      // Use Google API for unsupported languages
      result = await translate_(modifiedString, from.toUpperCase(), to.toUpperCase());
      provider = 'google';
    }
  } catch (err) {
    console.error('Primary translation failed, fallback to Google:', err);
    try {
      result = await translate_(modifiedString, from.toUpperCase(), to.toUpperCase());
      provider = 'google';
    } catch (fallbackError) {
      console.error('Fallback Google translation failed:', fallbackError);
    }
  }

  result = restoreQuotedText(result, quotedTexts);

  if (quiz) {
    await WriteTranslate({ lang: to, key: cacheKey, text: chunk, translate: result, provider, quiz });
  }

  return result;
}

/**
 * Main translation function used in SvelteKit.
 */
export async function Translate(text: string, from: string, to: string, quiz: string): Promise<string> {
  if (!text?.trim()) return '';

  const processedText = text.replace(/\r\n/g, ' ');
  const sentences = processedText.split(/(?<=[.!?])\s+/).filter(s => s.trim() && s !== '"');
  const translatedChunks: string[] = [];

  const batchSize = 5;
  for (let i = 0; i < sentences.length; i += batchSize) {
    const chunk = sentences.slice(i, i + batchSize).join(' ').trim();
    if (!chunk) continue;

    const normalizedChunk = chunk.replace(/<</g, ' ').replace(/>>/g, ' ');
    const cacheKey = md5(normalizedChunk);

    // Try cache first
    const cached = await ReadSpeech({ lang: to, key: cacheKey });
    if (cached?.translate) {
      translatedChunks.push(cached.translate);
      continue;
    }

    // Translate and store
    const translated = await translateChunk(normalizedChunk, from, to, cacheKey, quiz || cached?.quiz);
    translatedChunks.push(translated);
  }

  return translatedChunks.join(' ').trim();
}
