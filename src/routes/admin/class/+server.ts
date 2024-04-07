import { json } from '@sveltejs/kit';
import fs from 'fs';

import { DeleteUser, AddUser } from '$lib/server/db.admin.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch }) {
	let resp;

	const { func, role, name, email, abonent,lang } = await request.json();

	switch (func) {
		case 'add_user':
			AddUser({ role, name, email, abonent, lang });
			break;
		case 'del_user':
			DeleteUser({ name, email, abonent });
			break;
	}

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
