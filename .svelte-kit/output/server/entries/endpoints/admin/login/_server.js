import "../../../../chunks/index.js";
import { C as CreateAdmin } from "../../../../chunks/db.admin.js";
async function POST({ request, url, fetch, cookies }) {
  const { par } = await request.json();
  const resp = await CreateAdmin(par);
  if (resp) {
    try {
      cookies.set(
        "kolmit.admin:" + resp.operator,
        JSON.stringify({
          name: resp.name,
          abonent: resp.operator,
          operator: resp.operator,
          psw: resp.psw,
          lang: par.lang
        }),
        {
          path: "/",
          maxAge: 60 * 60 * 24 * 400
        }
      );
    } catch (ex) {
      console.log(ex);
    }
  }
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
export {
  POST
};
