import { json } from '@sveltejs/kit';
import fs from 'fs';

import generate_news from './cron/cron_tasks.js'

import cron from 'node-cron';


import {
	UpdateDialog,
	UpdateLesson,
	UpdateListen,
	UpdateWords,
	GetGroups,
	GetPrompt
  
  } from '$lib/server/db.admin.js';



// Пример cron-задачи, которая запускается каждый день в полночь
cron.schedule('26 21 * * 7', () => {
	/* 
	0 — минуты (0-я минута часа)
	0 — час (полночь)
	* — день месяца (каждый день)
	* — месяц (каждый месяц)
	* — день недели (каждый день недели)
	* 
	* Каждые 5 минут: *\/5 * * * *
	  Каждую субботу в полдень: 0 12 * * 6
	  Каждый час: 0 * * * *
  */
	const now = new Date();
	const formattedDateTime =
	  now.getFullYear() +
	  '-' +
	  String(now.getMonth() + 1).padStart(2, '0') +
	  '-' +
	  String(now.getDate()).padStart(2, '0') +
	  ' ' +
	  String(now.getHours()).padStart(2, '0') +
	  ':' +
	  String(now.getMinutes()).padStart(2, '0');
  
	console.log('Задача выполняется в 21 часа 30 минут.', formattedDateTime);
	// Здесь можно вызвать нужные функции или выполнить операции

  });

  
	// generate_news()



export async function GET({ url, fetch, cookies }) {
    let resp;
    const prompt = url.searchParams.get('prompt');
    const quiz_name = url.searchParams.get('quiz_name');
	const quiz_level = url.searchParams.get('prompt_level');
	const quiz_owner = url.searchParams.get('prompt_owner');
	const quiz_theme = url.searchParams.get('prompt_theme');
	
  if (prompt) {
   resp = await GetPrompt(prompt, quiz_name,quiz_owner, quiz_level);
  }

	let response = new Response(JSON.stringify({ resp } ));
    return response;

}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch }) {
	let resp;

	const { func, owner, psw, level, levels, name, new_name, data, lang } = await request.json();

	switch (func) {

		case 'get_classes':
			resp = GetGroups({ owner, psw, lang });

		case 'upd_lesson':
			resp = UpdateLesson({ owner, level, levels, data, lang });
			break;
	}
	
	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}

