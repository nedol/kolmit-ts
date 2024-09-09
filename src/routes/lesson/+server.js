import { json } from '@sveltejs/kit';
import fs from 'fs';
// import { path } from '$lib/js/server.path.js';
import {
  GetLesson,
  GetDialog,
  GetListen,
  GetDict,
  GetWords,
  UpdateQuizUsers,
} from '$lib/server/db.js';
// import { getContext } from 'svelte';

export const config = {
  runtime: 'edge',
  // isr:{
  // 	expiration: false// 10
  // }
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, fetch, cookies }) {
  const abonent = url.searchParams.get('abonent');
  const text = url.searchParams.get('text');
  const dict = url.searchParams.get('dict');
  const words = url.searchParams.get('words');
  const dialog = url.searchParams.get('dialog');
  const lesson = url.searchParams.get('lesson');
  const listen = url.searchParams.get('listen');
  const lvl = url.searchParams.get('level');
  let data;
  // debugger;
  if (text) {
    // let resp = await fetch('/src/routes/operator/operator/lesson/' + path);
    const theme = url.searchParams.get('theme');
    const title = url.searchParams.get('title');

    data = await GetText({
      owner: abonent,
      level: lvl,
      theme: theme,
      title: title,
    });

  } else if (dict) {
    const theme = url.searchParams.get('theme');
    // let resp = await fetch('/src/routes/operator/operator/lesson/' + path);
    data = await GetDict({
      owner: abonent,
      type: dict,
      level: lvl,
      theme: theme,
    });
    // let data = await resp.text();
    // let items = text.split('\r\n');
    //debugger;

  } else if (words) {
    const theme = url.searchParams.get('theme');
    const name = url.searchParams.get('name');
    const owner = url.searchParams.get('owner');
    const level = url.searchParams.get('level');
    data = await GetWords({ theme: theme, name: name, owner: owner, level: level });
    
    let response = new Response(JSON.stringify({ data }));
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;

  } else if (dialog) {
    let name = dialog;
    let owner = url.searchParams.get('owner');
    let level = url.searchParams.get('level');
    data = await GetDialog({ name: name, owner: owner, level:level });

    let response = new Response(JSON.stringify({ data }));
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;

  } else if (lesson) {
    let owner = url.searchParams.get('owner');
    let operator = lesson;
    
    let { data, lang, level, levels } = await GetLesson({
      owner: owner,
      operator: operator,
    });
    let response = new Response(JSON.stringify({ data, lang, level, levels }));
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;

  } else if (listen) {
    let name = url.searchParams.get('listen');
    let owner = url.searchParams.get('owner');
    let lang = url.searchParams.get('lang');
    data = await GetListen({name: name, owner: owner ,lang:lang});
    
    let response = new Response(JSON.stringify({ data }));
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;
  }
  let response = new Response(JSON.stringify({ data }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch }) {
  let resp;
  const { par } = await request.json();
  const q = par;

  switch (q.func) {
    case 'quiz_users':
      resp = await BroadcastQuizUsers(q);
      break;
    case 'get_subscribers':
      resp = await GetDialog({ name: q.quiz, owner: q.abonent, level: q.level });
      resp = resp.subscribe;
      break;
  }

  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}

async function BroadcastQuizUsers(q) {
  let qu = await UpdateQuizUsers(q);
  let remAr = [{ quiz_users: qu }];

  for (let operator in global.rtcPool['operator'][q.abonent]) {
    if (operator === q.operator && q.status === 'inactive')
      //not to send to yourself
      continue;

    if (global.rtcPool['operator'][q.abonent][operator].resolve)
      global.rtcPool['operator'][q.abonent][operator].resolve(remAr);
  }

  return remAr;
}
