import "../../../../../chunks/index.js";
import { config } from "dotenv";
import "@gradio/client";
import Groq from "groq-sdk";
import { G as GetPrompt } from "../../../../../chunks/db.admin.js";
config();
process.env.HF_TOKEN;
const groq = new Groq({
  apiKey: "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"
  //process.env.GROQ_API_KEY,
});
async function CreateContent(par) {
  const content = await chatGroq(par.prompt.system, "");
  return content;
}
async function chatGroq(system, task) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: system
        },
        {
          role: "user",
          content: task
        }
      ],
      model: "mixtral-8x7b-32768",
      //'llama2-70b-4096',//
      temperature: 0.9,
      top_p: 1,
      stop: null,
      max_tokens: 4096,
      stream: false
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Ошибка при взаимодействии:", error);
  }
}
async function GET({ url, fetch, cookies }) {
  let resp;
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
async function POST({ request, url, fetch }) {
  let resp;
  const req = await request.json();
  switch (req.func) {
    case "create_content":
      req.prompt = await GetPrompt("dialog");
      req.prompt.system = req.prompt.system.replaceAll("${$llang}", req.llang);
      req.prompt.system = req.prompt.system.replaceAll("${name[$llang]}", req.name);
      req.prompt.system = req.prompt.system.replaceAll("${$langs}", req.langs);
      if (req.html)
        req.prompt.system = req.prompt.system.replaceAll("${dialog_data.html}", req.html);
      if (req.level)
        req.prompt.system = req.prompt.system.replaceAll("${data.level}", req.level);
      req.prompt.system = req.prompt.system.replaceAll("${num}", req.num);
      if (req.words)
        req.prompt.system = req.prompt.system.replaceAll(
          "${dialog_data_words}",
          req.words
        );
      console.log(req.prompt.system);
      resp = await CreateContent(req);
  }
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
export {
  GET,
  POST
};
