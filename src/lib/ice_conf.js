export let ice_conf = {
  stun: [
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
  turn: [
    {
      urls: "turn:18.195.84.86:3478?transport=tcp",
      username: 'kolmit',
      credential: import.meta.env.VITE_TURN_CREDENTIAL, // Используем import.meta.env
    },
    {
      urls: "turn:18.195.84.86:3478?transport=udp",
      username: 'kolmit',
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    }
  ],
  lifetimeDuration: '86400s',
};
