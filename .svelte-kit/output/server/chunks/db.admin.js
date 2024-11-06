import md5 from "md5";
import { S as SendEmail, j as getLevels } from "./db.js";
import "postgres";
import pkg from "lodash";
const { find, remove, findIndex, difference } = pkg;
let sql;
async function SetSQL(sql_) {
  sql = sql_;
}
async function CreateAdmin(par) {
  try {
    let res = await sql`INSERT INTO admins
			(name , email, operator, psw, lang)
			VALUES(${par.name},${par.email},${md5(par.email)},${md5(par.psw)},${par.lang})
			ON CONFLICT ( email)
			DO NOTHING
			`;
    return {
      name: par.name,
      email: par.email,
      operator: md5(par.email),
      psw: md5(par.psw),
      lang: par.lang
    };
  } catch (ex) {
    console.log();
  }
}
async function GetGroups(par) {
  let groups, operators, admin;
  try {
    operators = await sql`
      SELECT *
      FROM operators
      WHERE role <> 'admin' AND operators.abonent = ${par.abonent}`;
    admin = await sql`
      SELECT *
      FROM operators
      WHERE role = 'admin' AND operators.abonent = ${par.abonent}`;
    groups = await sql`
      SELECT groups.name::text 
      FROM groups
      INNER JOIN operators ON (operators.abonent = groups.owner)
      WHERE operators.operator = ${par.abonent} 
      AND operators.role = 'admin' 
      AND operators.psw = ${par.psw}`;
  } catch (ex) {
    console.log(ex);
  }
  return { groups, operators, admin };
}
async function DeleteUser(par) {
  let resp;
  try {
    resp = await sql`UPDATE operators SET "group"='public', abonent='public' 
    WHERE operator=${par.operator} AND abonent=${par.abonent}`;
  } catch (ex) {
    console.log(ex);
  }
  return { resp };
}
async function AddUser(q) {
  try {
    let operator = md5(q.email);
    let resp = await sql`INSERT INTO operators
			("group", role, operator , email, abonent , name, lang )
			VALUES(${q.class_name}, ${q.role},${operator}, ${q.email}, ${q.abonent}, ${q.name}, ${q.lang})
			ON CONFLICT (operator, abonent)
			DO NOTHING`;
    if (resp.count > 0) {
      SendEmail({ send_email: q.email, abonent: q.abonent, lang: q.lang });
    }
    return { resp };
  } catch (ex) {
    return JSON.stringify({ func: q.func, resp: ex });
  }
}
async function UpdateLesson(q) {
  try {
    let levels = await getLevels(q.owner);
    levels.map((item) => {
      if (q.levels.indexOf(item) === -1)
        removeModule(item);
    });
    let res = await sql`INSERT INTO lessons
			(level , owner, data, lang, timestamp )
			VALUES(${q.level},${q.owner},${JSON.parse(q.data)}, ${q.lang}, NOW())
			ON CONFLICT (level, owner, lang)
			DO UPDATE SET
			owner = EXCLUDED.owner,
			level = EXCLUDED.level,
      lang = EXCLUDED.lang,
			data = EXCLUDED.data,
      timestamp = NOW()`;
    return { res };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}
async function removeModule(item) {
  return await sql`DELETE FROM lessons WHERE level=${item}`;
}
async function UpdateDialog(q) {
  try {
    let res = await sql`INSERT INTO dialogs
			(name , dialog, owner, html, level)
			VALUES(${q.new_name},${q.data},${q.owner},${q.data.html || ""}, ${q.level} )
			ON CONFLICT (name, owner, level)
			DO UPDATE SET
			name = EXCLUDED.name,
      html = EXCLUDED.html,
			dialog = EXCLUDED.dialog,
      timestamp = NOW()`;
    return { res };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}
async function UpdateListen(q) {
  try {
    let res = await sql`INSERT INTO listen
			(owner, name , data, lang)
			VALUES(${q.owner},${q.new_name},${q.data},${q.lang} )
			ON CONFLICT (name, lang, owner)
			DO UPDATE SET
			data = EXCLUDED.data`;
    return { res };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}
async function UpdateWords(q) {
  try {
    let res = await sql`INSERT INTO word
			(name , data, owner, level,context)
			VALUES(${q.new_name},${q.data},${q.owner}, ${q.level}, ${q.context})
			ON CONFLICT (name, owner, level)
			DO UPDATE SET
			name = EXCLUDED.name,
      level = EXCLUDED.level,
			data = EXCLUDED.data,
      context = EXCLUDED.context,
      timestamp = NOW()`;
    return { res };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}
async function GetPrompt(prompt, quiz_name, owner, level, theme) {
  let prompt_res, words_res, gram_res, gram;
  try {
    prompt_res = await sql`SELECT * FROM prompts WHERE name=${prompt}`;
    words_res = await sql`SELECT * FROM word WHERE name=${quiz_name}`;
    gram_res = await sql`SELECT * FROM grammar WHERE owner=${owner} AND level=${level}`;
    gram = find(gram_res[0].data, { theme });
  } catch (ex) {
  }
  return {
    prompt: prompt_res[0],
    words: words_res,
    grammar: gram
  };
}
export {
  AddUser as A,
  CreateAdmin as C,
  DeleteUser as D,
  GetPrompt as G,
  SetSQL as S,
  UpdateLesson as U,
  GetGroups as a,
  UpdateWords as b,
  UpdateListen as c,
  UpdateDialog as d
};
