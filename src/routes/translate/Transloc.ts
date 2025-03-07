

export async function Translate(text: string, from_lang: string, to_lang: string, quiz: string) {
  try {   


    if (from_lang === to_lang) return text;

    let question = { func: "translate",text: text, from_lang: from_lang, to_lang: to_lang, quiz:quiz };
    
    text = text?.trim();

    if(!text){
      return text;
    }

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


