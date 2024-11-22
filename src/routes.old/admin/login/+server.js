import { CreateAdmin } from '$lib/server/db.admin.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch, cookies }) {
  const { par } = await request.json();

  const resp = await CreateAdmin(par);

  if (resp) {
    try {
      //   let cookie = cookies.get(`kolmit.admin.${resp.operator}`);
      //   cookie = JSON.parse(cookie);
      //   cookie.lang = lang;

      cookies.set(
        'kolmit.admin.' + resp.operator,
        JSON.stringify({
          name: resp.name,
          abonent: resp.operator,
          operator: resp.operator,
          psw: resp.psw,
          lang: par.lang,
        }),
        {
          path: '/',
          maxAge: 60 * 60 * 24 * 400,
        }
      );
    } catch (ex) {
      console.log(ex);
    }
  }

  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}
