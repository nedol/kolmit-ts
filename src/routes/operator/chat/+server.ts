import { json } from '@sveltejs/kit';
import generate_from_text_input from './deepseek'; // Импортируем функцию

export async function POST({ request }) {
  try {
    // Получаем данные из запроса
    const { params} = await request.json();

    // Вызываем функцию generate_from_text_input с текстом вопроса
    const response = await generate_from_text_input(params);

    // Возвращаем ответ от DeepSeek API
    return json({ res: response });

  } catch (error) {
    console.error('Ошибка сервера:', error);

    // Возвращаем ошибку клиенту
    return json({ error: 'Ошибка при обработке запроса' }, { status: 500 });
  }
}