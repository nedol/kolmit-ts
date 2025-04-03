

export async function Translate(text: string, from_lang: string, to_lang: string, quiz: string) {
  try {
    text = text?.trim(); // сначала обрезаем пробелы

    if (!text || from_lang === to_lang) {
      return text;
    }

    const question = { func: "translate", text, from_lang, to_lang, quiz };

    const response = await fetch(`/translate`, {
      method: 'POST',
      body: JSON.stringify({ question }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status}`);
      return text;
    }

    const data = await response.json();

    if (!data || !data.resp) {
      console.error("Invalid response format", data);
      return text;
    }

    return data.resp;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}


