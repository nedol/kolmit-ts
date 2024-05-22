import translate from 'translate';
export async function Translate(text, from, to) {
  try {
    
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

  export async function Transloc(text: string, from_lang: string, to_lang: string) {
    try {
      if (from_lang === to_lang) return text;

      let question = { text: text, from_lang: from_lang, to_lang: to_lang };

      let data = await fetch(`/translate`, {
        method: 'POST',
        body: JSON.stringify({ question }),
        headers: { 'Content-Type': 'application/json' },
      });

      data = await data.json();
      return data.resp;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // или другое подходящее значение по умолчанию
    }
  }


