import { json } from '@sveltejs/kit';
import fs from 'fs';

import {
  GetDialog,
  UpdateDialog,
  UpdateListen,
  UpdateWords,
  UpdateBricks,
  GetLesson

} from '$lib/server/db.admin.ts';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, fetch, cookies }) {
  const dialog = url.searchParams.get('dialog');
  let data;

  if (dialog) {
    let name = dialog;
    let owner = url.searchParams.get('owner');
    let level = url.searchParams.get('level');
    data = await GetDialog({ name: name, owner: owner, level: level });

    let response = new Response(JSON.stringify({ data }));
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;
  }

}

export async function POST({ request, url, fetch }) {
	let resp;

	const { func,owner, operator,level, name, new_name, data, theme, lang, context,html, prompt_type } = await request.json();

	switch (func) {
    case 'get_les':
      const obj = await GetLesson({ operator:operator, owner:owner, level:level});
      let response = new Response(JSON.stringify(obj));
      response.headers.append('Access-Control-Allow-Origin', `*`);
      return response;
      break;
    case 'upd_dlg':
      UpdateDialog({ owner, level, name, new_name, data, lang, theme,prompt_type });
      break;
    case 'upd_listen':
      UpdateListen({ owner, level, name, new_name, data, lang });
      break;
    case 'upd_words':
      UpdateWords({ owner, level, name, new_name, data, lang, context });
      break;
    case 'upd_brks':
      UpdateBricks({ owner, level, name, new_name, lang, html, prompt_type, theme });
      break;  
  }

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
