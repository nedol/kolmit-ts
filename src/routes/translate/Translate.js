

import translate from 'translate';
translate.engine = 'deepl'; // 'libre';// 'google'//
translate.key = '0834516e-29b0-45d1-812e-b903d5962e12:fx'; //'203cca0d-8540-4d75-8c88-d69ac40b6d57:fx';//process.env.DEEPL_API_KEY;
export async function Translate(text, from, to) {
  try {
    if (!text)
      return;
    translate.from = from;
    text = text.replace(/\r\n/g, '');

    // Разделение текста на предложения
    const sentences = text.split(/[.!?]/);
    let translatedText = '';

    // Перевод каждой части текста (по 2 предложения)
    for (let i = 0; i < sentences.length; i += 2) {
      const chunk = sentences.slice(i, i + 2).join('. '); // Объединение 10 предложений в одну часть
      const res = await translate(chunk, to);
      translatedText += res + ' '; // Добавление переведенной части к полному тексту
    }

    return translatedText.trim(); // Удаление лишних пробелов в конце текста
  } catch (error) {
    console.error('Translation error:', error);
    return text; // или другое подходящее значение по умолчанию
  }
}
