import { json } from '@sveltejs/kit';

import Turn from 'node-turn';



global.rtcPool;
import { rtcPool_st } from '$lib/js/stores.js';
import { opendir } from 'fs';
rtcPool_st.subscribe((data) => {
	global.rtcPool = data;
});



/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { par } = await event.request.json();
	const q = par;
	let resp = {};

	switch (q.func) {
		case 'operatorwaiting':
			try {
				let promise = new Promise((resolve, reject) => {
					try {
						OperatorWaiting(q, resolve);
					} catch (ex) {
						console.log(ex);
					}
				});

				resp = await promise;

				console.log(resp);
			} catch (ex) {
				console.log(par.func, ex);
			}
      break;
	}

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}
function OperatorWaiting(q, resolve) {
	try {
		if (!global.rtcPool[q.type][q.abonent]) global.rtcPool[q.type][q.abonent] = {};
		if (!global.rtcPool[q.type][q.abonent][q.operator])
			global.rtcPool[q.type][q.abonent][q.operator] = { resolve: '' };
		global.rtcPool[q.type][q.abonent][q.operator].resolve = resolve;
	} catch (ex) {
		console.log('OperatorWaiting ex:' + ex);
	}
}
