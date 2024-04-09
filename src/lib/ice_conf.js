export let ice_conf = {
	stun: [
		{ urls: 'stun:stun1.l.google.com:19302' },
		{ urls: 'stun:stun2.l.google.com:19302' },
		{ urls: 'stun:stun3.l.google.com:19302' },
		{ urls: 'stun:stun4.l.google.com:19302' }
	],
	turn: [
		{
			urls: 'turn:relay1.expressturn.com:3478?transport=tcp',
			username: 'ef5N75GPIIOV97AS3J',
			credential: 'sIWl6OqxV67ZogkM'
		}
	],
	lifetimeDuration: '86400s'
};
