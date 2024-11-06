import { json } from '@sveltejs/kit';
import fs from 'fs';

import { CreateContent } from '$lib/server/ai.js';

import {
	GetPrompt
} from '$lib/server/db.admin.js';


export async function GET({ url, fetch, cookies }) {
  let resp;

  	let response = new Response(JSON.stringify({ resp }));
    response.headers.append('Access-Control-Allow-Origin', `*`);
    return response;

}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url, fetch }) {
	let resp;

	const req = await request.json();

	switch (req.func) {
		case 'create_content':
			req.prompt = await GetPrompt('dialog');
			req.prompt.system  = req.prompt.system.replaceAll('${$llang}', req.llang);
          req.prompt.system = req.prompt.system.replaceAll('${name[$llang]}', req.name);
          req.prompt.system  = req.prompt.system.replaceAll('${$langs}', req.langs);
          if (req.html)
            req.prompt.system  = req.prompt.system.replaceAll('${dialog_data.html}', req.html);
          if (req.level)
            req.prompt.system  = req.prompt.system .replaceAll('${data.level}', req.level);
          req.prompt.system  = req.prompt.system .replaceAll('${num}', req.num);
          if (req.words)
            req.prompt.system  = req.prompt.system .replaceAll(
              '${dialog_data_words}',
              req.words
        );
      console.log(req.prompt.system);
			resp = await CreateContent(req);

	}
	
	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}


