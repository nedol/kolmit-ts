import { json } from '@sveltejs/kit';
import fs from 'fs';

import {
  UpdateDialog,
  UpdateListen,
  UpdateWords,
  UpdateBricks,
  GetLesson

} from '$lib/server/db.admin.ts';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch }) {
	let resp;

	const { func,owner, operator,level, name, new_name, data, lang, context,html } = await request.json();

	switch (func) {
    case 'get_les':
      const obj = await GetLesson({ operator:operator, owner:owner, level:level});
      let response = new Response(JSON.stringify(obj));
      response.headers.append('Access-Control-Allow-Origin', `*`);
      return response;
      break;
    case 'upd_dlg':
      UpdateDialog({ owner, level, name, new_name, data, lang });
      break;
    case 'upd_listen':
      UpdateListen({ owner, level, name, new_name, data, lang });
      break;
    case 'upd_words':
      UpdateWords({ owner, level, name, new_name, data, lang, context });
      break;
    case 'upd_brks':
      UpdateBricks({ owner, level, name, new_name, data, lang, html });
      break;  
  }

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
