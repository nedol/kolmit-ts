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

    this.socketUrl;

    if (window.location.hostname === 'localhost') {
      this.socketUrl = 'ws://localhost:3000';
    } else
    this.socketUrl = 'wss://kolmit-server.onrender.com';

    this.socket = new WebSocket(this.socketUrl);

    // Обработка события при открытии соединения
    https: this.socket.onopen = () => {
      console.log('WebSocket соединение установлено');
    };

    // Обработка сообщений от WebSocket сервера

    // Обработка закрытия соединения
    this.socket.onclose = () => {
      console.log('WebSocket соединение закрыто');
      this.socket = ''
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
      this.socket = new WebSocket(this.socketUrl);
      // Обработка события при открытии соединения
      this.socket.onopen = () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          console.log('WebSocket соединение установлено');
          this.SendMessage(par, cb);
        }
      };
    }
  }
}
