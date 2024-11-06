import { G as GetUsers } from "../../../../chunks/db.js";
import pkg from "lodash";
const { find, findKey } = pkg;
async function GET({ url, fetch, cookies }) {
  const abonent = url.searchParams.get("abonent");
  const operator = url.searchParams.get("operator");
  const func = url.searchParams.get("func");
  let resp = {};
  switch (func) {
    case "operators":
      resp = await getOperators({ operator, abonent });
      break;
  }
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
async function getOperators(q, func) {
  const users = await GetUsers(q);
  let operators = { [q.operator]: {} };
  for (let oper in global.rtcPool["operator"][q.abonent]) {
    const user = find(users.operators, { operator: oper });
    operators[oper] = {
      type: q.type,
      abonent: q.abonent,
      operator: oper,
      status: global.rtcPool["operator"][q.abonent][oper][oper].status ? global.rtcPool["operator"][q.abonent][oper][oper].status : "",
      picture: user.picture,
      name: user.name
    };
  }
  return operators;
}
export {
  GET
};
