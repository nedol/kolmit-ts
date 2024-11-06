import { T as Translate } from "../../../chunks/Translate.js";
async function POST({ url, fetch, cookies, request }) {
  let { question } = await request.json();
  let resp = await Translate(
    question.text,
    question.from_lang,
    question.to_lang
  );
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
export {
  POST
};
