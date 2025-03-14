import OpenAI from "openai";
import { config } from 'dotenv';
import { GetPrompt,GetTodayTotalTokens,UpdateLastSession } from '../../../lib/server/db';

// Load environment variables
config();

// Typing for TypeScript (assuming Prompt is defined in db.ts)
interface Prompt {
  system: string;
  user: string;
}

// Define the structure of the params object
interface GenerateParams {
  prompt: { quiz: string, type: string, lang: string };
  text: string; // User input text
  context?: string; // Optional context for the prompt
  level: string; // Level for the prompt (e.g., A1, B2, C1)
  lang?: string; // Optional language (default to 'nl' if not provided)
  llang?:string;
  theme?: string; // Optional theme for the conversation
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>; // Optional conversation history
}

type GenerateResponse = string | object | undefined;

let prompt: Prompt | undefined; // Store the Prompt object

let openai: OpenAI;

let system_messages: Array<{ role: "system" ; content: string }> = []

let total_tokens: number | null = 0;


export default async function generate_from_text_input(params: GenerateParams): Promise<GenerateResponse> {
  if (params.prompt.type === 'greeting') {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DeepSeek API key is missing in environment variables');
    }

    openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
    });

    const result = await GetPrompt(`${params.prompt.quiz}.${params.prompt.type}.${params.prompt.lang}`);

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.prompt || !result.prompt.system || !result.prompt.user) {
      throw new Error('Failed to fetch valid prompt from GetPrompt');
    }

    prompt = result.prompt; 

    total_tokens = await GetTodayTotalTokens();

    if(total_tokens>50000){
      return {"tokens_limit":"50000","total_tokens":total_tokens};
    }

    const finalSystemPrompt = prompt.system
      .replace(/\${llang}/g, params.llang)
      .replace(/\${lang}/g, params.lang)
      .replace(/\${level}/g, params.level)
      .replace(/\${theme}/g, params.theme || 'general conversation');

    system_messages = [{ role: "system", content: finalSystemPrompt }];

    // UpdateLastSession(20);

    return prompt.user;
  }

  if (!params.level) {
    throw new Error('Missing required property: level');
  }

  try {
    let messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = 
      [...system_messages];

    if (params.conversationHistory) {
      // Оставляем только последние 2 сообщения от user и assistant
      const filteredHistory = params.conversationHistory
        .filter(msg => msg.role === "user" || msg.role === "assistant")
        .slice(-4);
      
      messages = [...system_messages, ...filteredHistory];
    }

    total_tokens = await GetTodayTotalTokens();

    if(total_tokens>20000){
      return {"tokens_limit":"20000","total_tokens":total_tokens};
    }

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "deepseek-chat",
    });

    total_tokens += completion.usage.total_tokens;

    UpdateLastSession(total_tokens);

    return completion.choices[0].message.content;

  } catch (error) {
    console.error('Error generating response from DeepSeek API:', error);
    throw new Error('Failed to generate response from DeepSeek API');
  }
}
