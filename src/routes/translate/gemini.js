import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from 'dotenv';
import {
  GetQuizContext,
  GetPrompt,
  GetTodayTotalTokens,
  UpdateLastSession,
  UpdateOperator,
  GetSTT,
  GetGrammar,
  SaveChat
} from '../db.chat.js';

config();

let total_tokens = 0;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export default async function Translate_prompt(params) {

  if (params.prompt.includes('translate')) {
    return translate(params); // If 'chat' is present without 'check'
  }
}


async function translate(params){

  params._retries = params._retries || 0;

  if (params._retries > 2) {
    return '⚠️ Много неудачных попыток. Ответ не соответствует формату.';
  }

  saveLastUserMessage(params);  


  let message = {
    "system_instruction": {
      "role": "system",
      "parts": [

      ]
    },
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text":"Hi"
          }
        ]
      },
    ]
  }

  
  const prompt = await GetPrompt(params.prompt);
  if (prompt.error) return prompt.error;
  if (params.conversationHistory.length === 0 && params.prompt.includes('chat.basic')) {
    return prompt.prompt.user;
  }
  if (!prompt.prompt?.system) {
    return 'Failed to fetch valid prompt from GetPrompt';
  }

  const grammar = await GetGrammar({ level: params.lvl });

  const finalSystemPrompt =  prompt.prompt.system
    .replaceAll(/\${errors}/g, params.errors || '')
    .replaceAll(/\${content}/g, params.content || '')
    .replaceAll(/\${llang}/g, params.llang || '')
    .replaceAll(/\${langs}/g, params.langs || 'nl')
    .replaceAll(/\${level}/g, params.level)
    .replaceAll(/\${lvl}/g, params.lvl)
    .replaceAll(/\${type}/g, params.type)
    .replaceAll(/\${grammar}/g, grammar?.map((item) => item.rule_name))
    .replaceAll(/\${words}/g, params.words)
    .replaceAll(/<context>([\s\S]*?)<\/context>/g,`<context>${JSON.stringify(params.context).replace(/<[^>]*>/g, '')}</context>`)
    .replaceAll(/\${theme}/g, params.name || 'general conversation');

    message.system_instruction =  { role: 'system', parts: [{text:`${finalSystemPrompt}`}] };

  if (params.conversationHistory?.length) {
    const filtered = params.conversationHistory.map(({ role, content }) => ({
      role,
      parts: [{text:content}]
    }));
    message.contents.push(...filtered);
  }

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout after 10 seconds')), 30000)
    );

    const geminiCall = model.generateContent( message );

    const result = await Promise.race([geminiCall, timeoutPromise]);

    const response = await result.response;
    const content = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content returned from Gemini.');
    }

    const cleanedContent = content.replace(/<\s*think\s*>.*?<\s*\/think\s*>/gsi, '');
    console.log("Cleaned content:", cleanedContent);

    const validation = validatePromptOutput(cleanedContent, params.llang, params.langs);

    if (!validation.valid) {
      console.warn("⛔ Нарушения:", validation.errors);
      params.content = cleanedContent
      params.errors = validation.errors.join(', ');
      params._retries += 1;
      return await Chat(params); // fallback
    }

    const res = splitText(cleanedContent, params.llang, params.langs);

    if (res.lvl) {
      await UpdateOperator({ operator: params.user_id, level: res.lvl });
    }

    await UpdateLastSession(params.user_id, total_tokens);

    console.log('OpenRouter output message:', JSON.stringify(message));

    return cleanedContent;

  } catch (error) {
    console.error('Error in Gemini call:', error);
    return 'Ошибка при получении ответа: ' + error.message;
  }
}

async function saveLastUserMessage(data) {
  for (let i = data.conversationHistory.length - 1; i >= 0; i--) {
    if (data.conversationHistory[i].role === "user") {
      if (i > 0) await SaveChat(data.user_id, data.conversationHistory[i - 1]);
      await SaveChat(data.user_id, data.conversationHistory[i]);
      break;
    }
  }
}

