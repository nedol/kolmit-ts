import "../../../chunks/index.js";
import { b as GetDict, c as GetWords, d as GetDialog, e as GetLesson, f as GetListen, U as UpdateQuizUsers } from "../../../chunks/db.js";
const config = {
  runtime: "edge"
  // isr:{
  // 	expiration: false// 10
  // }
};
async function GET({ url, fetch, cookies }) {
  const abonent = url.searchParams.get("abonent");
  const text = url.searchParams.get("text");
  const dict = url.searchParams.get("dict");
  const words = url.searchParams.get("words");
  const dialog = url.searchParams.get("dialog");
  const lesson = url.searchParams.get("lesson");
  const listen = url.searchParams.get("listen");
  const lvl = url.searchParams.get("level");
  let data;
  if (text) {
    const theme = url.searchParams.get("theme");
    const title = url.searchParams.get("title");
    data = await GetText({
      owner: abonent,
      level: lvl,
      theme,
      title
    });
  } else if (dict) {
    const theme = url.searchParams.get("theme");
    data = await GetDict({
      owner: abonent,
      type: dict,
      level: lvl,
      theme
    });
  } else if (words) {
    const theme = url.searchParams.get("theme");
    const name = url.searchParams.get("name");
    const owner = url.searchParams.get("owner");
    const level = url.searchParams.get("level");
    data = await GetWords({
      theme,
      name,
      owner,
      level
    });
    let response2 = new Response(JSON.stringify({ data }));
    response2.headers.append("Access-Control-Allow-Origin", `*`);
    return response2;
  } else if (dialog) {
    let name = dialog;
    let owner = url.searchParams.get("owner");
    let level = url.searchParams.get("level");
    data = await GetDialog({ name, owner, level });
    let response2 = new Response(JSON.stringify({ data }));
    response2.headers.append("Access-Control-Allow-Origin", `*`);
    return response2;
  } else if (lesson) {
    let owner = url.searchParams.get("owner");
    let operator = lesson;
    let { data: data2, lang, level, levels } = await GetLesson({
      owner,
      operator,
      level: lvl
    });
    let response2 = new Response(JSON.stringify({ data: data2, lang, level, levels }));
    response2.headers.append("Access-Control-Allow-Origin", `*`);
    return response2;
  } else if (listen) {
    let name = url.searchParams.get("listen");
    let owner = url.searchParams.get("owner");
    let lang = url.searchParams.get("lang");
    data = await GetListen({ name, owner, lang });
    let response2 = new Response(JSON.stringify({ data }));
    response2.headers.append("Access-Control-Allow-Origin", `*`);
    return response2;
  }
  let response = new Response(JSON.stringify({ data }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
async function POST({ request, url, fetch }) {
  let resp;
  const { par } = await request.json();
  const q = par;
  switch (q.func) {
    case "quiz_users":
      resp = await BroadcastQuizUsers(q);
      break;
    case "get_subscribers":
      if (q.type === "dialog") {
        const dlg = await GetDialog({
          name: q.quiz,
          owner: q.abonent,
          level: q.level
        });
        if (dlg.subscribe?.length > 0)
          resp = {
            [q.type]: { quiz: dlg.dialog?.name, subscribers: dlg.subscribe }
          };
      } else if (q.type === "word") {
        const dlg = await GetWords({
          name: q.quiz,
          owner: q.abonent,
          level: q.level
        });
        if (dlg.subscribe?.length > 0)
          resp = {
            [q.type]: { quiz: dlg.dialog?.name, subscribers: dlg.subscribe }
          };
      }
      break;
  }
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
async function BroadcastQuizUsers(q) {
  await UpdateQuizUsers(q);
  let remAr = [q];
  for (let operator in global.rtcPool["operator"][q.abonent]) {
    if (operator === q.rem || operator === q.add)
      continue;
    if (global.rtcPool["operator"][q.abonent][operator].resolve)
      global.rtcPool["operator"][q.abonent][operator].resolve(remAr);
  }
  return remAr;
}
export {
  GET,
  POST,
  config
};
