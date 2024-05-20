import Translate from './Translate';

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, fetch, cookies, request }) {
  let { func, text, arkan, level, type, lang } = await request.json();
}
