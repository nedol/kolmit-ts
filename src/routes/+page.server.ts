import md5 from 'md5';
import dict from '$lib/dict/dict.json';
import { ice_conf } from '$lib/ice_conf';
import os from 'os';
import Turn from 'node-turn';

// import cc from '$lib/json/cc.json';

global.rtcPull = { user: {}, operator: {} };

import { CreatePool, GetUsers, GetGroup } from '$lib/server/db.js'; //src\lib\server\server.db.js

let kolmit;

if (!global.turn_server) {
	global.turn_server = new Turn({
		// set options
		authMech: 'long-term',
		listeningPort: 443
	});
	global.turn_server.start();
	global.turn_server.addUser('username', 'password');
	global.turn_server.log();
	console.log('Turn server started on ' + global.turn_server.listeningPort);
}

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

	let prom = new Promise((resolve, reject) => {
		CreatePool(resolve);
	});

	const host = url.origin; //'http://localhost:3000'; //'https://kolmit-sveltekit-nedol.vercel.app'; //

	let resp = {
		dict: dict,
		ice_conf: ice_conf
	};
	try {
		res = cookies.get('kolmit.operator:' + abonent);

		if (psw) {
			kolmit = { operator: operator, psw: md5(psw), name: name, lang: lang };
		} else {
			if (res) {
				kolmit = JSON.parse(res);
			} else {

				resp.check = false;
				resp.operator = '';
				resp.abonent = abonent;
				resp.operators = '{}';
				resp.dict = dict;
	
				return resp;
			}
		}
	} catch (ex) {
		console.log();
	}

	let params = {
		operator: kolmit.operator,
		abonent: abonent,
		psw: kolmit.psw
	};

	// let { operators, admin } = await GetUsers(params); //cc[0]; //
	let { group, oper } = await GetGroup(params);
	
	// global.rtcPool['user'][abonent][kolmit.operator]


	return {
		check: true,
		host: host,
		// url: decodeURIComponent(url.toString()),
		cookies:cookies.get('kolmit.operator:'+abonent),
		operator: oper,
		abonent: abonent,
		dict: dict,
		group: group,
		ice_conf: ice_conf
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
