import "lodash";
import translate from "translate";
translate.key = "0834516e-29b0-45d1-812e-b903d5962e12:fx";
async function Translate(text, from, to) {
  if (!text)
    return;
  translate.from = from;
  text = text.replace(/\r\n/g, "");
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  let translatedText = "";
  for (let i in sentences) {
    let chunk = sentences[i];
    if (!chunk)
      continue;
    let res;
    chunk = chunk.replace(/<</g, "<< ").replace(/>>/g, " >>");
    translate.engine = "google";
    try {
      res = await translate(chunk, { to, from });
    } catch (error) {
      console.error("Translation error:", error);
    }
    if (res) {
      res = res.replace(/«/g, "<<");
      res = res.replace(/»/g, ">>");
      res = res?.replace(/<<\s*(.*?)\s*>>/g, "<<$1>>");
    } else {
      res = text;
    }
    translatedText += res + " ";
  }
  return translatedText.trim();
}
export {
  Translate as T
};
