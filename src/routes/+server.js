import { json } from '@sveltejs/kit';
import { CreateOperator, CheckOperator } from '$lib/server/db.js'; //src\lib\server\server.db.js

import pkg from 'nodemailer';
const { Email } = pkg;

import md5 from 'md5';

import pkg_l from 'lodash';
const { find, findKey } = pkg_l;

import { request } from 'undici';

global.rtcPool;
import { rtcPool_st } from '$lib/js/stores.js';
rtcPool_st.subscribe((data) => {
  global.rtcPool = data;
});

global.interval;
global.loop = function () {
  try {
    if (!global.interval)
      global.interval = setInterval(async () => {
        const { statusCode, headers, trailers, body } = await request(
          `https://kolmit.onrender.com`
        );
        // console.log('response received', statusCode);
        // console.log('headers', headers);

        for await (const data of body) {
          // console.log('data', data);
        }
        //let resp = fetch('https://kolmit-service.onrender.com/?abonent=nedooleg@gmail.com');
      }, 1000 * 60 * 10);
  } catch (ex) {}
};

global.loop();

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, fetch, cookies }) {
  // let global.rtcPool = get('global.rtcPool');
  const abonent = url.searchParams.get('abonent');
  const admin = url.searchParams.get('admin');
  const text = url.searchParams.get('text');
  const dict = url.searchParams.get('dict');
  const key = url.searchParams.get('key');
  const func = url.searchParams.get('func');
  const lang = url.searchParams.get('lang');

  // debugger;
  if (func === 'reset') {
    cookies.delete('kolmit.operator:' + abonent);
  } else if (func === 'cookie') {
    if (lang) {
      try {
        let cookie = cookies.get(`kolmit.operator:${abonent}`);
        cookie = JSON.parse(cookie);
        cookie.lang = lang;
        const oper = admin ? 'admin' : 'operator';
        cookies.set(`kolmit.${oper}:${abonent}`, JSON.stringify(cookie), {
          path: '/',
          maxAge: 60 * 60 * 24 * 400,
        });
      } catch (ex) {
        console.log(ex);
      }
    }
  } else if (func === 'set_lang') {
    if (lang) {
      try {
        let cookie = cookies.get(`kolmit.admin:${abonent}`);
        cookie = JSON.parse(cookie);
        cookie.lang = lang;
        const oper = admin ? 'admin' : 'operator';
        cookies.set(`kolmit.${oper}:${abonent}`, JSON.stringify(cookie), {
          path: '/',
          maxAge: 60 * 60 * 24 * 400,
        });
      } catch (ex) {
        console.log(ex);
      }
    }

    let response = new Response();
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;
  } else if (text) {
    // let resp = await fetch('/src/routes/operator/lesson/' + path);
    const level = url.searchParams.get('level');
    const theme = url.searchParams.get('theme');

    let text = await GetText({ owner: abonent, level: level, theme: theme });
    // let data = await resp.text();
    // let items = text.split('\r\n');
    let obj = { text: text };
    let response = new Response(JSON.stringify({ obj }));
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;
  } else if (dict) {
    const level = url.searchParams.get('level');
    const theme = url.searchParams.get('theme');
    // let resp = await fetch('/src/routes/operator/lesson/' + path);
    let data = await GetDict({
      owner: abonent,
      type: dict,
      level: level,
      theme: theme,
    });
    // let data = await resp.text();
    // let items = text.split('\r\n');
    //debugger;
    if (data) {
      let response = new Response(JSON.stringify({ data }));
      response.headers.append('Access-Control-Allow-Origin', `*`);
      return response;
    }
  }

  let response = new Response();
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch, cookies }) {
  //debugger;
  let resp;
  let abonent = url.searchParams.get('abonent');
  const { par } = await request.json();
  const q = par;
  let res = cookies.get('abonent:' + abonent);
  let kolmit;
  if (res) {
    kolmit = JSON.parse(res);
  } else {
    kolmit = { psw: md5('demo') };
  }

  switch (q.func) {
    case 'operator':
      if (q.email && q.psw) {
        const par = await CreateOperator(q);
        if (par) {
          cookies.set(
            'kolmit.operator:' + q.abonent,
            JSON.stringify({
              name: par.name,
              operator: par.operator,
              abonent: q.abonent,
              psw: par.psw,
              email: q.email,
              lang: par.lang,
            }),
            {
              path: '/',
              maxAge: 60 * 60 * 24 * 400,
            }
          );

          resp = JSON.stringify({
            func: par.func,
            name: q.name,
            operator: q.operator,
            abonent: q.abonent,
            lang: q.lang,
          });
        }
      }
      break;

    case 'check':
      SetParams(q);

      if (q.type === 'user') {
        let cnt_queue = 0;
        let item = global.rtcPool[q.type][q.abonent][q.operator][q.uid];

        let operators = { [q.operator]: {} };
        for (let uid in global.rtcPool['operator'][q.abonent]) {
          if (uid !== 'resolve')
            operators[q.operator][uid] = {
              type: q.type,
              abonent: q.abonent,
              operator: q.operator,
              uid: q.uid,
              status: global.rtcPool['operator'][q.abonent][uid].status,
            };
        }

        resp = {
          func: q.func,
          type: q.type,
          check: true,
          operators: operators,
        };

        SendOperatorOffer(q);
        return new Response(JSON.stringify({ resp }));
      } else if (q.type === 'operator') {
        let res = cookies.get('kolmit.operator:' + q.abonent);
        let kolmit;
        if (res) {
          kolmit = JSON.parse(res);
        }
        q.psw = kolmit.psw;
        // console.log(q.operator)
        resp = await CheckOperator(q);
        console.log(resp);
      }

      break;
    case 'offer':
      try {
        SetParams(q);
        BroadcastOperatorStatus(q, 'offer');
        resp = { result: 'offer' };
      } catch (ex) {
        console.log();
      }

      break;

    case 'call':
      HandleCall(q);

      break;

    case 'status':
      if (q.status === 'call') {
        if (q.type === 'operator') {
          let item = global.rtcPool[q.type][q.abonent][q.operator][q.uid];
          if (item) item.status = 'busy';
          BroadcastOperatorStatus(q, 'busy');
          // global.rtcPool['operator'][q.abonent][q.operator].shift();
        }
        break;
      }
      if (q.status === 'close') {
        try {
          let item = global.rtcPool[q.type][q.abonent][q.operator][q.uid];
          if (item) {
            item.status = q.status;
            if (q.type === 'operator') BroadcastOperatorStatus(q, 'close');
          }
        } catch (ex) {}
        //this.RemoveAbonent(q);
        break;
      }

      SetParams(q);

      break;
  }

  // set('global.rtcPool', global.rtcPool);
  rtcPool_st.set(global.rtcPool);

  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}

