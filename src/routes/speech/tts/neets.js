import fs from 'fs';

const responsePromise = fetch('https://api.neets.ai/v1/tts', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'X-API-Key': '25f8a30a38f4494c9dfa84f39b182fc0'
	},
	body: JSON.stringify({
		text: 'The quick brown fox jumps over the lazy dog.',
		voice_id: 'us-female-1',
		params: {
			model: 'style-diff-500'
		}
	})
})
	.then((response) => response.arrayBuffer())
	.then((buffer) => {
		fs.writeFileSync('neets_demo.mp3', Buffer.from(buffer));
	});
