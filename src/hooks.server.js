import { WebSocketServer } from 'ws';

let wss; // Храним WebSocket сервер здесь

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Проверяем, запущен ли WebSocket сервер
  if (!wss && event.locals.httpServer) {
    console.log('Запуск WebSocket сервера...');

    // Передаем существующий HTTP сервер
    wss = new WebSocketServer({ server: event.locals.httpServer });

    wss.on('connection', (ws) => {
      console.log('Новое WebSocket соединение');

      ws.on('message', (message) => {
        console.log(`Получено сообщение: ${message}`);
        ws.send(`Echo: ${message}`); // Отправляем сообщение обратно
      });

      ws.on('close', () => {
        console.log('WebSocket соединение закрыто');
      });
    });
  }

  const response = await resolve(event); // Продолжаем обработку запроса
  return response;
}