function validatePromptOutput(output, llang, langs) {
  const errors = [];

  // Проверка наличия правильных языковых блоков
  const llangRegex = new RegExp(`<${llang}>[\\s\\S]*?<\\/${llang}>`);
  const langsRegex = new RegExp(`<${langs}>[\\s\\S]*?<\\/${langs}>`);
  
  const llangMatch = output.match(llangRegex);
  const langsMatch = output.match(langsRegex);

  if (!llangMatch) {
    errors.push(`❌ Блок <${llang}> не найден.`);
  }
  if (!langsMatch) {
    errors.push(`❌ Блок <${langs}> не найден.`);
  }

  if (llangMatch && langsMatch) {
    if (output.indexOf(`<${llang}>`) > output.indexOf(`<${langs}>`)) {
      errors.push(`❌ Блок <${llang}> должен идти перед <${langs}>.`);
    }
  }

  const checkTagsIn = (block, label) => {
    const tags = {
      msg: /<msg>[\s\S]*?<\/msg>/,
      reply: /<reply(?:\s+lang=\w+)?>[\s\S]*?<\/reply>/g,
      words: /<words>[\s\S]*?<\/words>/,
      stt: /<stt>[\s\S]*?<\/stt>/,
      sym: /<sym>[\s\S]*?<\/sym>/,
    };

    if (!tags.msg.test(block)) {
      errors.push(`❌ Отсутствует тег <msg> в блоке ${label}.`);
    }
    if (!tags.words.test(block)) {
      errors.push(`❌ Отсутствует тег <words> в блоке ${label}.`);
    }
    if (!tags.stt.test(block)) {
      errors.push(`❌ Отсутствует тег <stt> в блоке ${label}.`);
    }
    if (!tags.sym.test(block)) {
      //errors.push(`❌ Отсутствует тег <sym> в блоке ${label}.`);
    }

    const replyMatches = block.match(tags.reply) || [];
    if (replyMatches.length < 3) {
      errors.push(`❌ В блоке ${label} должно быть как минимум три <reply>! Сейчас найдено: ${replyMatches.length}`);
    }
  };

  if (llangMatch) checkTagsIn(llangMatch[0], llang);
  if (langsMatch) checkTagsIn(langsMatch[0], langs);

  // Проверка совпадения <reply> между блоками
  // if (llangMatch && langsMatch) {
  //   const repliesLlang = llangMatch[0].match(/<reply(?:\s+lang=\w+)?>[\s\S]*?<\/reply>/g) || [];
  //   const repliesLangs = langsMatch[0].match(/<reply(?:\s+lang=\w+)?>[\s\S]*?<\/reply>/g) || [];

  //   repliesLlang.forEach((reply, idx) => {
  //     const contentLlang = reply.replace(/<reply(?:\s+lang=\w+)?>|<\/reply>/g, '').trim();
  //     const contentLangs = (repliesLangs[idx] || '').replace(/<reply(?:\s+lang=\w+)?>|<\/reply>/g, '').trim();
  //     if (contentLlang !== contentLangs) {
  //       errors.push(`❌ <reply> №${idx + 1} в <${langs}> не совпадает с <${llang}>.`);
  //     }
  //   });
  //}

  // Проверка отсутствия "например" и "bijvoorbeeld" в <msg>
  const msgs = output.match(/<msg>[\s\S]*?<\/msg>/g) || [];
  msgs.forEach((msg, idx) => {
    if (/bijvoorbeeld|например/i.test(msg)) {
      //errors.push(`❌ <msg> №${idx + 1} содержит запрещённое слово (например / bijvoorbeeld).`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}


function splitText(text, llang, langs) {
  const nlRegex = new RegExp(`<${llang}>([\\s\\S]*?)<\/${llang}>`);
  const ruRegex = new RegExp(`<${langs}>([\\s\\S]*?)<\/${langs}>`);
  const userRegex = /<user>([\s\S]*?)<\/user>/;

  // Глобальные теги (lvl и recom)
  const ulvlRegex = /<lvl>([\s\S]*?)<\/lvl>/;
  const recomRegex = /<recom>([\s\S]*?)<\/recom>/g;

  // Извлечение lvl (только первое вхождение)
  const ulvlMatch = ulvlRegex.exec(text);
  const lvl = ulvlMatch ? ulvlMatch[1].trim() : null;

  // Извлечение ВСЕХ recom (массив)
  const recomMatches = [];
  let currentRecomMatch;
  while ((currentRecomMatch = recomRegex.exec(text)) !== null) {
    recomMatches.push(currentRecomMatch[1].trim());
  }

  // Извлечение содержимого языковых блоков (nl, ru, user)
  const nlMatch = nlRegex.exec(text);
  const nlContent = nlMatch ? nlMatch[1].trim() : null;

  const ruMatch = ruRegex.exec(text);
  const ruContent = ruMatch ? ruMatch[1].trim() : null;

  const uMatch = userRegex.exec(text);
  const uContent = uMatch ? uMatch[1].trim() : null;

  // Функция для извлечения данных из языкового блока (msg, cor, reply, words)
  const extractLangData = (content) => {
    if (!content) return null;

    const corRegex = /<cor>([\s\S]*?)<\/cor>/;
    const msgRegex = /<msg>([\s\S]*?)<\/msg>/;
    const replyRegex = /<reply>([\s\S]*?)<\/reply>/g;
    const wordsRegex = /<words>([\s\S]*?)<\/words>/;

    const corMatch = corRegex.exec(content);
    const msgMatch = msgRegex.exec(content);
    const wordsMatch = wordsRegex.exec(content);

    const replies = [];
    let replyMatch;
    while ((replyMatch = replyRegex.exec(content)) !== null) {
      replies.push(replyMatch[1].trim());
    }

    return {
      cor: corMatch ? corMatch[1].trim() : null,
      msg: msgMatch ? msgMatch[1].trim() : null,
      replies: replies.length > 0 ? replies : null,
      words: wordsMatch ? wordsMatch[1].trim() : null
    };
  };

  return {
    [llang]: nlContent ? extractLangData(nlContent) : null,
    [langs]: ruContent ? extractLangData(ruContent) : null,
    user: uContent ? extractLangData(uContent) : null,
    lvl: lvl,  // lvl на верхнем уровне
    recom: recomMatches.length > 0 ? recomMatches : null  // recom на верхнем уровне
  };
}
