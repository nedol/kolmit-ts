import { msg } from '$lib/js/stores.js';

// const token = 'CPkJ1MYWC7DMlvw6MvtV0yBw';
const headers = {
  'Content-Type': 'application/json',
  // Authorization: `Bearer ${token}`
};

export class SignalingChannel {
  constructor(operator) {
    this.msg = msg;
    this.operator = operator;

let socketUrl;

if (window.location.hostname === 'localhost') {
  socketUrl = 'ws://localhost:3000';
} else {
  socketUrl = 'wss://kolmit-server.onrender.com';
}

this.socket = new WebSocket(socketUrl);

    // Обработка события при открытии соединения
    https: this.socket.onopen = () => {
      console.log('WebSocket соединение установлено');
    };

    // Обработка сообщений от WebSocket сервера

    // Обработка закрытия соединения
    this.socket.onclose = () => {
      console.log('WebSocket соединение закрыто');
    };

    // Обработка ошибок
    this.socket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };
  }

  async SendMessage(par, cb) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.onmessage = (event) => {
        console.log('Получено сообщение:', event.data);
        if (cb) cb(JSON.parse(event.data));
        this.msg.set(JSON.parse(event.data));
      };
      this.socket.send(JSON.stringify({ par }));
      par = '';
    } else {
      console.log('Соединение с WebSocket не установлено');
    }
  }
}
