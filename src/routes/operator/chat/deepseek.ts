import OpenAI from "openai";
import { config } from 'dotenv';
import { GetPrompt } from '../../../lib/server/db';

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

type GenerateResponse = string | undefined;

let prompt: Prompt | undefined; // Store the Prompt object

let openai: OpenAI;

let system_messages: Array<{ role: "system" ; content: string }> = []


export default async function generate_from_text_input(params: GenerateParams): Promise<GenerateResponse> {
  // Fetch the prompt if not already fetched
  if (params.prompt.type === 'greeting') {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DeepSeek API key is missing in environment variables');
    }

    // Initialize OpenAI client with DeepSeek's base URL
    openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
    });

    const result = await GetPrompt(`${params.prompt.quiz}.${params.prompt.type}.${params.prompt.lang}`);

    // Check if the result contains an error
    if (result.error) {
      throw new Error(result.error);
    }

    // Ensure the result contains the required Prompt object
    if (!result.prompt || !result.prompt.system || !result.prompt.user) {
      throw new Error('Failed to fetch valid prompt from GetPrompt');
    }

    prompt = result.prompt; // Assign the fetched prompt 


    // Replace placeholders in the system prompt
    const finalSystemPrompt = prompt.system
      .replace(/\${llang}/g, params.llang)
      .replace(/\${lang}/g, params.lang)
      .replace(/\${level}/g, params.level)
      .replace(/\${theme}/g, params.theme || 'general conversation'); // Default theme if not provided

    // Prepare the messages array
    system_messages = [
      { role: "system", content: finalSystemPrompt }, // System prompt
    ];

    // Generate completion using DeepSeek's API
    // const completion = await openai.chat.completions.create({
    //   messages: system_messages,
    //   model: "deepseek-chat",
    // });

    return prompt.user;
  }

  // Validate required properties
  if (!params.level) {
    throw new Error('Missing required property: level');
  }

  try {
    // Prepare the messages array

    const messages: Array<{ role:  "user" | "system" |"assistant"; content: string }> = 
        system_messages
    

        // Add conversation history if provided
    if (params.conversationHistory) {
        messages.push(...params.conversationHistory);
    }

    // Generate completion using DeepSeek's API
    const completion = await openai.chat.completions.create({
      messages:messages,
      model: "deepseek-chat",
    });

    // Return the generated response
    return completion.choices[0].message.content;

  } catch (error) {
    console.error('Error generating response from DeepSeek API:', error);
    throw new Error('Failed to generate response from DeepSeek API');
  }
}