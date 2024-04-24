import { json } from '@sveltejs/kit';
import fs from 'fs';

import { DeleteUser, AddUser } from '$lib/server/db.admin.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch }) {
	let resp;

	const { func, class_name, role, name, operator, abonent, lang } = await request.json();

	switch (func) {
		case 'add_user':
			resp = await AddUser({ class_name, role,  name, operator, abonent, lang });
			break;
		case 'del_user':
			resp = await DeleteUser({ name, operator, abonent });
			break;
	}

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
