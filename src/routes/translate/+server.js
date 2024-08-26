import { Translate } from './Translate';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request }) {
  let { question } = await request.json();

    // console.log(question.text);

  let resp = await Translate(
    question.text,
    question.from_lang,
    question.to_lang
  );
  console.log(question.text,resp);


  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}
