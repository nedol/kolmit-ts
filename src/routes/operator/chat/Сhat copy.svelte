<script lang="ts">
  import { onDestroy, getContext, afterUpdate, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { Transloc } from '../../translate/Transloc';
  import { showBottomAppBar, langs, llang, signal } from '$lib/stores';
  import IconButton, { Icon } from '@smui/icon-button';
  import emojiRegex from 'emoji-regex';
  import Badge from '@smui-extra/badge';
  import Tts from '../../speech/tts/Tts.svelte';
  import Stt from '../../speech/stt/Stt.svelte';


  import {
      mdiMicrophoneOutline,
      mdiMicrophone,
      mdiTranslate,
      mdiTranslateOff,
      mdiMicrophoneMessage,
      mdiSendOutline
  } from '@mdi/js';

  // Улучшенные типы
  type MessageRole = 'user' | 'assistant' | 'system';
  type TranslationStatus = {
    isTranslateUser: boolean;
    isTranslateAssistant: boolean;
  };

  interface Message {
    id: string;
    role: MessageRole;
    text: string;
    tr: string;
    cor: string;
    isTranslateUser: boolean;
    isTranslateAssistant: boolean;
  }

  interface AIData {
    level?: string | null;
    cor?: string | null;
    msg?: string | null;
    replies?: string[];
    words?: string | null;
  }

  interface SplitTextResult {
    [key: string]: AIData | null;
    user: AIData | null;
  }

  export let prompt_type = "basic";
  export let quiz = { quiz: '' };
  export let context: string[] = [];

  // Константы для таймеров
  const REMINDER_TIMEOUT = 5 * 60 * 1000; // 5 минут
  const MAX_MESSAGE_HISTORY = 20; // Лимит истории сообщений
  const SCROLL_DELAY = 100;

  let stt: Stt | null = null;
  let tts: Tts | null = null;
  let isListening = false;
  let display_audio = 'none';
  let stt_text = '';
  let isSTT = false;
  let words = 'undefined';
  let userInput = '';
  let elInput: HTMLInputElement;
  
  let messages = writable<Message[]>([]);
  let loading = writable(false);
  let to: NodeJS.Timeout;

  let isTranslateUser = false;
  let isTranslateAssistant = false;
  let isTip = false;

  let translatedMessages = new Map<string, string>();
  let messagesContainer: HTMLElement | null = null;
  let isReply = false;
  let isShowReply = false;
  let dataAr: SplitTextResult = { user: null };

  let operator = getContext('operator');
  let lastMessage: string;
  let lastMessageTime = parseInt(localStorage.getItem('lastMessageTime') ?? '0') || Date.now();
  let reminderTimeout: NodeJS.Timeout | null = null;
  let selectedReplyId: string | null = null;
  let isReminderSent = false;



  onMount(async () => {
    $showBottomAppBar = false;
    sendMessage(`Begin een gesprek in het Nederlands.`);
    startReminderTimer();

    messages.update(msgs => {
      const newMsgs = [
        ...msgs,
        {
          id: crypto.randomUUID(),
          role: "system",
          text: Array.isArray(context) ? context.join(" ") : '',
          tr: '',
          cor: '',
          isTranslateUser: false,
          isTranslateAssistant: false
        }
      ];
      
      // Ограничиваем историю сообщений
      return newMsgs.slice(-MAX_MESSAGE_HISTORY);
    });
  });

  afterUpdate(() => {
    if (elInput) {
      setTimeout(() => {
        elInput.scrollIntoView({ behavior: "smooth", block: "end" });
      }, SCROLL_DELAY);
    }
  });

  async function sendMessage(msg: string = '') {
    if (!userInput.trim() && !msg.trim()) return;

    try {
      if (!msg) {
        messages.update(msgs => {
          const newMsgs = [
            ...msgs,
            {
              id: crypto.randomUUID(),
              role: 'user',
              text: userInput,
              tr: "",
              cor: "",
              isTranslateUser: false,
              isTranslateAssistant: false
            }
          ];
          return newMsgs.slice(-MAX_MESSAGE_HISTORY);
        });
      }

      scrollToLastMessage();
      const userMessage = msg || userInput;
      userInput = '';
      loading.set(true);

      await callChat();
      resetReminderTimer();
    } catch (error) {
      console.error("Error sending message:", error);
      loading.set(false);
    }
  }

  async function callChat() {
    if (to) clearTimeout(to);

    try {
      const conversationHistory = $messages
        .slice(-MAX_MESSAGE_HISTORY)
        .map(msg => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.text,
          tip: msg.role === 'user' ? isTip : '',
          translated: msg.role === 'user' ? isTranslateUser : isTranslateAssistant,
          stt: msg.role === 'user' ? stt_text : ''
        }));

      const params = {
        func: "chat",
        user_id: operator.operator,
        type: quiz?.quiz,
        name: quiz?.name,
        owner: operator.abonent,
        prompt: `chat.${prompt_type}.${$llang}`,
        conversationHistory,
        context: context,
        words: words,
        langs: $langs,
        llang: $llang || 'nl',
        level: "2.1",
        lvl: operator.level,
      };

      console.log('SendMessage', params);
      isTranslateUser = false;
      isTip = false;

      $signal.SendMessage(params, handleData);
    } catch (error) {
      console.error("Error calling chat:", error);
      loading.set(false);
    }
  }

  async function handleData(data: any) {
    try {
      if (data.response?.tokens_limit) {
        const msg = await Transloc("Вы достигли суточного лимита сообщений.", 'ru', $langs, 'chat');
        addMessage({
          role: "assistant",
          text: `<alert>${msg}</alert>`,
          tr: '',
          cor: ''
        });
        return;
      }

      dataAr = splitText(data.response);
      
      if (dataAr[$llang]?.cor) {
        addMessage({
          role: "user",
          text: '',
          tr: dataAr[$langs]?.cor || '',
          cor: dataAr[$llang]?.cor || ''
        });
      }

      if (dataAr[$llang]?.msg) {
        addMessage({
          role: "assistant",
          text: dataAr[$llang].msg || '',
          tr: dataAr[$langs]?.msg || '',
          cor: ''
        });

        if (dataAr[$llang]?.words) {
          words = dataAr[$llang].words || 'undefined';
        }

        tts?.Speak_server($llang, dataAr[$llang].msg || '', '', '');
        isReply = !!dataAr[$llang]?.replies;
      } else {
        throw new Error("Нет ответа.");
      }

      lastMessageTime = Date.now();
      localStorage.setItem('lastMessageTime', lastMessageTime.toString());
    } catch (error) {
      console.error("Error handling data:", error);
      addMessage({
        role: "assistant",
        text: "Ошибка при обработке запроса. Попробуйте снова.",
        tr: "",
        cor: ""
      });
    } finally {
      loading.set(false);
    }
  }

  function splitText(text: string): SplitTextResult {
    const result: SplitTextResult = {
      [$llang]: null,
      [$langs]: null,
      user: null
    };

    const extractData = (content: string): AIData => {
      if (!content) return {};

      const corMatch = content.match(/<cor>([\s\S]*?)<\/cor>/);
      const msgMatch = content.match(/<msg>([\s\S]*?)<\/msg>/);
      const levelMatch = content.match(/<level>([\s\S]*?)<\/level>/);
      const wordsMatch = content.match(/<words>([\s\S]*?)<\/words>/);
      const replies = Array.from(content.matchAll(/<reply>([\s\S]*?)<\/reply>/g)).map(m => m[1].trim());

      return {
        level: levelMatch?.[1].trim() || null,
        cor: corMatch?.[1].trim() || null,
        msg: msgMatch?.[1].trim() || null,
        replies: replies.length ? replies : undefined,
        words: wordsMatch?.[1].trim() || null
      };
    };

    const langRegex = (lang: string) => new RegExp(`<${lang}>([\\s\\S]*?)<\/${lang}>`);
    const userRegex = /<user>([\s\S]*?)<\/user>/;

    const nlMatch = langRegex($llang).exec(text);
    const ruMatch = langRegex($langs).exec(text);
    const uMatch = userRegex.exec(text);

    result[$llang] = nlMatch ? extractData(nlMatch[1].trim()) : null;
    result[$langs] = ruMatch ? extractData(ruMatch[1].trim()) : null;
    result.user = uMatch ? extractData(uMatch[1].trim()) : null;

    return result;
  }

  function addMessage(message: Omit<Message, 'id' | 'isTranslateUser' | 'isTranslateAssistant'>) {
    messages.update(msgs => {
      const newMsgs = [
        ...msgs,
        {
          ...message,
          id: crypto.randomUUID(),
          isTranslateUser: false,
          isTranslateAssistant: false,
          text: message.text 
        }
      ];
      scrollToLastMessage();
      return newMsgs.slice(-MAX_MESSAGE_HISTORY);
    });
  }

  function scrollToLastMessage() {
    setTimeout(() => {
      messagesContainer?.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, SCROLL_DELAY);
  }

  function StopListening() {
    isListening = false;
  }

  function SttResult(text: string) {
    userInput = text[$llang];
    stt_text = text[$llang];
  }

  function onClickMicrophone() {
    if (isListening) {
      stt_text = '';
      stt?.MediaRecorderStop();
      isListening = false;
      return;
    }

    stt_text = '';
    stt?.startAudioMonitoring($llang, $langs);
    isListening = true;
  }

  async function toggleTranslation(message: Message) {
    if (!message.tr) {
      message.tr = await Transloc(message.text, $llang, $langs, '');
    }

    if (message.role !== 'user') {
      translatedMessages.set(message.text, message.tr);
    }

    if (message.role === 'user') {
      message.isTranslateUser = !message.isTranslateUser;
    } else {
      message.isTranslateAssistant = !message.isTranslateAssistant;
    }

    messages.update(msgs => [...msgs]);
    scrollToLastMessage();
  }

  function toggleReply(messageId: string) {
    selectedReplyId = selectedReplyId === messageId ? null : messageId;
    scrollToLastMessage();

    if (isTranslateUser) {
      isTip = true;
    }
  }

  function startReminderTimer() {
    reminderTimeout = setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - lastMessageTime >= REMINDER_TIMEOUT && !isReminderSent) {
        sendMessage(`Blijf praten.`);
        isReminderSent = true;
        stopReminderTimer();
      }
    }, REMINDER_TIMEOUT);
  }

  function stopReminderTimer() {
    if (reminderTimeout) {
      clearTimeout(reminderTimeout);
      reminderTimeout = null;
    }
  }

  function resetReminderTimer() {
    lastMessageTime = Date.now();
    localStorage.setItem('lastMessageTime', lastMessageTime.toString());
    isReminderSent = false;
    stopReminderTimer();
    startReminderTimer();
  }

  function onKeydown(key: string) {
    scrollToLastMessage();
    if (key === 'Enter') {
      sendMessage();
    }
  }

  function SetInput(text: string) {
    userInput = text;
    scrollToLastMessage();
    isTip = true;
  }

  onDestroy(() => {
    if (to) clearTimeout(to);
    stopReminderTimer();
  });