function SendEmail(q, new_email) {
  return;
  let operator = new Email();
  const abonent = q.abonent ? '&abonent=' + q.abonent : '';
  const mail = q.send_mail || new_email;
  const hash = this.getHash(mail);
  let text = {
    ru: '<h1>Присоединиться к сети</h1></a>',
    en: '<h1>Join network</h1></a>',
    fr: '<h1>Rejoindre le réseau</h1></a>',
  }[q.lang];
  let html =
    "<div><a href='http://localhost:5000/kolmit/site/operator.html?operator=" +
    (q.send_mail || new_email) +
    abonent +
    '&hash=' +
    hash +
    "'>" +
    text +
    '</a></div>';

  operator.SendMail(
    'nedol@narod.ru',
    q.send_mail || new_email,
    {
      ru: 'Новый оператор сети Колми',
      en: 'New Kolmi network operator',
      fr: 'Le nouvel opérateur de Kolmi',
    }[q.lang],
    html,
    (result) => {
      // console.log();
    }
  );
}

function SetParams(q) {
  if (!global.rtcPool[q.type][q.abonent]) {
    global.rtcPool[q.type][q.abonent] = {};
  }

  if (!global.rtcPool[q.type][q.abonent][q.operator])
    global.rtcPool[q.type][q.abonent][q.operator] = [];

  let item;
  if (q.type === 'user') {
    item = global.rtcPool[q.type][q.abonent][q.operator][q.uid];
  } else item = global.rtcPool[q.type][q.abonent][q.operator][0];

  if (!item) {
    item = {};
    item.cand = [];
    global.rtcPool[q.type][q.abonent][q.operator][q.uid] = item;
  }

  item.uid = q.uid;
  item.status = q.status;
  item.abonent = q.abonent;
  item.operator = q.operator;

  if (q.desc) item.desc = q.desc;
  if (Array.isArray(q.cand)) {
    q.cand.forEach((cand, index) => {
      item.cand.push(cand);
    });
  } else if (q.cand) item.cand.push(q.cand);

  // ws.onclose = function (ev) {
  // 	if (q.type === 'operator') {
  // 		let item = _.find(global.rtcPool[q.type][q.abonent][q.operator], {
  // 			uid: q.uid
  // 		});
  // 		if (item) item.status = 'close';
  // 		that.BroadcastOperatorStatus(q, 'close');
  // 		const ind = _.findIndex(global.rtcPool[q.type][q.abonent][q.operator], {
  // 			uid: q.uid
  // 		});
  // 		global.rtcPool[q.type][q.abonent][q.operator].splice(ind, 1);
  // 	} else if ((q.type = 'user')) {
  // 		if (global.rtcPool[q.type][q.abonent]) {
  // 			that.SendUserStatus(q);
  // 			const index = _.findIndex(global.rtcPool[q.type][q.abonent][q.operator], {
  // 				uid: q.uid
  // 			});
  // 			global.rtcPool[q.type][q.abonent][q.operator].splice(index, 1);
  // 		}
  // 	}
  // };
}

