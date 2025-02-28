import { json } from '@sveltejs/kit';
import fs from 'fs';
// import { path } from '$lib/js/server.path.js';
import {
  GetLesson,
  GetDialog,
  GetDict,
  GetWords,
  GetBricks,
  UpdateQuizUsers,
} from '$lib/server/db.ts';
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
  const bricks = url.searchParams.get('bricks');
  const lesson = url.searchParams.get('lesson');
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
  }else if (words) {
  const theme = url.searchParams.get('theme');
  const name = url.searchParams.get('name');
  const owner = url.searchParams.get('owner');
  const level = url.searchParams.get('level');
  data = await GetWords({
    theme: theme,
    name: name,
    owner: owner,
    level: level,
  });

  let response = new Response(JSON.stringify({ data }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
  }else if (bricks) {
    const theme = url.searchParams.get('theme');
    const name = bricks;
    const owner = url.searchParams.get('owner');
    const level = url.searchParams.get('level');
    data = await GetBricks({
      theme: theme,
      name: name,
      owner: owner,
      level: level,
    });

    let response = new Response(JSON.stringify({ data }));
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;
  } else if (dialog) {
    let name = dialog;
    let owner = url.searchParams.get('owner');
    let level = url.searchParams.get('level');
    data = await GetDialog({ name: name, owner: owner, level: level });

    let response = new Response(JSON.stringify({ data }));
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;

  } else if (lesson) {
    let owner = url.searchParams.get('owner');
    let operator = lesson;

    const obj = await GetLesson({
      owner: owner,
      operator: operator,
      level: lvl
    });
    // console.log(data)
    let response = new Response(JSON.stringify(obj));
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
      if (q.type === 'dialog') {
        const dlg = await GetDialog({
          name: q.quiz,
          owner: q.abonent,
          level: q.level,
        });
        if (dlg.subscribe?.length > 0)
          resp = {
            [q.type]: { quiz: dlg.dialog?.name, subscribers: dlg.subscribe },
          };
      } else if (q.type === 'word') {
        const dlg = await GetWords({
          name: q.quiz,
          owner: q.abonent,
          level: q.level,
        });
        if (dlg.subscribe?.length > 0)
          resp = {
            [q.type]: { quiz: dlg.dialog?.name, subscribers: dlg.subscribe },
          };
      }
      break;
  }

  let response = new Response(JSON.stringify({ resp }));
  response.headers.append('Access-Control-Allow-Origin', `*`);
  return response;
}

async function BroadcastQuizUsers(q) {
  let qu = await UpdateQuizUsers(q);

  let remAr = [q];

  for (let operator in global.rtcPool['operator'][q.abonent]) {
    if (operator === q.rem || operator === q.add)
      //not to send to yourself
      continue;

    if (global.rtcPool['operator'][q.abonent][operator].resolve)
      global.rtcPool['operator'][q.abonent][operator].resolve(remAr);
  }

  return remAr;
}
// 