</script>

<Tts bind:this={tts}></Tts>
<div class="chat-container">
  <Stt 
    {SttResult}
    {StopListening}
    bind:display_audio
    bind:this={stt}></Stt>

   
  <div class="messages" bind:this={messagesContainer}>
    
    {#each $messages as message, index (message.id)}
    <div class="message {message.role} {message.role === 'user'}"
      bind:this={lastMessage} >
      <!--strong>{message.role === 'user' ? 'Вы' : 'AI'}:</strong--> 
      {#if message.cor}
        {#if message.isTranslateUser} 
          {#if translatedMessages.has(message.cor)}
            <cor> {@html translatedMessages.get(message.cor)}</cor>
            {:else}
            {#if dataAr[$langs].cor}
              <cor>{@html dataAr[$langs].cor}</cor>
            {:else}
              {#await Transloc(message.cor, $llang, $langs, 'chat') then data}
                <cor> {@html data}</cor>
              {/await}
            {/if}
          {/if}
        {:else}
          <cor> {@html message.cor}</cor>
        {/if}
      {/if}
      
      {#if message.isTranslateUser && translatedMessages.has(message.text)}
        {@html translatedMessages.get(message.text)}
      {:else}
        {@html message.text}
      {/if}
  
      {#if message.role === 'assistant' }
          {#if selectedReplyId === message.id}
            <div class="reply_container">
              {#each dataAr[$llang]?.replies as reply,i}
                {#if message.isTranslateUser} 
                  <reply on:click={()=>{SetInput(dataAr[$llang]?.replies[i]) }}>{reply}</reply>
                {:else}
                {#if dataAr[$langs]?.replies[i]}
                  <reply on:click={()=>{SetInput(reply)}}>{dataAr[$langs]?.replies[i]}</reply>
                {:else}
                  {#await Transloc(reply,$llang, $langs,'chat') then data}
                    <reply on:click={()=>{SetInput(reply)}}>{data}</reply>
                  {/await}
                  {/if} 
                {/if}
              {/each}
            </div>
          {/if}
        {/if}
        <div style="display:flex;justify-content: space-between;">  
          {#if isReply && message.role === 'assistant' && quiz.quiz!=='dialog' }        
            <div on:click={() => toggleReply(message.id)} >
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24" style="scale:1">
                  <path fill="green" d={mdiMicrophoneMessage} />
                </Icon>
              </IconButton>
            </div>
          {/if}          
    
          {#if message.role === 'assistant' || (message.role === 'user' && message.cor)}
            <div on:click={() => toggleTranslation(message )}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24">
                  {#if message.isTranslateUser}
                    <path fill={message.role === 'user'?'red':"currentColor"} d={mdiTranslate} />
                  {:else}
                    <path fill={message.role === 'user'?'red':"currentColor"} d={ mdiTranslateOff} />
                  {/if}
                </Icon>
              </IconButton>
            </div>
          {/if}
      
        </div>    
     
    </div>
  {/each}


  </div>

  <div class="input-container">
    <div style="margin-right:10px">
      <IconButton
        class="material-icons"
        aria-label="Back"
        on:click={onClickMicrophone}
      >
        <Icon tag="svg" viewBox="0 0 24 24">
          {#if isListening}
            <path fill="currentColor" d={mdiMicrophone} />
          {:else}
            <path fill="currentColor" d={mdiMicrophoneOutline} />
          {/if}
        </Icon>
        
        <Badge
        position="middle"
        align="bottom-end - bottom-middle"
        aria-label="unread count"
        style="position:absolute;top:2px;right:-1px;color:black;background-color:lightgrey;scale:.8;letter-spacing: 1.5px;">{$llang}</Badge>

      </IconButton>
    </div>
    {#if $loading}
      {#await Transloc('AI печатает...', 'ru', $langs, 'chat') then data}
      <input disabled
        bind:value={userInput}
        bind:this = {elInput}
        placeholder={data}
        on:keydown={(e) => {onKeydown(e.key)}}
        aria-label="Введите сообщение"
      />
      {/await}
    {:else}
    {#await Transloc('Введите сообщение...', 'ru', $langs, 'chat') then data}
      <input
        bind:value={userInput}
        bind:this = {elInput}
        placeholder={data}
        on:keydown={(e) => {onKeydown(e.key)}}
        aria-label="Введите сообщение"
      />
    {/await}
    {/if}
    <button on:click={()=>{sendMessage()}} disabled={$loading} aria-label="Отправить сообщение">
       <IconButton
        class="material-icons">
        <Icon tag="svg" viewBox="0 0 24 24">
          <path fill="white" d={mdiSendOutline} />
        </Icon>
    </IconButton>
    </button>
  </div>
</div>

<style>
  :global(cor){
    display:block;
    margin: 2px;
    padding:2px;
    color:red;
    border:1px solid;
    border-radius: 5px;
    font-size: small;
    font-weight: bold;
  }

  :global(reply){
    display: block;
    color:green;
    font-size:small;
    font-weight: bold;
  }

  :global(alert) {
    display: block;
    color:red;
    font-size:small;
    font-weight: bold;
  }


  .chat-container {
    display: flex;
    position: absolute;
    top: 50px;
    width: 100%;
    flex-direction: column;
    /* height: 100vh; */
    /* height: calc(100vh - 42px); */
    bottom: 0px;
  }

  .input-container {
    display: flex;
    flex-shrink: 0; /* Фиксируем контейнер ввода внизу */
    left:10px;
    bottom: 5px;
    padding: 10px;
    background: #fff;
    border-top: 1px solid #ccc;
    margin-top: auto;
  }

  .messages {
    flex: 1;
    display: flex;
    flex-direction: column; /* Сообщения идут сверху вниз */
    /* justify-content: flex-end;  */
    align-items: flex-start;
    overflow-y: auto;
    padding: 10px;
    background-color: #f1f1f1;
  }


  .message { 
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    word-wrap: break-word;
  }

  .message.system {
    position: relative;
    max-width: 85%;
    top:74vh;
    align-self: flex-start;
    text-align: center;
    background: #c8cfd5;
    color: #007bff;
    font-size: medium;
    font-weight: bold;
  }

  .message.user {
    position: relative;
    max-width: 85%;
    top:74vh;
    align-self: flex-end;
    text-align: end;
    background: #ecf7c5;
  }

  .message.assistant {
    position: relative;
    max-width: 85%;
    top:74vh;
    align-self: flex-start;
    text-align: start;
    background: #d0d1ff;
    color: #007bff;
    font-size: medium;
    font-weight: bold;
  }

  /* Убедитесь, что только первое сообщение пользователя выравнивается по правому краю */
  .message.first-message {
    align-self: flex-end;
  }

  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .reply_container{
    display: block;
    margin: 10px;
  }

  button {
    padding: 8px 12px;
    border: none;
    background: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .loading {
    position: relative;
    top:74vh;
    font-style: italic;
    color: gray;
    bottom: 0px; /* Помещаем под последнее сообщение */
    left: 10px;
    width: calc(100% - 20px); 
  }
</style>
