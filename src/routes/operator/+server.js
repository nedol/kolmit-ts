import { json } from '@sveltejs/kit';

global.rtcPool;
import { rtcPool_st } from '$lib/js/stores.js';
rtcPool_st.subscribe((data) => {
	global.rtcPool = data;
});

export const config = {
	// runtime: 'edge'
	// isr: {
	// 	expiration: false // 10
	// }
};



/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { par } = await event.request.json();
	const q = par;
	let resp;

	switch (q.func) {
		case 'callwaiting':
			try {
				let promise = new Promise((resolve, reject) => {
					// if (global.rtcPool[q.type][q.abonent][q.operator].post_resolve)
					// 	global.rtcPool[q.type][q.abonent][q.operator].post_resolve(resolve);
					CallWaiting(q, resolve);
					if (global.rtcPool[q.type][q.abonent][q.operator].resolve_post)
						global.rtcPool[q.type][q.abonent][q.operator].resolve_post();
				});
				resp = await promise;
				global.rtcPool[q.type][q.abonent][q.operator].promise = new Promise((resolve, reject) => {
					global.rtcPool[q.type][q.abonent][q.operator].resolve_post = resolve;
				});
			} catch (ex) {
				console.log('callwaiting' + ex);
			}
			break;
	}

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}

function CallWaiting(q, resolve) {
	try {
		if (!global.rtcPool[q.type][q.abonent]) global.rtcPool[q.type][q.abonent] = {};
		if (!global.rtcPool[q.type][q.abonent][q.operator])
			global.rtcPool[q.type][q.abonent][q.operator] = { resolve: '' };
		global.rtcPool[q.type][q.abonent][q.operator].resolve = resolve;
	} catch (e) {
		console.log();
	}
}
