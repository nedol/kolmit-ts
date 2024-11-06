import { config } from "dotenv";
import { g as GetPrompt } from "../../../../chunks/db.js";
import { T as Translate } from "../../../../chunks/Translate.js";
import Groq from "groq-sdk";
config();
process.env.HF_TOKEN;
new Groq({
  apiKey: "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"
  // process.env.GROQ_API_KEY,
});
async function POST({ request, fetch }) {
  let { question } = await request.json();
  const prompt = await GetPrompt("chat");
  await Translate(question.text, question.lang, "en");
  let answer = await chatLlama(prompt.prompt.system);
  let res = {
    ["nl"]: await Translate(answer, question.llang, "nl"),
    ["en"]: await Translate(answer, question.llang, "en"),
    [question.lang]: await Translate(answer, question.llang, question.lang)
  };
  let response = new Response(JSON.stringify({ res }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
async function chatLlama(system, task) {
  return "";
}
export {
  POST
};
