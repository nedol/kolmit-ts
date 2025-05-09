
import {
	UpdateLesson,
	GetGroups,
	GetPrompt
  
  } from '$lib/server/db.admin.ts';



export async function GET({ url, fetch, cookies }) {
    let resp;
    const prompt = url.searchParams.get('prompt');
    const quiz_name = url.searchParams.get('quiz_name');
	const quiz_level = url.searchParams.get('prompt_level');
	const quiz_owner = url.searchParams.get('prompt_owner');
	
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

