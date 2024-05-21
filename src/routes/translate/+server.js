import translate from 'translate';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request }) {
  let { func, text, arkan, level, type, lang } = await request.json();
}

  async function Translate(text, from_lang, to_lang) {
    try {
      translate.from = from_lang;

      return (
        ($dicts[text] && $dicts[text][$langs]) ||
        (await translate(text.trim(), to_lang))
      );
    } catch (error) {
      console.error('Translation error:', error);
      return text; // или другое подходящее значение по умолчанию
    }
  }