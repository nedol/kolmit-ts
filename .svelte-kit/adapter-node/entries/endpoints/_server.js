import "../../chunks/index.js";
import "ws";
import { C as CheckOperator, a as CreateOperator, G as GetUsers } from "../../chunks/db.js";
import "nodemailer";
import md5 from "md5";
import pkg from "lodash";
import { r as rtcPool_st } from "../../chunks/stores.js";
const { find, findKey } = pkg;
rtcPool_st.subscribe((data) => {
  global.rtcPool = data;
});
async function GET({ url, fetch, cookies }) {
  const abonent = url.searchParams.get("abonent");
  const admin = url.searchParams.get("admin");
  const text = url.searchParams.get("text");
  const dict = url.searchParams.get("dict");
  url.searchParams.get("key");
  const func = url.searchParams.get("func");
  const lang = url.searchParams.get("lang");
  if (func === "reset") {
    cookies.delete("kolmit.operator:" + abonent);
  } else if (func === "cookie") {
    if (lang) {
      try {
        let cookie = cookies.get(`kolmit.operator:${abonent}`) || cookies.get(`kolmit.operator.${abonent}`);
        cookie = JSON.parse(cookie);
        cookie.lang = lang;
        const oper = admin ? "admin" : "operator";
        cookies.set(`kolmit.${oper}.${abonent}`, JSON.stringify(cookie), {
          path: "/",
          maxAge: 60 * 60 * 24 * 400
        });
      } catch (ex) {
        console.log(ex);
      }
    }
  } else if (func === "set_lang") {
    if (lang) {
      try {
        let cookie = cookies.get(`kolmit.admin:${abonent}`) || cookies.get(`kolmit.operator.${abonent}`);
        cookie = JSON.parse(cookie);
        cookie.lang = lang;
        const oper = admin ? "admin" : "operator";
        cookies.set(`kolmit.${oper}.${abonent}`, JSON.stringify(cookie), {
          path: "/",
          maxAge: 60 * 60 * 24 * 400
        });
      } catch (ex) {
        console.log(ex);
      }
    }
    let response2 = new Response();
    response2.headers.append("Access-Control-Allow-Origin", `*`);
    return response2;
  } else if (text) {
    const level = url.searchParams.get("level");
    const theme = url.searchParams.get("theme");
    let text2 = await GetText({ owner: abonent, level, theme });
    let obj = { text: text2 };
    let response2 = new Response(JSON.stringify({ obj }));
    response2.headers.append("Access-Control-Allow-Origin", `*`);
    return response2;
  } else if (dict) {
    const level = url.searchParams.get("level");
    const theme = url.searchParams.get("theme");
    let data = await GetDict({
      owner: abonent,
      type: dict,
      level,
      theme
    });
    if (data) {
      let response2 = new Response(JSON.stringify({ data }));
      response2.headers.append("Access-Control-Allow-Origin", `*`);
      return response2;
    }
  }
  let response = new Response();
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
async function POST({ request, url, fetch, cookies }) {
  let resp;
  const abonent = url.searchParams.get("abonent");
  const { par } = await request.json();
  const q = par;
  const res = cookies.get("abonent." + abonent);
  if (res) {
    JSON.parse(res);
  } else {
    ({ psw: md5("demo") });
  }
  switch (q.func) {
    case "operator":
      if (q.email && q.psw) {
        const par2 = await CreateOperator(q);
        if (par2) {
          cookies.set(
            "kolmit.operator." + q.abonent,
            JSON.stringify({
              name: par2.name,
              operator: par2.operator,
              abonent: q.abonent,
              psw: par2.psw,
              email: q.email,
              lang: par2.lang
            }),
            {
              path: "/",
              maxAge: 60 * 60 * 24 * 400
            }
          );
          resp = JSON.stringify({
            func: par2.func,
            name: q.name,
            operator: q.operator,
            abonent: q.abonent,
            lang: q.lang
          });
        }
      }
      break;
    case "check":
      SetParams(q);
      if (q.type === "user") {
        global.rtcPool[q.type][q.abonent][q.operator][q.uid];
        const operators = { [q.operator]: {} };
        for (let uid in global.rtcPool["operator"][q.abonent]) {
          if (uid !== "resolve")
            operators[q.operator][uid] = {
              type: q.type,
              abonent: q.abonent,
              operator: q.operator,
              uid: q.uid,
              status: global.rtcPool["operator"][q.abonent][uid].status
            };
        }
        resp = {
          func: q.func,
          type: q.type,
          check: true
          // operators: operators,
        };
        SendOperatorOffer(q);
        return new Response(JSON.stringify({ resp }));
      } else if (q.type === "operator") {
        const res2 = cookies.get("kolmit.operator." + q.abonent);
        let kolmit;
        if (res2) {
          kolmit = JSON.parse(res2);
          q.psw = kolmit.psw;
        }
        resp = await CheckOperator(q);
        console.log(resp);
      }
      break;
    case "offer":
      try {
        SetParams(q);
        BroadcastOperatorStatus(q, "offer");
      } catch (ex) {
        console.log();
      }
      break;
    case "call":
      HandleCall(q);
      break;
    case "status":
      if (q.status === "call") {
        if (q.type === "operator") {
          const item = global.rtcPool[q.type][q.abonent][q.operator][q.uid];
          if (item)
            item.status = "busy";
          BroadcastOperatorStatus(q, "busy");
        }
        break;
      }
      if (q.status === "close") {
        try {
          const item = global.rtcPool[q.type][q.abonent][q.operator][q.uid];
          if (item) {
            item.status = q.status;
            if (q.type === "operator")
              BroadcastOperatorStatus(q, q.status);
          }
        } catch (ex) {
        }
        break;
      }
      SetParams(q);
      break;
  }
  rtcPool_st.set(global.rtcPool);
  let response = new Response(JSON.stringify({ resp }));
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
function SetParams(q) {
  if (!global.rtcPool[q.type][q.abonent]) {
    global.rtcPool[q.type][q.abonent] = {};
  }
  if (!global.rtcPool[q.type][q.abonent][q.operator])
    global.rtcPool[q.type][q.abonent][q.operator] = [];
  let item;
  if (q.type === "user") {
    item = global.rtcPool[q.type][q.abonent][q.operator][q.uid];
  } else
    item = global.rtcPool[q.type][q.abonent][q.operator][0];
  if (!item) {
    item = {};
    item.cand = [];
    global.rtcPool[q.type][q.abonent][q.operator][q.uid] = item;
  }
  item.uid = q.uid;
  item.status = q.status;
  item.abonent = q.abonent;
  item.operator = q.operator;
  if (q.desc)
    item.desc = q.desc;
  if (Array.isArray(q.cand)) {
    q.cand.forEach((cand, index) => {
      item.cand.push(cand);
    });
  } else if (q.cand)
    item.cand.push(q.cand);
}
async function BroadcastOperatorStatus(q, check) {
  try {
    let type = q.type === "operator" ? "user" : "operator";
    for (let operator in global.rtcPool[type][q.abonent]) {
      if (operator === q.operator && q.status === "call")
        continue;
      for (let uid in global.rtcPool[q.type][q.abonent][operator]) {
        if (uid === "resolve")
          continue;
        let item = global.rtcPool[q.type][q.abonent][operator][uid];
        let offer = "";
        if (
          // item.status ==='offer' &&
          // && item.abonent === q.operator
          item.uid !== q.uid
        ) {
          const users = await GetUsers({ abonent: q.abonent, operator: q.operator });
          const oper = find(users.operators, { operator: q.operator });
          if (global.rtcPool[type][q.abonent][item.operator]?.resolve)
            global.rtcPool[type][q.abonent][item.operator].resolve([
              {
                func: q.func,
                type,
                abonent: q.abonent,
                operator: q.operator,
                uid: q.uid,
                status: check,
                picture: oper.picture,
                name: oper.name
              }
            ]);
        }
      }
    }
  } catch (ex) {
    console.log(ex);
  }
}
function SendOperatorOffer(q) {
  if (global.rtcPool["operator"] && global.rtcPool["operator"][q.abonent] && global.rtcPool["operator"][q.abonent][q.operator]) {
    for (let uid in global.rtcPool["operator"][q.abonent][q.operator]) {
      if (global.rtcPool["operator"][q.abonent][q.operator][uid].status === "offer") {
        let operator = {
          abonent: q.abonent,
          operator: q.operator,
          uid,
          status: global.rtcPool["operator"][q.abonent][q.operator][uid].status,
          desc: global.rtcPool["operator"][q.abonent][q.operator][uid].desc,
          cand: global.rtcPool["operator"][q.abonent][q.operator][uid].cand
        };
        if (q.type === "user") {
          global.rtcPool["user"][q.abonent][q.operator][q.uid];
          global.rtcPool["user"][q.abonent][q.operator].resolve([
            { operator }
          ]);
        }
      }
    }
  }
}
async function HandleCall(q) {
  let remAr = [];
  if (q.type === "user") {
    if (q.desc || q.cand) {
      remAr.push({
        func: q.func,
        desc: q.desc,
        cand: q.cand,
        abonent: q.abonent,
        user: q.operator
        // "abonent": q.operator
      });
      if (!global.rtcPool["operator"][q.abonent][q.target])
        return;
      let item = global.rtcPool["operator"][q.abonent][q.target][q.oper_uid];
      if (item) {
        await global.rtcPool["operator"][q.abonent][q.target].promise;
        if (global.rtcPool["operator"][q.abonent][q.target].resolve) {
          console.log("HandleCall to operator", remAr.length);
          global.rtcPool["operator"][q.abonent][q.target].resolve(remAr);
        }
      }
    } else {
      let item = global.rtcPool["user"][q.abonent][q.user];
      if (item) {
        let oper_check = findKey(
          global.rtcPool["operator"][q.abonent][q.operator],
          {
            status: "check"
          }
        );
        let oper_offer_key = findKey(
          global.rtcPool["operator"][q.abonent][q.user],
          {
            status: "offer"
          }
        );
        let oper_offer = global.rtcPool["operator"][q.abonent][q.user][oper_offer_key];
        if (oper_offer) {
          remAr.push({
            func: q.func,
            abonent: q.abonent,
            uid: q.uid,
            oper_uid: oper_offer.uid,
            desc: oper_offer.desc,
            cand: oper_offer.cand
          });
          await global.rtcPool["operator"][q.abonent][q.operator].promise;
          if (global.rtcPool["user"][q.abonent][q.operator].resolve)
            global.rtcPool["user"][q.abonent][q.operator].resolve(remAr);
          return;
        } else {
          item.status = "wait";
          remAr.push({
            func: q.func,
            abonent: q.abonent,
            status: "wait"
          });
          await global.rtcPool["operator"][q.abonent][q.operator].promise;
          if (global.rtcPool["user"][q.abonent][q.operator].resolve)
            global.rtcPool["user"][q.abonent][q.operator].resolve(remAr);
          if (oper_check && oper_check.resolve) {
            let remAr2 = [
              {
                func: q.func,
                abonent: q.abonent,
                user_uid: item.uid,
                status: "wait"
              }
            ];
            oper_check.resolve(remAr2);
          }
        }
      }
    }
  }
}
export {
  GET,
  POST
};
