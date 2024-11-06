import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as googleTTS from "google-tts-api";
import "google-translate-api-x";
import textToSpeech from "@google-cloud/text-to-speech";
import { R as ReadSpeech, W as WriteSpeech } from "../../../../chunks/db.js";
import md5 from "md5";
import "fs-extra";
import "../../../../chunks/index.js";
import "axios";
import { config } from "dotenv";
import "iso-google-locales";
import "@gradio/client";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
new textToSpeech.TextToSpeechClient();
config();
process.env.HF_TOKEN_3;
const audioDir = path.join(__dirname, "audio");
async function POST({ url, fetch, cookies, request, response }) {
  let resp;
  let abonent = url.searchParams.get("abonent");
  const { par } = await request.json();
  const q = par;
  switch (q.func) {
    case "tts":
      resp = { audio: await tts_google(q.text, q.lang, abonent, q.quiz) };
      break;
  }
  response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
async function tts_google(text, lang, abonent, quiz) {
  try {
    const fileName = md5(text) + ".mp3";
    const filePath = join(audioDir, fileName);
    const data = await ReadSpeech({ key: md5(text) });
    if (data) {
      console.log(`Файл уже существует`);
      return "data:audio/mpeg;base64," + data;
    }
    const url = await googleTTS.getAllAudioBase64(text, {
      //getAudioUrl(text, {
      lang,
      slow: false,
      host: "https://translate.google.com",
      timeout: 1e4
    });
    let base64 = "";
    url.map((e) => {
      base64 += e.base64;
    });
    WriteSpeech({ lang, key: md5(text), text, data: base64, quiz });
    console.log(`Файл сохранён`);
    return "data:audio/mpeg;base64," + base64;
  } catch (error) {
    console.error("Error converting text to speech:", error);
  }
}
export {
  POST
};
