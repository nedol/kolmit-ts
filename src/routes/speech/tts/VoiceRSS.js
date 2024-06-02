const keyAPI = '7a4b7dd989dd4086a626f34dbf21d3a9';

export function Speak(text) {
	text = text.replace(/<[^>]+>|[*]/g, '');
	text = text.replace(/\.\.\./g, ' . .');
	// const textAr = text.split(/<[^>]+>.*?<\/[^>]+>/g);
	// textAr.map((text) => {

	const audio = new Audio(
		`http://api.voicerss.org/?key=7a4b7dd989dd4086a626f34dbf21d3a9&hl=nl-be&r=-3&c=MP3&f=44khz_16bit_mono&src=${text}`
	);

	audio.play();

	// VoiceRSS.speech({
	// 	key: keyAPI,
	// 	src: text,
	// 	hl: 'nl-be',
	// 	v: 'Daan',
	// 	r: '-3',
	// 	c: 'mp3',
	// 	f: '44khz_16bit_mono',
	// 	ssml: false
	// });
	// });
}
