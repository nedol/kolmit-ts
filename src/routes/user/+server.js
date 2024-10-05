import { json } from '@sveltejs/kit';

import Turn from 'node-turn';

global.rtcPool;
import { rtcPool_st } from '$lib/js/stores.js';
rtcPool_st.subscribe((data) => {
	global.rtcPool = data;
});

/** @type {import('./$types').RequestHandler} */
export async function GET(event, fetch) {
	let q = {};

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}

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

				// console.log(resp);
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

function getOperators(q, func) {
  let operators = { [q.operator]: {} };
  for (let uid in global.rtcPool['operator'][q.abonent][q.operator]) {
    if (uid !== 'resolve')
      operators[q.operator][uid] = {
        type: q.type,
        abonent: q.abonent,
        operator: q.operator,
        uid: q.uid,
        status: global.rtcPool['operator'][q.abonent][q.operator][uid].status
      };
  }

  return operators;
}


function GetOperators(q, check) {
  try {
    let uids = [];
    let queue = 0;
    if (!global.rtcPool['user'][q.abonent]) return;
    for (let uid in global.rtcPool['user'][q.abonent][q.operator]) {
      if (q.uid && global.rtcPool['user'][q.abonent][q.operator][uid]) {
        queue++;
      }
    }
    let type = q.type === 'operator' ? 'user' : 'operator';

    let operators = {};
    for (let oper in global.rtcPool['operator'][q.abonent]) {
      operators[oper] = {};
      for (let uid in global.rtcPool['operator'][q.abonent][oper]) {
        if (
          uid !== 'resolve' &&
          global.rtcPool['operator'][q.abonent][oper][uid].status
        )
          operators[oper][uid] = {
            type: q.type,
            abonent: q.abonent,
            operator: oper,
            uid: q.uid,
            status: global.rtcPool['operator'][q.abonent][oper][uid].status,
            queue: queue,
          };
      }
    }

    return operators;
  } catch (ex) {
    // console.log(ex);
  }
}
