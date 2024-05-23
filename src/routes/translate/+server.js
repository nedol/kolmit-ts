import { Translate } from './Translate';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request }) {
  let { question } = await request.json();

  let resp = await Translate(
    question.text,
    question.from_lang,
    question.to_lang
  );

  // console.log(resp);
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}