function BroadcastOperatorStatus(q, check) {
  try {
    let queue = 0;
    if (!global.rtcPool['user'][q.abonent]) return;
    for (let uid in global.rtcPool['user'][q.abonent][q.operator]) {
      if (q.uid && global.rtcPool['user'][q.abonent][q.operator][uid]) {
        queue++;
      }
    }
    let type = q.type === 'operator' ? 'user' : 'operator';

    let operators = { [q.operator]: {} };
    for (let uid in global.rtcPool['operator'][q.abonent][q.operator]) {
      if (uid !== 'resolve')
        operators[q.operator][uid] = {
          type: q.type,
          abonent: q.abonent,
          operator: q.operator,
          uid: q.uid,
          status: global.rtcPool['operator'][q.abonent][q.operator][uid].status,
          queue: queue,
        };
    }

    for (let operator in global.rtcPool[type][q.abonent]) {
      if (operator === q.operator && q.status === 'call')
        //not to send to yourself
        continue;
      for (let uid in global.rtcPool[type][q.abonent][operator]) {
        let item = global.rtcPool[type][q.abonent][operator][uid];
        let offer = find(operators[q.operator], { status: 'offer' });
        if (
          offer &&
          // && item.abonent === q.operator
          item.uid !== q.uid
        ) {
          if (item.status === 'wait') {
            let oper = global.rtcPool['operator'][q.abonent][q.operator][q.uid];

            let remAr = [
              {
                func: q.func,
                type: type,
                abonent: q.abonent,
                oper_uid: q.uid,
                desc: oper.desc,
                cand: oper.cand,
              },
            ];
            if (global.rtcPool[type][q.abonent][operator].resolve)
              global.rtcPool[type][q.abonent][operator].resolve(remAr);
          } else {
            if (global.rtcPool[type][q.abonent][operator].resolve)
              global.rtcPool[type][q.abonent][operator].resolve([
                {
                  func: q.func,
                  type: type,
                  abonent: q.abonent,
                  operator: q.operator,
                  uid: q.uid,
                  operators: operators,
                },
              ]);
          }
        } else {
          if (global.rtcPool[type][q.abonent][operator].resolve)
            global.rtcPool[type][q.abonent][operator].resolve([
              {
                func: q.func,
                type: type,
                abonent: q.abonent,
                operator: operator,
                uid: q.uid,
                operators: operators,
              },
            ]);
        }
      }
    }

    operators = '';
  } catch (ex) {
    // console.log(ex);
  }
}

