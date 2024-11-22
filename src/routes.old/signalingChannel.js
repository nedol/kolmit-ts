import { msg } from '$lib/js/stores.js';

const headers = {
  'Content-Type': 'application/json',
};

export class SignalingChannel {
  constructor(operator) {
    this.msg = msg;
    this.operator = operator;
    this.isOpen = false;
    this.socketUrl = //'wss://kolmit-server.onrender.com';
    window.location.hostname === 'localhost'
      ? 'ws://localhost:3000'
      : 'wss://kolmit-server.onrender.com';
    this.socket = null;
    this.messageQueue = [];
    this.initializeWebSocket();
  }

  initializeWebSocket() {
    this.socket = new WebSocket(this.socketUrl);
    this.isOpen = true;

    this.socket.onopen = () => {
      console.log('WebSocket соединение установлено');

      this.processQueue();
    };

    this.socket.onmessage = (event) => {
      console.log('Получено сообщение:', event.data);
      const data = JSON.parse(event.data);
      if (this.callback) this.callback(data);
      setTimeout(() => {    this.msg.set(data) },10)
  
    };

    this.socket.onclose = () => {
      console.log('WebSocket соединение закрыто');
      if (this.isOpen) setTimeout(() => this.initializeWebSocket(), 1000); // Попытка переподключения через 3 секунды
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };
  }

  SendMessage(par, cb) {
    this.callback = cb;

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ par }));
    } else {
      console.log(
        'Соединение с WebSocket не установлено, добавление сообщения в очередь'
      );
      this.messageQueue.push(par);
      if (!this.socket || this.socket.readyState >= WebSocket.CLOSING) {
        this.initializeWebSocket();
      }
    }

    if (par.status === 'close') {
      this.closeConnection();
    } else if (par.status === 'open' && !this.isOpen) {
      this.initializeWebSocket();
    }
  }

  closeConnection() {
    this.isOpen = false;
    if (this.socket && this.socket.readyState !== 0) {
      this.socket.close();
    }
  }

  processQueue() {
    while (
      this.messageQueue.length > 0 &&
      this.socket &&
      this.socket.readyState === WebSocket.OPEN
    ) {
      const par = this.messageQueue.shift();
      this.socket.send(JSON.stringify({ par }));
    }
  }
}
