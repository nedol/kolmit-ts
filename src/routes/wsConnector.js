'use strict';

export default class wsConnector {
	constructor(url) {
		this.url = url;
		this.websocket = null;
		this.reconnectInterval = 5000; // Интервал переподключения в мс
		this.keepAliveInterval = 10000; // Интервал keep-alive сообщений
		this.keepAliveTimer = null;
		this.connect();
	}

	connect() {
		this.websocket = new WebSocket(this.url);

		this.websocket.onopen = () => {
			console.log('WebSocket connection established');
			this.onOpen();
		};

		this.websocket.onerror = (error) => {
			console.error('WebSocket error observed:', error);
		};

		this.websocket.onclose = (event) => {
			console.log('WebSocket is closed now:', event);
			this.onClose();
			setTimeout(() => this.connect(), this.reconnectInterval);
		};

		this.websocket.onmessage = (event) => {
			this.onMessage(JSON.parse(event.data));
		};
	}

	onOpen() {
		this.startKeepAlive();
	}

	onClose() {
		this.stopKeepAlive();
	}

	onMessage(data) {
		console.log('Message from server ', data);
		// Обработка входящего сообщения
	}

	sendMessage(message) {
		if (this.websocket.readyState === WebSocket.OPEN) {
			this.websocket.send(JSON.stringify(message));
		} else {
			console.error('WebSocket is not open. Message not sent.');
		}
	}

	startKeepAlive() {
		if (this.keepAliveTimer) {
			clearInterval(this.keepAliveTimer);
		}
		this.keepAliveTimer = setInterval(() => {
			if (this.websocket.readyState === WebSocket.OPEN) {
				this.sendMessage({ type: 'keepalive' });
			}
		}, this.keepAliveInterval);
	}

	stopKeepAlive() {
		if (this.keepAliveTimer) {
			clearInterval(this.keepAliveTimer);
			this.keepAliveTimer = null;
		}
	}
}
