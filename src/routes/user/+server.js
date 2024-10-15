import { json } from '@sveltejs/kit';

import Turn from 'node-turn';

import { CreateOperator, CheckOperator, GetUsers } from '$lib/server/db.js'; 

import pkg_l from 'lodash';
const { find, findKey } = pkg_l;

global.rtcPool;
import { rtcPool_st } from '$lib/js/stores.js';
import { opendir } from 'fs';
rtcPool_st.subscribe((data) => {
	global.rtcPool = data;
});

/** @type {import('./$types').RequestHandler} */

export async function GET({ url, fetch, cookies }) {
  const abonent = url.searchParams.get('abonent');
  const operator = url.searchParams.get('operator');
  const func = url.searchParams.get('func');

  let data;
  let q = {};
  let resp = {};

  	switch (func) {
      case 'operators':
        resp = await getOperators({operator:operator,abonent:abonent});
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

async function getOperators(q, func) {
  const users = await GetUsers(q);
  let operators = { [q.operator]: {} };
  for (let oper in global.rtcPool['operator'][q.abonent]) {
    const user = find(users.operators, { operator: oper });

    operators[oper] = {
      type: q.type,
      abonent: q.abonent,
      operator: oper,
      status: global.rtcPool['operator'][q.abonent][oper][oper].status?global.rtcPool['operator'][q.abonent][oper][oper].status:'',
      picture: user.picture,
      name: user.name,
    };
  }

  return operators;
}


async function GetOperators(q, check) {
  let operators = {};
  try {
    const users = await GetUsers(q);

    let type = q.type === 'operator' ? 'user' : 'operator';

    for (let oper in global.rtcPool['operator'][q.abonent]) {
      operators[oper] = {};
      for (let uid in global.rtcPool['operator'][q.abonent][oper]) {
        if (
          uid !== 'resolve' &&
          global.rtcPool['operator'][q.abonent][oper][uid].status
        ) {
          const user = find(users.operators, { operator: q.operator });

          operators[oper] = {
            type: q.type,
            abonent: q.abonent,
            operator: oper,
            uid: q.uid,
            status: global.rtcPool['operator'][q.abonent][oper][oper].status,
            picture: user.picture,
            name: user.name,
          };
        }
      }
    }
  } catch (ex) {
    // console.log(ex);
  }
  return operators;
}
