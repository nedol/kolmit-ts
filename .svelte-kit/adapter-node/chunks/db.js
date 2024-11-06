import "moment";
import pkg from "lodash";
import md5 from "md5";
import postgres from "postgres";
import "./index.js";
import nodemailer from "nodemailer";
class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      // upgrade later with STARTTLS
      auth: {
        user: "nedooleg@gmail.com",
        // pass: 'NissanPathfinder@720'
        pass: "gytn jkgk ucll koig"
      }
    });
  }
  SendMail(from, to, subj, html, cb) {
    let mailOptions = {
      from,
      //from, //'youremail@gmail.com',
      to,
      //'myfriend@yahoo.com',
      subject: subj,
      html
    };
    this.transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        cb({ err: error });
        console.log(error);
      } else {
        cb("Email sent: " + info.response);
        console.log("Email sent: " + info.response);
      }
    });
  }
}
const { find, remove, findIndex, difference } = pkg;
let sql;
process.env;
let conStrNeon = {
  connectionString: "postgresql://nedooleg:nHLhfQB0WS5Y@ep-polished-bush-a2n4g5y9-pooler.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require"
};
async function CreatePool(resolve) {
  sql = postgres(conStrNeon.connectionString, {
    host: "ep-polished-bush-a2n4g5y9-pooler.eu-central-1.aws.neon.tech",
    // Postgres ip address[s] or domain name[s]
    port: 5432,
    // Postgres server port[s]
    database: "neondb",
    // Name of database to connect to
    username: "nedooleg",
    // Username of database user
    password: "nHLhfQB0WS5Y"
    // Password of database user
  });
  resolve(sql);
}
function getHash(par) {
  return md5(par + par);
}
function SendEmail(q, new_email) {
  let operator = new Email();
  const abonent = q.abonent;
  const mail = q.send_email;
  getHash(mail);
  let html = `<a href='https://kolmit.onrender.com/?abonent=${abonent}&user=${mail}'>` + {
    ru: "<h1>Присоединиться к сети Kolmit:</h1></a>",
    en: "<h1>Join Kolmit network:</h1></a>",
    fr: "<h1>Rejoindre le réseau Kolmit:</h1></a>"
  }[q.lang];
  operator.SendMail(
    `nedooleg@gmail.com`,
    mail,
    {
      ru: "Новый пользователь сети Колмит",
      en: "New Kolmit network user",
      fr: "Le nouvel opérateur de Kolmi"
    }[q.lang],
    html,
    (result) => {
      console.log();
    }
  );
}
async function CreateOperator(par) {
  try {
    let res = await sql` 
		UPDATE operators 
		SET
		name = ${par.name},
    email = ${par.email},
		operator = ${md5(par.email)}, 
		psw = ${md5(par.psw)}, 
		picture = ${par.picture} 
		WHERE email = ${par.email} AND abonent=${par.abonent}
		`;
    return {
      operator: md5(par.email),
      name: par.name,
      email: par.email,
      psw: md5(par.psw),
      lang: par.lang
    };
  } catch (er) {
    console.log(er);
  }
}
async function CreateSession(oper, suid) {
  await sql` 
    SELECT create_session(${oper}, ${suid})
  `;
}
async function GetGroup(par) {
  const group = await sql`
			SELECT "group", abonent, role, operator, picture, lang, name
      	FROM operators
        WHERE operators.abonent=${par.abonent} 
        AND  operators.operator=${par.operator}
        AND operators.group=(
        SELECT "group" FROM operators
        WHERE operators.abonent=${par.abonent} 
        AND operator=${par.operator} AND psw=${par.psw}
      )`;
  if (group) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    CreateSession(par.operator, md5(par.operator + timestamp));
  }
  const oper = await sql`
			SELECT 
			"group", abonent, role, operator, picture, lang, name
			FROM operators
			WHERE operators.abonent=${par.abonent} AND operator=${par.operator}
      `;
  return { group, oper };
}
async function GetUsers(par) {
  let operators, admin = "";
  try {
    if (par.abonent) {
      operators = await sql`
			SELECT 
			*,
			operator as email
			FROM operators
			WHERE role<>'admin' AND operators.abonent=${par.abonent} AND
      operators.group = (
          SELECT operators.group
          FROM operators
          WHERE operators.operator=${par.operator} AND operators.abonent=${par.abonent} 
      )
      `;
      admin = await sql`
			SELECT 
			*,
			operator as email
			FROM operators
			WHERE role='admin' AND operators.abonent=${par.abonent}
			`;
    }
  } catch (ex) {
    console.log();
  }
  return { operators, admin };
}
async function CheckOperator(q) {
  let result;
  if (q.psw && q.operator) {
    try {
      await sql`
			INSERT INTO operators (psw, operator, abonent,  name) VALUES(${q.psw}, ${q.operator}, 
			, ${q.name})`;
    } catch (ex) {
    }
  }
  if (q.operator) {
    if (q.abonent) {
      result = await sql`
			SELECT * FROM  operators WHERE operator=${q.operator} AND abonent=${q.abonent} AND psw=${q.psw}`;
    } else {
      result = result;
      await sql`
			SELECT * FROM  operators WHERE operator=${q.operator} AND abonent=${q.abonent} AND psw=${q.psw}`;
    }
    result = result;
    if (result[0]) {
      if (q.psw == result[0].psw) {
        return {
          func: q.func,
          check: true
        };
      } else {
        return JSON.stringify({ func: q.func, check: false });
      }
    } else {
      return JSON.stringify({ func: q.func, check: false });
    }
  } else {
    result = await sql`
		SELECT * FROM  operators WHERE operator=${q.operator}`;
    return result;
  }
}
async function GetListen(q) {
  try {
    let res = await sql`SELECT data FROM listen
		WHERE name= ${q.name} AND lang=${q.lang}`;
    return { data: res[0].data };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}
async function GetWords(q) {
  try {
    let res = await sql`SELECT data, context, subscribe  FROM word
		WHERE name=${q.name} AND owner=${q.owner} AND level=${q.level}`;
    return res[0];
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}
async function GetDialog(q) {
  try {
    let res = await sql`SELECT dialog, html, subscribe FROM dialogs
		WHERE name=${q.name} AND owner=${q.owner} AND level=${q.level}`;
    return {
      dialog: res[0].dialog,
      html: res[0].html || "",
      subscribe: res[0].subscribe
    };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}
async function GetPrompt(name) {
  let prompt = await sql`SELECT system, user FROM prompts
		WHERE name=${name}`;
  return {
    prompt: prompt[0]
  };
}
async function getLevels(owner) {
  const levels = await sql`SELECT level FROM lessons WHERE owner=${owner}`;
  return levels.map((item) => {
    return item.level;
  });
}
async function GetLesson(q) {
  try {
    let res = "";
    if (q.operator !== q.owner) {
      res = await sql`
      SELECT lessons.data, lessons.level, lessons.lang 
        FROM lessons
        JOIN operators ON (operators.operator = ${q.operator} and operators.abonent=${q.owner})
        JOIN groups ON (groups.name = operators.group and groups.level=lessons.level)
        WHERE  groups.owner=${q.owner} AND lessons.owner=${q.owner}
        ORDER BY level desc`;
    } else if (q.level) {
      res = await sql`SELECT data, level, lang FROM lessons WHERE owner=${q.owner} AND level=${q.level}  ORDER BY level desc`;
    } else {
      res = await sql`SELECT data, level, lang FROM lessons WHERE owner=${q.owner}  ORDER BY level desc`;
    }
    const levels = await getLevels(q.owner);
    const les = find(res, { level: q.level });
    return {
      data: les ? les.data : res[0].data,
      lang: les?.lang ? les.lang : res[0].lang,
      level: les?.level ? les.level : res[0].level,
      levels
    };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}
async function UpdateQuizUsers(q) {
  let res;
  try {
    if (q.type == "dialog")
      res = await sql`SELECT subscribe FROM dialogs WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
    else if (q.type == "word")
      res = await sql`SELECT subscribe FROM word WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
    let qu = res[0]?.subscribe || [];
    if (q.add) {
      qu.push(q.add);
    } else if (q.rem) {
      let index = qu.indexOf(q.rem);
      if (index > -1) {
        qu.splice(index, 1);
      }
    }
    if (q.type == "dialog")
      res = await sql`UPDATE dialogs 
                    SET subscribe = ${sql.json(
        qu
      )} -- используем JSON для PostgreSQL
                    WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
    else if (q.type == "word")
      res = await sql`UPDATE word 
                    SET subscribe = ${sql.json(
        qu
      )} -- используем JSON для PostgreSQL
                    WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
    return qu;
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
}
async function GetDict(q) {
  try {
    let res = await sql`SELECT words FROM dicts
		WHERE type=${q.type} AND level= ${q.level}  AND owner=${q.owner}`;
    if (res[0])
      return res[0].words;
    else
      return res;
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}
async function WriteSpeech(q) {
  try {
    await sql.begin(async (sql2) => {
      await sql2`INSERT INTO speech (lang, key, text, data, quiz)
                VALUES (${q.lang}, ${q.key}, ${q.text}, ${q.data}, ${q.quiz})
                ON CONFLICT (key) 
                DO UPDATE SET 
                    lang = ${q.lang}, 
                    text = ${q.text}, 
                    data = ${q.data}, 
                    quiz = ${q.quiz}`;
    });
  } catch (ex) {
    console.log();
  }
}
async function ReadSpeech(q) {
  try {
    let res = await sql`SELECT data FROM speech
		WHERE key= ${q.key} AND quiz IS NOT NULL`;
    if (res[0]) {
      return res[0].data;
    }
  } catch (ex) {
    return JSON.stringify("");
  }
}
export {
  CheckOperator as C,
  GetUsers as G,
  ReadSpeech as R,
  SendEmail as S,
  UpdateQuizUsers as U,
  WriteSpeech as W,
  CreateOperator as a,
  GetDict as b,
  GetWords as c,
  GetDialog as d,
  GetLesson as e,
  GetListen as f,
  GetPrompt as g,
  CreatePool as h,
  GetGroup as i,
  getLevels as j
};
