import md5 from 'md5';
import dict from '$lib/dict/dict.json';
import os from 'os';

import { CreatePool_neon, GetUsers } from '$lib/server/db.js'; //src\lib\server\server.db.js
import {  SetSQL, GetGroups } from '$lib/server/db.admin.js'; 

let kolmit;

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, cookies, route, url, stuff }) {
	// res.json({ response: completion.data.choices[0].text }
	// let operator = url.searchParams.get('operator');

	let res;

	let abonent = url.searchParams.get('abonent');
	let lang = url.searchParams.get('lang');
	let name = url.searchParams.get('name');
	let operator = url.searchParams.get('operator');
	let psw = url.searchParams.get('psw');
	let sql = ''

	let prom = new Promise((resolve, reject) => {
		CreatePool_neon(resolve);
	});

	sql = await prom;

	SetSQL(sql)

	let host = url.origin; //'http://localhost:3000'; //'https://kolmit-sveltekit-nedol.vercel.app'; //

	let resp = {
		dict: dict
	};
	try {
		res = cookies.get('kolmit.admin.' + abonent);

		if (psw) {
			kolmit = { operator: operator, psw: md5(psw), name: name, lang: lang };
		} else {
			if (res) {
				kolmit = JSON.parse(res);
			} else {
				resp.check = false;
				resp.abonent = abonent;
				resp.users = '{}';
				resp.host = host;
				return resp;
			}
		}
	} catch (ex) {
		console.log();
	}

	let params = {
		operator: abonent,
		abonent: abonent,
		psw: kolmit.psw
	};

	let { operators, admin, groups } = await GetGroups(params); 

return {
		check: true,
		host: host,
		groups: groups,
		operators:operators,
		// url: decodeURIComponent(url.toString()),
		operator: kolmit.operator,
		name: kolmit.name,
		abonent: abonent,
		lang: kolmit.lang,
		dict: dict,
	};
}

// export const actions = {
// 	default: async ({ cookies, request, url }) => {
// 		const abonent = url.searchParams.get('abonent');
// 		const data = await request.formData();
// 		if (data.get('psw') !== data.get('confirmPassword')) return;
// 		let q = {
// 			abonent: abonent,
// 			img: data.get('oper_pic_text'),
// 			name: data.get('name'),
// 			email: data.get('email'),
// 			psw: md5(data.get('psw')),
// 			lang: data.get('lang')
// 		};

// 		cookies.set(
// 			'abonent:' + q.abonent,
// 			JSON.stringify({
// 				name: q.name,
// 				operator: q.email,
// 				abonent: q.abonent,
// 				psw: q.psw,
// 				lang: q.lang
// 			}),
// 			{ maxAge: 60 * 60 * 24 * 30 * 1000 }
// 		);

// 		await CreateOperator(q);
// 	}
// };
