


  export async function Translate(text: string, from_lang: string, to_lang: string) {
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


