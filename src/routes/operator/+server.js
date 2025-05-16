import { json } from '@sveltejs/kit';
import {SetRate } from '$lib/server/db.ts'; //src\lib\server\server.db.ts



/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { par } = await event.request.json();
	const q = par;
	let resp;

	switch (q.func) {
	
		case 'set_rate':
	
			try{
				SetRate(par);
			}catch(ex){
				console.error('Error in SetRate:', ex); // More detailed error logging
			}
		
		break;
	}

	let response = new Response(JSON.stringify({ resp }));
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
}


