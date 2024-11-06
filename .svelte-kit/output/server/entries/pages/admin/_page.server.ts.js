import md5 from "md5";
import { d as dict } from "../../../chunks/dict.js";
import { h as CreatePool } from "../../../chunks/db.js";
import { S as SetSQL, a as GetGroups } from "../../../chunks/db.admin.js";
let kolmit;
async function load({ fetch, cookies, route, url, stuff }) {
  let res;
  let abonent = url.searchParams.get("abonent");
  let lang = url.searchParams.get("lang");
  let name = url.searchParams.get("name");
  let operator = url.searchParams.get("operator");
  let psw = url.searchParams.get("psw");
  let sql = "";
  let prom = new Promise((resolve, reject) => {
    CreatePool(resolve);
  });
  sql = await prom;
  SetSQL(sql);
  let host = url.origin;
  let resp = {
    dict
  };
  try {
    res = cookies.get("kolmit.admin:" + abonent);
    if (psw) {
      kolmit = { operator, psw: md5(psw), name, lang };
    } else {
      if (res) {
        kolmit = JSON.parse(res);
      } else {
        resp.check = false;
        resp.abonent = abonent;
        resp.users = "{}";
        resp.host = host;
        return resp;
      }
    }
  } catch (ex) {
    console.log();
  }
  let params = {
    operator: abonent,
    abonent,
    psw: kolmit.psw
  };
  let { operators, admin, groups } = await GetGroups(params);
  return {
    check: true,
    host,
    groups,
    operators,
    // url: decodeURIComponent(url.toString()),
    operator: kolmit.operator,
    name: kolmit.name,
    abonent,
    lang: kolmit.lang,
    dict
  };
}
export {
  load
};
