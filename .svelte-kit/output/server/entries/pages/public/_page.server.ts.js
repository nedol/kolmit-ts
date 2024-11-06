import md5 from "md5";
import { d as dict } from "../../../chunks/dict.js";
import { i as ice_conf } from "../../../chunks/ice_conf.js";
import "node-turn";
import { h as CreatePool, G as GetUsers, i as GetGroup } from "../../../chunks/db.js";
let kolmit;
async function load({ fetch, cookies, route, url, stuff }) {
  let res;
  let abonent = url.searchParams.get("abonent");
  let lang = url.searchParams.get("lang");
  let name = url.searchParams.get("name");
  let operator = url.searchParams.get("operator");
  let psw = url.searchParams.get("psw");
  let prom = new Promise((resolve, reject) => {
    CreatePool(resolve);
  });
  await prom;
  const host = url.origin;
  let resp = {
    dict,
    ice_conf
  };
  try {
    res = cookies.get("kolmit.operator." + abonent);
    if (psw) {
      kolmit = { operator, psw: md5(psw), name, lang };
    } else {
      if (res) {
        kolmit = JSON.parse(res);
      } else {
        resp.check = false;
        resp.operator = "";
        resp.abonent = abonent;
        resp.operators = "{}";
        resp.dict = dict;
        return resp;
      }
    }
  } catch (ex) {
    console.log();
  }
  let params = {
    operator: kolmit.operator,
    abonent,
    psw: kolmit.psw
  };
  await GetUsers(params);
  let { group, oper } = await GetGroup(params);
  return {
    check: true,
    host,
    // url: decodeURIComponent(url.toString()),
    operator: oper,
    dict,
    group,
    quiz_users: {},
    //res && res.quiz_users ? res.quiz_users : '',
    ice_conf
  };
}
export {
  load
};
