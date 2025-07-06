<script lang="ts">
  import { onDestroy, getContext, afterUpdate, onMount } from "svelte";
  import { writable, get } from "svelte/store";
  import { Transloc } from "../../translate/Transloc";
  import { showBottomAppBar, langs, llang, signal } from "$lib/stores";
  import IconButton, { Icon } from "@smui/icon-button";
  import emojiRegex from "emoji-regex";
  import Badge from "@smui-extra/badge";
  import Tts from "../../speech/tts/Tts.svelte";
  import Stt from "../../speech/stt/Stt.svelte";
  import TopAppBar, { Row, Title, Section } from "@smui/top-app-bar";

  import {
    mdiMicrophoneOutline,
    mdiMicrophone,
    mdiTranslate,
    mdiTranslateOff,
    mdiCommentOutline,
    mdiCommentTextOutline,
    mdiEarHearingOff,
    mdiEarHearing,
    mdiMicrophoneMessage,
    mdiSendOutline,
    mdiMessageOutline,
    mdiMessageTextOutline,
    mdiPlay,
    mdiAlertCircleCheckOutline,
    mdiCommentEditOutline,
  } from "@mdi/js";

  let blink_arrow = writable(false);
  let blink_mic = writable(false);

  export let prompt_type = "greeting",
    data,
    quiz = { quiz: "" },
    context: string[] = [];

  let topAppBar;

  let stt: Stt | null = null; // Если `Stt` — это класс или компонент Svelte

  let tts: Tts | null = null; // Если `Tts` — это класс или компонент Svelte

  let isListening = false;
  let display_audio = "none";
  let stt_text = "";

  let isEdit = true;

  let words = "undefined";

  type Message = {
    role: "user" | "assistant" | "system";
    text: string;
    tr: string;
    cor: string | "";
    id: string;
    isTranslate: boolean;
    replies?: string[]; // <- добавляем replies
  };

  type Messages = Message[];

  let userInput = "";

  $: if (userInput) {
    $blink_arrow = true;
    $blink_mic = false;
  } else {
    $blink_arrow = false;
  }

  let elInput: HTMLInputElement;
  let messages = writable<Messages>([]);
  let loading = writable(false);
  let to: NodeJS.Timeout;

  let isHearing = true;

  let isText = true;

  let isTranslate = false;
  let isTip = false;

  let translatedMessages = new Map(); // Кэш переведённых сообщений

  let messagesContainer: HTMLElement | null = null;

  let isCorrection = false;

  let cor_el;

  let dataAr: {};

  let operator = getContext("operator");
  let level = getContext("level");

  let lastMessage: string; // переменная для последнего сообщения

  // Время последнего сообщения (можно сохранять в localStorage для сохранения между перезагрузками)
  let lastMessageTime =
    parseInt(localStorage.getItem("lastMessageTime") ?? "0") || Date.now();

  let reminderTimeout: NodeJS.Timeout | null = null;

  let selectedReplyId: string | null = null; // ID сообщения, для которого показаны ответы

  let isReminderSent = false; // Флаг для отслеживания отправки напоминания

  let shownReplyTranslations = [];

  interface FormattedSentence {
    gr: string;
    placeholder: string;
    value: string;
    word: string;
    class: string;
  }

  let formattedSentence: FormattedSentence[] = [];

  onMount(async () => {
    // Отправляем reminder при входе в компонент
    if (context[0]) sendMessage(`Begin een gesprek in het Nederlands.`);

    messages.update((msgs) => [
      ...msgs,
      {
        id: crypto.randomUUID(),
        role: "system",
        text: Array.isArray(context) ? context.join(" ") : "",
        tr: "",
        cor: "",
        isTranslate: false,
      },
    ]);

    $showBottomAppBar = false;
    // Запускаем таймер для проверки неактивности

    // messages.map((message)=>{
    //   message.shownReplyTranslations = message.replies.map(() => true);
    // });

    $blink_mic = true;
  });

  export function Init(data) {
    console.log(data);
    $messages = [];
    // if ($messages.length <= 1) {
    sendMessage(`Begin een gesprek in het Nederlands.`);
    // }

    if (context[0])
      messages.update((msgs) => [
        ...msgs,
        {
          id: crypto.randomUUID(),
          role: "system",
          text: Array.isArray(context) ? context.join(" ") : "",
          tr: "",
          cor: "",
          isTranslate: false,
        },
      ]);
    // startReminderTimer();//TODO
  }

  // Автопрокрутка вниз при обновлении сообщений
  afterUpdate(() => {
    // Проверяем, было ли изменено поле ввода
    if (elInput) {
      elInput.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  });

  // Отправка сообщения
  async function sendMessage(msg: string = "") {
    if (!userInput.trim() && !msg.trim()) return;

    // Добавляем сообщение пользователя в список
    if (!msg)
      messages.update((msgs) => [
        ...msgs,
        {
          id: crypto.randomUUID(),
          role: "user",
          text: userInput,
          tr: "",
          cor: "",
          isTranslate: false,
        },
      ]);

    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }

    const userMessage = msg ? msg : userInput;
    userInput = "";
    loading.set(true);

    // Вызываем AI
    await callChat();

    resetReminderTimer(); // Сбрасываем таймер при активности пользователя
  }

  // Вызов ChatGPT
  async function callChat() {
    if (to) clearTimeout(to);

    let lastUserMessage = [...$messages]
      .reverse()
      .find((msg) => msg.role === "user");

    let text = lastUserMessage
      ? [{ role: "user", content: lastUserMessage.text }]
      : [];

    // Ограничиваем историю сообщений до 5 реплик с каждой стороны
    let conversationHistory = $messages
      .slice(-10) // Берем последние 10 сообщений (2 от пользователя и 2 от AI)
      .map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.text,
        tip: msg.role === "user" ? isTip : "",
        translated: msg.role === "user" ? isTranslate : "",
        stt: msg.role === "user" ? stt_text : "",
      }));

    const params = {
      func: "chat",
      user_id: operator.operator,
      type: quiz?.quiz || "basic",
      name: quiz?.name || "chat",
      owner: operator.abonent,
      conversationHistory,
      context: context,
      words: words,
      langs: $langs,
      llang: $llang || "nl",
      level: level,
      lvl: operator.lvl,
    };

    console.log("SendMessage", params);

    $signal.SendMessage(params, async (res) => {
      console.log("handleData", res);
      handleData(res);
      isTranslate = false;
      isTip = false;
    });
  }

  async function handleData(data) {
    try {
      if (data?.response?.tokens_limit) {
        const msg = await Transloc(
          "Вы достигли суточного лимита сообщений.",
          "ru",
          $langs,
          "chat"
        );
        messages.update((msgs) => [
          ...msgs,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: `<alert>${msg}</alert>`,
            tr: "",
            cor: "",
            isTranslate: false,
          },
        ]);

        if (messagesContainer) {
          setTimeout(() => {
            messagesContainer.lastElementChild.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }, 100);
        }
        return;
      }

      stt_text = "";

      shownReplyTranslations = shownReplyTranslations.map(() => false);

      dataAr = data.response;

      // Получаем текущее состояние сообщений
      const currentMessages = get(messages);

      elInput.style.height = "50px";

      // Проверка последнего сообщения
      const lastMsg = currentMessages[currentMessages.length - 1];

      // Если есть cor и последнее сообщение от assistant
      if (dataAr.result[$llang]?.cor && lastMsg?.role === "assistant") {
        const newMessages = [...currentMessages];
        // Вставляем cor перед последним сообщением
        newMessages.splice(-1, 0, {
          id: crypto.randomUUID(),
          role: "user",
          text: "",
          tr: dataAr.result[$langs]?.cor,
          cor: dataAr.result[$llang]?.cor,
          isTranslate: false,
        });

        messages.set(newMessages);
        // Добавляем ответ AI в список
      } else if (!dataAr.result[$llang]?.cor && dataAr.result[$llang]?.msg) {
        SpeakText(dataAr.result[$llang]?.msg);

        messages.update((msgs) => [
          ...msgs,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: dataAr.result[$llang]?.msg,
            tr: dataAr.result[$langs]?.msg,
            cor: "",
            isTranslate: false,
            replies: dataAr.result[$llang]?.reply || [],
            repliesTranslated: dataAr.result[$langs]?.reply || [],
          },
        ]);
      } else if (dataAr.result[$llang]?.cor && dataAr.result[$llang]?.msg) {
        messages.update((msgs) => [
          ...msgs,
          {
            id: crypto.randomUUID(),
            role: "user",
            text: "",
            tr: dataAr.result[$langs]?.cor,
            cor: dataAr.result[$llang]?.cor,
            isTranslate: false,
          },
        ]);
      } else {
        loading.set(false);
        // throw new Error("Нет ответа.");
      }

      setTimeout(() => {
        messagesContainer?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
        $messages = $messages;
      }, 500);

      // Обновляем время последнего сообщения
      lastMessageTime = Date.now();
      localStorage.setItem("lastMessageTime", lastMessageTime.toString()); // Сохраняем время
      // resetReminderTimer();

      async function removeEmojis(input: string) {
        const regex = emojiRegex();
        return input.replace(regex, "");
      }

      async function extractAIContent(input: string) {
        const aiRegex = /<ai>([\s\S]*?)<\/ai>/;
        const match = input.match(aiRegex);
        return match ? match[1].trim() : null;
      }

      if (dataAr[$llang]) {
        tts?.Speak_server($llang, dataAr[$llang].msg, "", "");
      }

      $blink_mic = true;
    } catch (error) {
      console.error("Произошла ошибка при обращении к серверу:", error);
      messages.update((msgs) => [
        ...msgs,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Ошибка при обработке запроса. Попробуйте снова.",
          tr: "",
          isTranslate: false,
        },
      ]);
    } finally {
      loading.set(false);
    }
  }

  function StopListening() {
    isListening = false;
  }

  function SttResult(text: string) {
    userInput = text[$llang];
    stt_text = text[$llang];

    if (isEdit) {
      elInput.value = userInput;
      autoResize();
    } else {
      userInput = text[$llang];
      sendMessage();
    }
  }

  function onClickMicrophone() {
    if (isListening) {
      stt_text = "";
      stt?.MediaRecorderStop();
      isListening = false;
      return;
    } else {
      stt_text = "";

      $blink_mic = false;

      stt.startAudioMonitoring($llang, $langs);

      isListening = true;
    }
  }

  async function toggleTranslation(message: Message, i) {
    if (!message.tr)
      message.tr = await Transloc(message.text, $llang, $langs, "");

    if (message.role !== "user")
      translatedMessages.set(message.text, message.tr);

    message.isTranslate = !message.isTranslate;
    isTranslate = !isTranslate;
    // $messages = $messages; // Принудительное обновление

    setTimeout(() => {
      messagesContainer?.children[i].scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      $messages = $messages; // Принудительное обновление
    }, 100);
  }

  const SpeakText = async (text: string) => {
    if (text && isHearing) {
      if (dataAr.result[$llang].audio) {
        const audio = new Audio(dataAr.result[$llang].audio);
        audio.playbackRate = 0.9;
        audio.load();
        audio.play();
      } else {
        const output = text.replace(/<[^>]*>/g, "");
        tts?.Speak_server($llang, output, "", "");
      }
    }
  };

  function toggleReply(messageId: string) {
    if (selectedReplyId === messageId) {
      selectedReplyId = null;
    } else {
      selectedReplyId = messageId;
    }

    setTimeout(() => {
      messagesContainer?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  }

  function toggleCorrection(i) {
    let el;
    isCorrection = !isCorrection;
    if (isCorrection) el = messagesContainer?.children[i];
    else el = messagesContainer?.lastElementChild;
    if (el)
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
  }

  function startReminderTimer() {
    reminderTimeout = setTimeout(
      () => {
        loading.set(false);
        const currentTime = Date.now();
        if (currentTime - lastMessageTime >= 1 * 60 * 1000) {
          // 5 минут неактивности
          sendMessage(`Blijf praten.`); // Отправляем напоминание
          stopReminderTimer(); // Останавливаем таймер после отправки
        }
      },
      1 * 60 * 1000
    ); // Проверка через 5 минут
  }

  // Функция для остановки таймера
  function stopReminderTimer() {
    if (reminderTimeout) {
      clearTimeout(reminderTimeout);
      reminderTimeout = null; // Сбрасываем таймер
    }
  }

  // Функция для сброса таймера при активности пользователя
  function resetReminderTimer() {
    // stopReminderTimer(); // Останавливаем текущий таймер
    lastMessageTime = Date.now(); // Обновляем время последнего сообщения
    localStorage.setItem("lastMessageTime", lastMessageTime.toString()); // Сохраняем в localStorage
    // startReminderTimer(); // Запускаем таймер заново
  }

  function onKeydown(key) {
    elInput.scrollIntoView({ behavior: "smooth", block: "end" });
    key === "Enter" && sendMessage();
  }

  function SetInput(text: string) {
    elInput.scrollIntoView({ behavior: "smooth", block: "end" });
    isTip = true;
    autoResize();
  }

  // Функция авторазмера
  function autoResize() {
    elInput.style.height = "auto"; // сбрасываем высоту
    elInput.style.height = elInput.scrollHeight + 2 + "px"; // устанавливаем новую высоту

    // Прокручиваем вниз, если нужно
    elInput.scrollTop = elInput.scrollHeight;
  }

  function toggleReplyTranslation(i) {
    setTimeout(() => {
      shownReplyTranslations[i] = !shownReplyTranslations[i];
    }, 10);
  }

  function onHearing() {
    isHearing = !isHearing;
  }

  // Очистка таймера при размонтировании
  onDestroy(() => {
    if (to) clearTimeout(to);
    stopReminderTimer();
  });
</script>

<Tts bind:this={tts}></Tts>
<div class="top-app-bar-container flexor">
  <TopAppBar bind:this={topAppBar} variant="fixed">
    <Row>
      <Section align="start">
        <div></div>
      </Section>
      <Section align="start">
        <div>
          <IconButton
            class="material-icons"
            aria-label="Back"
            on:click={onHearing}
          >
            <Icon
              tag="svg"
              viewBox="0 0 24 24"
              style="position:absolute; margin:10px 5px 10px 5px; scale:1.1;width:30px"
            >
              {#if isHearing}
                <path fill="white" d={mdiEarHearing} />
              {:else}
                <path fill="grey" d={mdiEarHearingOff} />
              {/if}
            </Icon>
          </IconButton>
        </div>
      </Section>
      <Section align="end">
        <div>
          <IconButton
            class="material-icons"
            aria-label="Back"
            on:click={() => {
              isEdit = !isEdit;
            }}
          >
            <Icon
              tag="svg"
              viewBox="0 0 24 24"
              style="position:absolute; margin:10px 5px 10px 5px; scale:1.1;width:30px"
            >
              {#if isEdit}
                <path fill="white" d={mdiCommentOutline} />
              {:else}
                <path fill="white" d={mdiCommentEditOutline} />
              {/if}
            </Icon>
          </IconButton>
        </div>
      </Section>
      <Section align="end">
        <div>
          <IconButton
            class="material-icons"
            aria-label="Back"
            on:click={() => {
              isText = !isText;
            }}
          >
            <Icon
              tag="svg"
              viewBox="0 0 24 24"
              style="position:absolute; margin:10px 5px 10px 5px; scale:1.1;width:30px"
            >
              {#if isText}
                <path fill="white" d={mdiMessageOutline} />
              {:else}
                <path fill="white" d={mdiMessageTextOutline} />
              {/if}
            </Icon>
          </IconButton>
        </div>
      </Section>

      <Section align="end"></Section>
    </Row>
  </TopAppBar>
</div>

<div class="chat-container">
  <Stt {SttResult} {StopListening} bind:display_audio bind:this={stt}></Stt>

  <div class="messages" bind:this={messagesContainer}>
    {#each $messages as message, index (message.id)}
      <div
        class="message {message.role} {message.role === 'user'}"
        bind:this={lastMessage}
      >
        <!--strong>{message.role === 'user' ? 'Вы' : 'AI'}:</strong-->
        {#if message.cor}
          {#if isCorrection}
            <div class="correction_container" bind:this={cor_el}>
              {#if message.isTranslate}
                {#if translatedMessages.has(message.cor)}
                  <cor>
                    {@html translatedMessages.get(message.cor)}
                    <div on:click={() => toggleTranslation(message, index)}>
                      <IconButton>
                        <Icon tag="svg" viewBox="0 0 24 24">
                          <path
                            fill={message.role === "user"
                              ? "red"
                              : "currentColor"}
                            d={mdiTranslate}
                          />
                        </Icon>
                      </IconButton>
                    </div>
                  </cor>
                {:else if message.tr}
                  <cor
                    >{@html message.tr}
                    <div on:click={() => toggleTranslation(message, index)}>
                      <IconButton>
                        <Icon tag="svg" viewBox="0 0 24 24">
                          <path
                            fill={message.role === "user"
                              ? "red"
                              : "currentColor"}
                            d={mdiTranslate}
                          />
                        </Icon>
                      </IconButton>
                    </div>
                  </cor>
                {:else}
                  {#await Transloc(message.cor, $llang, $langs, "chat") then data}
                    <cor>
                      {@html data}
                      <div on:click={() => toggleTranslation(message, index)}>
                        <IconButton>
                          <Icon tag="svg" viewBox="0 0 24 24">
                            <path
                              fill={message.role === "user"
                                ? "red"
                                : "currentColor"}
                              d={mdiTranslate}
                            />
                          </Icon>
                        </IconButton>
                      </div>
                    </cor>
                  {/await}
                {/if}
              {:else}
                <cor>
                  {@html message.cor}
                  <div on:click={() => toggleTranslation(message, index)}>
                    <IconButton>
                      <Icon tag="svg" viewBox="0 0 24 24">
                        <path
                          fill={message.role === "user"
                            ? "red"
                            : "currentColor"}
                          d={mdiTranslateOff}
                        />
                      </Icon>
                    </IconButton>
                  </div>
                </cor>
              {/if}
            </div>
          {/if}
          <div on:click={() => toggleCorrection(index)}>
            <IconButton>
              <Icon tag="svg" viewBox="0 0 24 24">
                <path
                  fill={message.role === "user" ? "red" : "currentColor"}
                  d={mdiAlertCircleCheckOutline}
                />
              </Icon>
            </IconButton>
          </div>
        {/if}

        {#if message.isTranslate && translatedMessages.has(message.text)}
          {@html translatedMessages.get(message.text)}
        {:else}
          <div
            style="visibility:{message.role === 'assistant'
              ? isText
                ? 'visible'
                : 'hidden'
              : 'visible'}"
          >
            {@html message.text}
          </div>
          <!-- <iframe src="/html/html/bricks.html" width="100%" height="200" style="border: none;"></iframe> -->
        {/if}

        <div style="display:flex;justify-content: space-between;">
          {#if ((message.role === "system" && message.text.length > 0) || message.role === "assistant") && quiz.quiz !== "dialog"}
            <div on:click={() => SpeakText(message.text)}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24" style="scale:1">
                  <path fill="#007bff" d={mdiPlay} />
                </Icon>
              </IconButton>
            </div>
          {/if}
          {#if message.role === "system" && message.text.length > 0}
            <div on:click={() => toggleTranslation(message, index)}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24">
                  {#if message.isTranslate}
                    <path
                      fill={message.role === "user" ? "red" : "currentColor"}
                      d={mdiTranslate}
                    />
                  {:else}
                    <path
                      fill={message.role === "user" ? "red" : "currentColor"}
                      d={mdiTranslateOff}
                    />
                  {/if}
                </Icon>
              </IconButton>
            </div>
          {/if}

          {#if message.replies && message.role === "assistant" && quiz.quiz !== "dialog"}
            <div on:click={() => toggleReply(message.id)}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24" style="scale:1">
                  <path fill="green" d={mdiMicrophoneMessage} />
                </Icon>
              </IconButton>
            </div>
          {/if}

          {#if message.role === "assistant"}
            <div on:click={() => toggleTranslation(message, index)}>
              <IconButton>
                <Icon tag="svg" viewBox="0 0 24 24">
                  {#if message.isTranslate}
                    <path
                      fill={message.role === "user" ? "red" : "currentColor"}
                      d={mdiTranslate}
                    />
                  {:else}
                    <path
                      fill={message.role === "user" ? "red" : "currentColor"}
                      d={mdiTranslateOff}
                    />
                  {/if}
                </Icon>
              </IconButton>
            </div>
          {/if}
        </div>

        {#if message.role === "assistant"}
          {#if selectedReplyId === message.id}
            <div class="reply_container">
              <ul>
                {#each message.replies as reply, i}
                  <li>
                    <reply>
                      {#if shownReplyTranslations[i]}
                        {@html reply}
                      {:else}
                        {@html message.repliesTranslated[i]}
                      {/if}
                    </reply>

                    <div style="display: flex; justify-content: flex-end;">
                      <div on:click={() => toggleReplyTranslation(i)}>
                        {#if shownReplyTranslations[i]}
                          <IconButton>
                            <Icon tag="svg" viewBox="0 0 24 24">
                              <path fill="currentColor" d={mdiTranslate} />
                            </Icon>
                          </IconButton>
                        {:else}
                          <IconButton>
                            <Icon tag="svg" viewBox="0 0 24 24">
                              <path fill="currentColor" d={mdiTranslateOff} />
                            </Icon>
                          </IconButton>
                        {/if}
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        {/if}
      </div>
    {/each}
  </div>

  <div class="input-container">
    <div
      class:blink={$blink_mic}
      style="position:absolute; margin-right:10px; "
    >
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
          style="position:absolute;top:2px;right:-1px;color:black;background-color:lightgrey;scale:.8;letter-spacing: 1.5px;"
          >{$llang}</Badge
        >
      </IconButton>
    </div>

    {#await Transloc("Введите сообщение...", "ru", $langs, "chat") then data}
      <textarea
        rows="1"
        bind:value={userInput}
        bind:this={elInput}
        on:input={() => SetInput(userInput)}
        placeholder={isEdit ? data : ""}
        on:keydown={(e) => {
          onKeydown(e.key);
        }}
        disabled={!isEdit || $loading}
        style="
            width: 100%;
            padding: 10px;
            text-indent: 40px; 
            font-size: 16px;
            line-height: 1.4;
            border: 1px solid #ccc;
            resize: none;
            overflow: hidden;
            box-sizing: border-box;
            height: 50px;
          "
      />
    {/await}

    <button
      class:blink={$blink_arrow}
      on:click={() => {
        sendMessage();
      }}
      disabled={!isEdit || $loading}
      aria-label="Отправить сообщение"
    >
      <IconButton class="material-icons">
        <Icon tag="svg" viewBox="0 0 24 24">
          <path fill="white" d={mdiSendOutline} />
        </Icon>
      </IconButton>
    </button>
  </div>
</div>

<style>
  :global(cor) {
    display: block;
    margin: 2px;
    padding: 2px;
    color: red;
    border: 1px solid;
    border-radius: 5px;
    font-size: small;
    font-weight: bold;
  }

  :global(reply) {
    display: block;
    color: green;
    font-size: medium;
    font-weight: bold;
  }

  :global(alert) {
    display: block;
    color: red;
    font-size: small;
    font-weight: bold;
  }

  textarea::placeholder {
    direction: ltr;
  }

  .chat-container {
    display: flex;
    position: absolute;
    top: 50px;
    width: 98%;
    flex-direction: column;
    /* height: 100vh; */
    /* height: calc(100vh - 42px); */
    bottom: 7px;
  }

  .input-container {
    display: flex;
    position: relative;
    flex-shrink: 0; /* Фиксируем контейнер ввода внизу */
    left: 10px;
    bottom: -6px;
    padding: 10px;
    background: #fff;
    border-top: 1px solid #ccc;
    margin-top: auto;
  }

  .messages {
    flex: 1;
    display: flex;
    position: relative;
    flex-direction: column; /* Сообщения идут сверху вниз */
    /* justify-content: flex-end;  */
    align-items: flex-start;
    overflow-y: auto;
    padding: 10px;
    background-color: #f1f1f1;
    bottom: 0px;
    width: inherit;
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
    top: 74vh;
    align-self: flex-start;
    text-align: center;
    background: #c8cfd5;
    color: #007bff;
    font-size: medium;
    font-weight: bold;
  }

  .message.user {
    position: relative;
    width: 85%;
    top: 74vh;
    align-self: flex-end;
    text-align: end;
    background: #ddbb56;
  }

  .message.assistant {
    position: relative;
    width: 85%;
    top: 74vh;
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

  .reply_container {
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

  .blink {
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 0.2;
      visibility: hidden;
    }
    50% {
      opacity: 1;
      visibility: visible;
    }
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .loading {
    position: relative;
    top: 74vh;
    font-style: italic;
    color: gray;
    bottom: 0px; /* Помещаем под последнее сообщение */
    left: 10px;
    width: calc(100% - 20px);
  }

  cor {
    display: block;
    background-color: #f0f7ff;
    border-left: 4px solid #e80f0f;
    padding: 1em 1.5em;
    margin: 1.5em 0;
    font-family: sans-serif;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  cor p {
    margin: 0.5em 0;
    line-height: 1.6;
    color: #333;
  }

  cor ul {
    padding-left: 1.2em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  cor li {
    margin-bottom: 0.3em;
  }

  cor strong {
    color: #2c89d9;
  }
  .tijd {
    position: relative;
    border: 2px solid;
    border-color: rgb(119, 201, 119);
    --border-color: rgb(119, 201, 119);
    border-radius: 5px;
    /* background-color: lightgreen; */
    padding: 0px 6px;
  }

  li {
    color: green;
  }
</style>
