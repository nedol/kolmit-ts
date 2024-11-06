import "../../../../chunks/index.js";
import { b as UpdateWords, c as UpdateListen, d as UpdateDialog } from "../../../../chunks/db.admin.js";
async function POST({ request, url, fetch }) {
  let resp;
  const { func, owner, level, name, new_name, data, lang, context } = await request.json();
  switch (func) {
    case "upd_dlg":
      UpdateDialog({ owner, level, name, new_name, data, lang });
      break;
    case "upd_listen":
      UpdateListen({ owner, level, name, new_name, data, lang });
      break;
    case "upd_words":
      UpdateWords({ owner, level, name, new_name, data, lang, context });
      break;
  }
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
export {
  POST
};
