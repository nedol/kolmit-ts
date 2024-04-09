import { json } from '@sveltejs/kit';
import fs from 'fs';

import { UpdateDialog, UpdateLesson } from '$lib/server/db.supabase.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch }) {
	let resp;

	const { func, owner, level, name, new_name, data } = await request.json();

	switch (func) {
		case 'upd_lesson':
			UpdateLesson({ owner, level, data });
			break;
		case 'upd_dlg':
			UpdateDialog({ owner, level, name, new_name, data });
			break;
	}

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
