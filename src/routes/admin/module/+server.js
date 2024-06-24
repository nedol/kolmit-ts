import { json } from '@sveltejs/kit';
import fs from 'fs';

import {
  UpdateDialog,
  UpdateLesson,
  UpdateListen,
  UpdateWords,

} from '$lib/server/db.admin.js';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch }) {
	let resp;

	const { func, owner, level, name, new_name, data, lang } = await request.json();

	switch (func) {
    case 'upd_dlg':
      UpdateDialog({ owner, level, name, new_name, data, lang });
      break;
    case 'upd_listen':
      UpdateListen({ owner, level, name, new_name, data, lang });
      break;
    case 'upd_words':
      UpdateWords({ owner, level, name, new_name, data, lang });
      break;
  }

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
