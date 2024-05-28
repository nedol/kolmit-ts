import { json } from '@sveltejs/kit';
import fs from 'fs';

import {
	GetGroups,UpdateDialog, UpdateLesson,
} from '$lib/server/db.admin.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch }) {
	let resp;

	const { func, owner, psw, level, levels, name, new_name, data, lang } = await request.json();

	switch (func) {

		case 'get_classes':
			resp = GetGroups({ owner, psw, lang });

		case 'upd_lesson':
			UpdateLesson({ owner, level, levels, data, lang });
			break;
	}
	
	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
