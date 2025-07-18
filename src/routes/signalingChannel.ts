import { msg } from '$lib/stores.ts';


export class SignalingChannel {
  constructor(operator) {
    this.msg = msg;
    this.operator = operator;
    this.isOpen = false;

    this.socketUrl = '';
    // this.socketUrl = 'wss://kolmit.net:3000';
    if(window.location.hostname.includes('localhost'))
      this.socketUrl =  `ws://localhost:3000`;

    // if(window.location.hostname.includes('192.168.'))
    //   this.socketUrl = `wss://192.168.0.6:3000`;
    
    if(window.location.hostname.includes('onrender'))
      this.socketUrl = 'wss://kolmit-server.onrender.com';//!! работает на render


    // else
    //   this.socketUrl =  `wss://3.125.91.221:3000`;
      

    this.socket = null;
    this.messageQueue = [];
    this.heartbeatInterval = null; // Таймер для пинга
    this.initializeWebSocket();
    this.status = "inactive";
  }

  initializeWebSocket(reconnectAttempt = 1) {
    if (this.isOpen) return; // Если уже открыто, не создаем новое соединение

    console.log('Инициализация WebSocket...');
    this.socket = new WebSocket(this.socketUrl);
    this.isOpen = false;


    this.socket.onopen = () => {
      console.log('WebSocket соединение установлено');
      this.isOpen = true;
      reconnectAttempt = 1; 
      this.processQueue();
      // this.startHeartbeat();
    };

    this.socket.onmessage = (event) => {
      console.log('Получено сообщение:', event.data);
      const data = JSON.parse(event.data);
      if (this.callback) this.callback(data);
      setTimeout(() => { this.msg.set(data); }, 10);
    };

    this.socket.onclose = () => {
      console.log('WebSocket соединение закрыто');
      this.isOpen = false;
      const delay = Math.min(1000 * reconnectAttempt, 30000);
      setTimeout(() => this.initializeWebSocket(reconnectAttempt + 1), 30000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };
  }
  startHeartbeat() {
    // return;
    this.stopHeartbeat(); // Убедитесь, что старый таймер остановлен
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping',operator:this.operator,status:this.status }));
        console.log('Пинг отправлен на сервер');
      }
    }, 5000); // Отправляем пинг каждые 5 секунд
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

async SendMessage(par, cb) {
  try {
    this.status = par.status;

    // Если соединение открыто — отправляем сразу
    if (this.isSocketReady()) {
      this.callback = cb;
      this.socket.send(JSON.stringify({ par }));
      return;
    }

    // Добавляем в очередь вместе с callback
    console.log('Соединение не готово, добавление в очередь');
    this.messageQueue.push({ par, cb });

    // Пытаемся переподключиться, если не в процессе соединения
    if (!this.isSocketConnecting()) {
      console.log('Попытка переподключения...');
      this.initializeWebSocket();
    }

    // Обработка специальных статусов
    if (par.status === 'close') {
      this.closeConnection();
    } else if (par.status === 'open') {
      this.initializeWebSocket();
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    this.initializeWebSocket();
  }
}

  // Вспомогательные методы для проверки состояния сокета
  isSocketReady() {
      return this.socket && this.socket.readyState === WebSocket.OPEN && this.isOpen;
  }

  isSocketConnecting() {
      return this.socket && this.socket.readyState === WebSocket.CONNECTING;
  }

  closeConnection() {
    this.isOpen = false;
    this.stopHeartbeat(); // Остановка пинга при закрытии соединения
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
      const { par, cb } = this.messageQueue.shift();
      if (cb) this.callback = cb;
      this.socket.send(JSON.stringify({ par }));
      console.log('Сообщение отправлено из очереди:', par);
    }
  }

}
