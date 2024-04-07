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
export async function GET(event) {
	// let global.rtcPool = get('global.rtcPool');

	let q = {};
	q.func = event.url.searchParams.get('func');
	q.role = event.url.searchParams.get('role');
	q.uid = event.url.searchParams.get('uid');
	q.abonent = event.url.searchParams.get('abonent');
	q.type = event.url.searchParams.get('type');
	q.em = event.url.searchParams.get('em');

	let resp;
	switch (q.func) {
		case 'callwaiting':
			try {
				let promise = new Promise((resolve, reject) => {
					// if (global.rtcPool[q.type][q.abonent][q.em].post_resolve)
					// 	global.rtcPool[q.type][q.abonent][q.em].post_resolve(resolve);
					// console.log('oper global.rtcPool' + JSON.stringify(global.rtcPool));
					CallWaiting(q, resolve);
					if (global.rtcPool[q.type][q.abonent][q.em].resolve_post)
						global.rtcPool[q.type][q.abonent][q.em].resolve_post();
					// set('global.rtcPool', global.rtcPool);
					rtcPool_st.set(global.rtcPool);
				});
				resp = await promise;
				global.rtcPool[q.type][q.abonent][q.em].promise = new Promise((resolve, reject) => {
					global.rtcPool[q.type][q.abonent][q.em].resolve_post = resolve;
					// set('global.rtcPool', global.rtcPool);
					rtcPool_st.set(global.rtcPool);
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

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { par } = await event.request.json();
	const q = par;
	let resp;

	switch (q.func) {
		case 'callwaiting':
			try {
				let promise = new Promise((resolve, reject) => {
					// if (global.rtcPool[q.type][q.abonent][q.em].post_resolve)
					// 	global.rtcPool[q.type][q.abonent][q.em].post_resolve(resolve);
					CallWaiting(q, resolve);
					if (global.rtcPool[q.type][q.abonent][q.em].resolve_post)
						global.rtcPool[q.type][q.abonent][q.em].resolve_post();
				});
				resp = await promise;
				global.rtcPool[q.type][q.abonent][q.em].promise = new Promise((resolve, reject) => {
					global.rtcPool[q.type][q.abonent][q.em].resolve_post = resolve;
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
		if (!global.rtcPool[q.type][q.abonent][q.em])
			global.rtcPool[q.type][q.abonent][q.em] = { resolve: '' };
		global.rtcPool[q.type][q.abonent][q.em].resolve = resolve;
	} catch (e) {
		console.log();
	}
}
