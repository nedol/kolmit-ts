import OpenAI from "openai";
import { config } from 'dotenv';
import { GetQuizContext,GetPrompt,GetTodayTotalTokens,UpdateLastSession,UpdateUserLevel } from '../../../lib/server/db';

// Load environment variables
config();


// Typing for TypeScript (assuming Prompt is defined in db.ts)
interface Prompt {
  system: string;
  user: string;
}

// Define the structure of the params object
interface GenerateParams {
  user_id:string;
  prompt: { quiz: string, type: string, lang: string };
  text: string; // User input text
  context?: string; // Optional context for the prompt
  level: string; // Level for the prompt (e.g., A1, B2, C1)
  lang?: string; // Optional language (default to 'nl' if not provided)
  llang?:string;
  grammar:string[];
  theme?: string; // Optional theme for the conversation
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>; // Optional conversation history
}

type GenerateResponse = string | object | undefined;

let prompt: Prompt | undefined; // Store the Prompt object

let openai: OpenAI;

let system_messages: Array<{ role: "system" ; content: string }> = []

let total_tokens: number | null = 0;


export default async function generate_from_text_input(params: GenerateParams): Promise<GenerateResponse> {

  // return generateFromTextInput(params);
  if (params.prompt.type === 'basic') {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DeepSeek API key is missing in environment variables');
    }

    const res = (params.name && params.type)? await GetQuizContext(params):'';

    openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
    });

    console.log('propmt req:',`${params.prompt.quiz}.${params.prompt.type}.${params.prompt.lang}`)

    const result = await GetPrompt(`chat.basic.${params.prompt.lang}`);

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.prompt || !result.prompt.system || !result.prompt.user) {
      throw new Error('Failed to fetch valid prompt from GetPrompt');
    }

    prompt = result.prompt; 

    total_tokens = await GetTodayTotalTokens(params.user_id);

    if(total_tokens>50000 && params.user_id!='45e487f5af70416e7d46d6a4b00985de'){
      return {"tokens_limit":"50000","total_tokens":total_tokens};
    }

    params.grammar = ['Vroeger...,nu..', 'Toen...']

    const finalSystemPrompt = prompt.system
      .replaceAll(/\${llang}/g, params.llang)
      .replaceAll(/\${lang}/g, params.lang)
      .replaceAll(/\${level}/g, params.level)
      .replaceAll(/\${type}/g, params.type)
      .replaceAll(/\${grammar}/g, params.grammar)
      .replaceAll(/\<context>([\s\S]*?)<\/context>/g, `<context>${res.context}</context>`)
      .replaceAll(/\${theme}/g, params.name || 'general conversation');

    system_messages = [{ role: "system", content: finalSystemPrompt }];

    // console.log(finalSystemPrompt)
    // UpdateLastSession(20);

    // UpdateUserLevel('<user><level>B1.1</level></user>',params.user_id)

    //return prompt.user;
  }

  // if (!params.level) {
  //   throw new Error('Missing required property: level');
  // }

  try {
    let messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = 
      [...system_messages];

    if (params.conversationHistory) {
      // Оставляем только последние 2 сообщения от user и assistant
      const filteredHistory = params.conversationHistory
        .filter(msg => msg.role === "user" || msg.role === "assistant")
        .slice(-2);

      // Удаляем два последних сообщения из params.conversationHistory
      params.conversationHistory.splice(-2);
      
      messages = [...system_messages, ...filteredHistory];
    }

    messages[0].content = messages[0].content.replace(/<dialog>([\s\S]*?)<\/dialog>/, `<dialog>${JSON.stringify(params.conversationHistory)}</dialog>`);
    console.log(messages[0].content)

    total_tokens = await GetTodayTotalTokens(params.user_id);

    if(total_tokens>50000 && params.user_id!='45e487f5af70416e7d46d6a4b00985de'){
      return {"tokens_limit":"50000","total_tokens":total_tokens};
    }


    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "deepseek-chat",
    });

    total_tokens = completion.usage.total_tokens;

    UpdateLastSession(params.user_id,total_tokens);

    // UpdateUserLevel(completion.choices[0].message.content,params.user_id)

    return completion. choices[0].message.content;

  } catch (error) {
    console.error('Error generating response from DeepSeek API:', error);
    throw new Error('Failed to generate response from DeepSeek API');
  }
}

export async function generateFromTextInput(params: GenerateParams): Promise<GenerateResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DeepSeek API key is missing in environment variables');
  }

  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: apiKey,
  });

  if (params.prompt.type === 'basic') {
    // Проверка наличия обязательных параметров
    if (!params.prompt.quiz || !params.prompt.type || !params.prompt.lang) {
      throw new Error('Missing required properties in params.prompt');
    }

    const res = (params.name && params.type) ? await GetQuizContext(params) : '';
    const promptKey = `${params.prompt.quiz}.${params.prompt.type}.${params.prompt.lang}`;
    console.log('Fetching prompt with key:', promptKey);

    const result = await GetPrompt(promptKey);
    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.prompt || !result.prompt.system || !result.prompt.user) {
      throw new Error('Failed to fetch valid prompt from GetPrompt');
    }

    const finalSystemPrompt = result.prompt.system
      .replace(/\${llang}/g, params.llang || '')
      .replace(/\${lang}/g, params.lang || '')
      .replace(/\${level}/g, params.level || '')
      .replace(/\${grammar}/g, params.grammar?.join(', ') || '')
      .replace(/\${context}/g, res.context || '')
      .replace(/\${theme}/g, params.theme || 'general conversation');

    const systemMessages = [{ role: "system", content: finalSystemPrompt }];
    UpdateUserLevel('<user><level>B1.1</level></user>', params.user_id);

    return { content: result.prompt.user };
  }

  if (!params.level) {
    throw new Error('Missing required property: level');
  }

  try {
    const totalTokens = await GetTodayTotalTokens(params.user_id);
    if (totalTokens > 50000 && params.user_id !== '45e487f5af70416e7d46d6a4b00985de') {
      return { tokens_limit: "50000", total_tokens: totalTokens };
    }

    const messages = [...systemMessages];
    if (params.conversationHistory) {
      const filteredHistory = params.conversationHistory
        .filter(msg => msg.role === "user" || msg.role === "assistant")
        .slice(-4);
      messages.push(...filteredHistory);
    }

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "deepseek-chat",
    });

    UpdateLastSession(params.user_id, completion.usage.total_tokens);
    return { content: completion.choices[0].message.content };
  } catch (error) {
    console.error('Error generating response from DeepSeek API:', error);
    throw new Error('Failed to generate response from DeepSeek API');
  }
}