function SendOperatorOffer(q) {
  if (
    global.rtcPool['operator'] &&
    global.rtcPool['operator'][q.abonent] &&
    global.rtcPool['operator'][q.abonent][q.operator]
  ) {
    for (let uid in global.rtcPool['operator'][q.abonent][q.operator]) {
      if (
        global.rtcPool['operator'][q.abonent][q.operator][uid].status ===
        'offer'
      ) {
        let operator = {
          abonent: q.abonent,
          operator: q.operator,
          uid: uid,
          status: global.rtcPool['operator'][q.abonent][q.operator][uid].status,
          desc: global.rtcPool['operator'][q.abonent][q.operator][uid].desc,
          cand: global.rtcPool['operator'][q.abonent][q.operator][uid].cand,
        };

        if (q.type === 'user') {
          let item = global.rtcPool['user'][q.abonent][q.operator][q.uid];
          global.rtcPool['user'][q.abonent][q.operator].resolve([
            { operator: operator },
          ]);
        }
      }
    }
  }
}

async function HandleCall(q) {
  let remAr = [];
  if (q.type === 'user') {
    if (q.desc || q.cand) {
      remAr.push({
        func: q.func,
        desc: q.desc,
        cand: q.cand,
        abonent: q.abonent,
        user: q.operator,
        // "abonent": q.operator
      });
      if (!global.rtcPool['operator'][q.abonent][q.target]) return;
      let item = global.rtcPool['operator'][q.abonent][q.target][q.oper_uid];

      if (item) {
        await global.rtcPool['operator'][q.abonent][q.target].promise;
        if (global.rtcPool['operator'][q.abonent][q.target].resolve) {
          console.log('HandleCall to operator', remAr.length);
          global.rtcPool['operator'][q.abonent][q.target].resolve(remAr);
        }
      }
    } else {
      let item = global.rtcPool['user'][q.abonent][q.user];

      if (item) {
        let oper_check = findKey(
          global.rtcPool['operator'][q.abonent][q.operator],
          {
            status: 'check',
          }
        );

        let oper_offer_key = findKey(
          global.rtcPool['operator'][q.abonent][q.user],
          {
            status: 'offer',
          }
        );

        let oper_offer =
          global.rtcPool['operator'][q.abonent][q.user][oper_offer_key];

        if (oper_offer) {
          remAr.push({
            func: q.func,
            abonent: q.abonent,
            uid: q.uid,
            oper_uid: oper_offer.uid,
            desc: oper_offer.desc,
            cand: oper_offer.cand,
          });
          await global.rtcPool['operator'][q.abonent][q.operator].promise;
          if (global.rtcPool['user'][q.abonent][q.operator].resolve)
            global.rtcPool['user'][q.abonent][q.operator].resolve(remAr);
          // console.log('HandleCall to user', remAr.length);
          return;
        } else {
          item.status = 'wait';
          remAr.push({
            func: q.func,
            abonent: q.abonent,
            status: 'wait',
          });
          await global.rtcPool['operator'][q.abonent][q.operator].promise;
          if (global.rtcPool['user'][q.abonent][q.operator].resolve)
            global.rtcPool['user'][q.abonent][q.operator].resolve(remAr);

          if (oper_check && oper_check.resolve) {
            let remAr = [
              {
                func: q.func,
                abonent: q.abonent,
                user_uid: item.uid,
                status: 'wait',
              },
            ];
            oper_check.resolve(remAr);
          }
        }
      }
    }
  }
}
