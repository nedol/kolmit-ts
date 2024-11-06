import ISO6391 from "iso-google-locales";
import { T as Translate } from "../../../../chunks/Translate.js";
import { Client } from "@gradio/client";
import { config } from "dotenv";
import { HfInference } from "@huggingface/inference";
config();
const HF_TOKEN = process.env.HF_TOKEN_2;
const inference = new HfInference(HF_TOKEN);
async function POST({ url, fetch, cookies, request }) {
  const formData = await request.formData();
  const fileContent = formData.get("file");
  const from_lang = formData.get("from_lang");
  const to_lang = formData.get("to_lang");
  const buffer = await fileContent.arrayBuffer();
  const nodeBuffer = Buffer.from(buffer);
  const blob = new Blob([nodeBuffer]);
  const arrayBuffer = await blob.arrayBuffer();
  await URL.createObjectURL(blob);
  let resp;
  if (from_lang == "_en") {
    resp = await stt_en(arrayBuffer, from_lang);
    if (resp) {
      resp = {
        [from_lang]: resp.text,
        [to_lang]: await Translate(resp.text, from_lang, to_lang)
      };
    }
  } else if (from_lang == "nl") {
    const result = await stt_sm4(blob, from_lang, to_lang);
    if (result) {
      resp = {
        [from_lang]: result,
        [to_lang]: await Translate(result, from_lang, to_lang)
      };
    }
  } else {
    const result = await stt_sm4(blob, from_lang);
    if (result) {
      resp = {
        [from_lang]: result.text,
        [to_lang]: await Translate(result.text, from_lang, to_lang)
      };
    }
  }
  console.log(resp);
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
async function stt_sm4(blob, from_lang, to_lang) {
  const app = await new Client(
    "https://bluman1-seamless-m4t-v2-large.hf.space/--replicas/y1arv"
  );
  await app.view_api();
  const from = ISO6391.getName(from_lang);
  ISO6391.getName(to_lang);
  const result = await app.predict("/s2tt", [
    blob,
    // blob in 'Input speech' Audio component
    from,
    // string  in 'Source language' Dropdown component
    from
    // string  in 'Target language' Dropdown component
  ]);
  return result.data[0];
}
async function stt_en(arrayBuffer, from_lang) {
  try {
    return await inference.automaticSpeechRecognition({
      data: arrayBuffer,
      model: "openai/whisper-large-v3",
      language: from_lang
    });
  } catch (ex) {
    console.log(ex);
  }
}
export {
  POST
};
