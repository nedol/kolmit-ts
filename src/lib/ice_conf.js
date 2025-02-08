export let ice_conf = {
  stun: [
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
  turn: [
    {
      urls: 'turn:relay1.expressturn.com:3478?transport=tcp',
      username: 'ef0ZUU5G66E1O9IV3Z',
      credential: 'jE9btE3On6i5nLz0',
    },
    {
      urls: 'turn:kolmit-server.onrender.com:3000?transport=udp',
      username: 'username',
      credential: 'password',
    },
    {
      urls: 'turn:kolmit-server.onrender.com:3000?transport=tcp',
      username: 'username',
      credential: 'password',
    },
  ],
  lifetimeDuration: '86400s',
};
