
import translate from 'translate'
 export async function Translate(text, lang) {
   try {
     if (lang === 'ru') return text;
     translate.from = 'ru';
     text = text.replace(/\r\n/g, '');

     // Разделение текста на предложения
     const sentences = text.split(/[.!?]/);
     let translatedText = '';

     // Перевод каждой части текста (по 10 предложений)
     for (let i = 0; i < sentences.length; i += 10) {
       const chunk = sentences.slice(i, i + 10).join('. '); // Объединение 10 предложений в одну часть
       const res = await translate(chunk, lang);
       translatedText += res + ' '; // Добавление переведенной части к полному тексту
     }

     return translatedText.trim(); // Удаление лишних пробелов в конце текста
   } catch (error) {
     console.error('Translation error:', error);
     return text; // или другое подходящее значение по умолчанию
   }
 }