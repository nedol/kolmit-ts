import { CreateAdmin } from '$lib/server/db.admin.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch, cookies }) {
	const { par } = await request.json();

  const resp = await CreateAdmin(par);

	if (resp) {
		cookies.set(
			'abonent:' + resp.hash,
			JSON.stringify({
				name: resp.name,
				operator: resp.hash,
				abonent: resp.hash,
				psw: resp.psw,
				lang: 'en'
			}),
			{ maxAge: 60 * 60 * 24 * 400 }
		);
	}

  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}
