import pkg from 'lodash';
const { find, remove, findIndex, difference } = pkg;

import { Translate } from '../../routes/translate/Translate'

import md5 from 'md5';
import { writable } from 'svelte/store';



// import { tarifs } from './tarifs.json';

import postgres from 'postgres';

import {sql_st} from '$lib/js/stores.js'

let sql;

sql_st.subscribe((data)=>{
  sql = data;
})

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

import { redirect } from '@sveltejs/kit';
import Email from './email.js';

let conStr = {
  connectionStringSupabase:
    'postgresql://postgres.abzyzzvokjdnwgjbitga:NissanPathfinder@386/aws-0-eu-central-1.pooler.supabase.com:5432',
};

// export async function CreatePool_(resolve) {
//   sql = postgres(conStr.connectionStringSupabase, {
//     host: 'aws-0-eu-central-1.pooler.supabase.com', // Postgres ip address[s] or domain name[s]
//     port: 5432, // Postgres server port[s]
//     database: 'postgres', // Name of database to connect to
//     username: 'postgres.abzyzzvokjdnwgjbitga', // Username of database user
//     password: 'NissanPathfinder@386', // Password of database user
//     idle_timeout: 20,
//     max_lifetime: 60 * 30,
//   });
//   resolve(sql);
// }

let conStrNeon = {
  connectionString:
    'postgresql://nedooleg:nHLhfQB0WS5Y@ep-polished-bush-a2n4g5y9-pooler.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require',
};

export async function CreatePool_render() {
  sql_st.set(postgres(conStrNeon.connectionString, {
    host: 'dpg-ctdjkkjv2p9s73c6iua0-a.frankfurt-postgres.render.com', // Postgres ip address[s] or domain name[s]
    port: 5432, // Postgres server port[s]
    database: 'kolmit_jzl1', // Name of database to connect to
    username: 'kolmit_jzl1_user', // Username of database user
    password: 'ncEr4gySWNJmCIUyahHROsST2gny0Mki', // Password of database user
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  }));

}

export async function CreatePool_neon() {
  sql_st.set(postgres(conStrNeon.connectionString, {
    host: 'ep-polished-bush-a2n4g5y9-pooler.eu-central-1.aws.neon.tech', // Postgres ip address[s] or domain name[s]
    port: 5432, // Postgres server port[s]
    database: 'neondb', // Name of database to connect to
    username: 'nedooleg', // Username of database user
    password: 'nHLhfQB0WS5Y', // Password of database user
  }));

}


function getHash(par) {
  return md5(par + par);
}

export async function SendEmail(q) {
  let operator = new Email();
  const { abonent, send_email: mail, lang ,name} = q;

  const helpLink = `https://kolmit.onrender.com/html/howto.${lang}.html`

  const link = `https://kolmit.onrender.com/?abonent=${abonent}&user=${mail}`;

  // Локализация текста письма
  const subject =  await  Translate('Приглашение присоединиться к приложению Kolmit','ru', lang);

  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #007BFF;">${await Translate('Здравствуйте', 'ru', lang)} ${name}!</h2>
    ${await Translate(
    `<p>Спасибо, что выбрали <strong>Kolmit</strong> для изучения иностранных языков! Мы рады приветствовать вас в нашем сообществе.</p>
    <p>Для входа в приложение используйте следующую ссылку:</p>`, 'ru', lang)}
    <p style="text-align: center;">
      <a href="${link}" style="background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        👉 ${await Translate('Войти в Kolmit', 'ru', lang)}
      </a>
    </p>
    ${await Translate('<p>Для получения помощи по работе с приложением ознакомьтесь с инструкцией по ссылке ниже:</p>', 'ru', lang)}
    <p style="text-align: center;">
      <a href="${helpLink}" style="color: #007BFF; text-decoration: underline;">
        📖 ${await Translate('Инструкция по работе с приложением', 'ru', lang)}
      </a>
    </p>
    ${await Translate(`<p>Удачи в изучении языков и увлекательного обучения!</p><p>С уважением,</p>`,'ru',lang)}
   
    <p><strong>${await Translate('Команда Kolmit</strong></p>', 'ru', lang)}
    <p style="font-size: 0.9em; color: #666;">kolmit.be@gmail.com</p>
  </div>
`;


  // Отправка письма
  operator.SendMail(
    mail,
    subject,
    html,
    (result) => {
        console.log('Письмо успешно отправлено:', result);
    }
  );
}


export function SendEmailTodayPublished(q) {
  let operator = new Email();
  const mail = q.send_email;
  const hash = getHash(mail);
  let html = q.html;
  let head = q.head;

  operator.SendMail(
    mail,    
    head,
    html,
    (result) => {
      console.log();
    }
  );
}

export async function CreateOperator(par) {
  try {
    // if (par.abonent === par.email) return false;
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
      lang: par.lang,
    };
  } catch (er) {
    console.log(er);
  }
}

export async function CreateSession(oper, suid) {
  let res = await sql` 
    SELECT create_session(${oper}, ${suid})
  `;

}

async function updateOper(q) {
  try {
    let res = await sql`UPDATE operators SET
		psw = ${q.psw}, picture=${q.picture}
		WHERE  operator=${q.email} AND abonent=${q.abonent}`;
  } catch (ex) {}
}

async function updateUsers(users, q) {
  let usrs = users;

  try {
    let res = await sql`UPDATE users SET
		users=${usrs}, 
		last=CURRENT_TIMESTAMP, 
		editor=${q.abonent || q.email}
		WHERE  operator=${q.abonent || q.email}`;
  } catch (ex) {}
  return JSON.stringify({ func: q.func, dep: users[0] });
}

export async function GetGroup(par) {
  //всех кто в группе, кроме себя
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
         const timestamp = new Date().toISOString(); // Получаем текущую метку времени
         CreateSession(par.operator, md5(par.operator+timestamp));
       }

  const oper = await sql`
			SELECT 
			"group", abonent, role, operator, picture, lang, name
			FROM operators
			WHERE operators.abonent=${par.abonent} AND operator=${par.operator}
      `;

  return { group, oper };
}

export async function GetUsersEmail(owner, level) {
  const group = await sql`
    SELECT 
    name
    FROM groups
    WHERE owner=${owner} AND level=${level}
  `;
  
  const emails = await sql`
    SELECT 
    email, name, lang
    FROM operators
    WHERE "group"=${group[0].name}
    `;
  return emails;
}

export async function GetUsers(par) {
  let operators,
    admin = '';

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

export async function CheckOperator(q) {
  let result;

  // console.log(sql);

  if (q.psw && q.operator) {
    try {
      await sql`
			INSERT INTO operators (psw, operator, abonent,  name) VALUES(${q.psw}, ${q.operator}, 
			, ${q.name})`;
    } catch (ex) {}
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
          check: true,
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

async function insertUsers(users, q) {
  let usrs = JSON.stringify(users);
  try {
    let res = await sql`
		INSERT INTO users
		(operator, users, last, editor) VALUES (${q.email},
		${usrs}, CURRENT_TIMESTAMP, ${q.email})`;
  } catch (ex) {}

  return JSON.stringify({ func: q.func, res: res });
}

export async function AddOperator(q) {
  let res = await sql`
	SELECT users 
	FROM users 
	INNER JOIN operators ON (operators.abonent = users.operator)
	WHERE operators.abonent=${q.abonent}`;

  let users = {};
  if (res[0]) {
    users = res[0].users;
  }

  try {
    let res = await sql`UPDATE users SET
		users=${users}, 
		last=CURRENT_TIMESTAMP, 
		editor=${q.email}
		WHERE  operator=${q.abonent}`;
  } catch (ex) {
    await sql`ROLLBACK;`;
    return JSON.stringify({ func: q.func, res: ex });
  }
  try {
    let res = await sql`INSERT INTO operators
		(operator, abonent, psw) VALUES (${q.email}, ${q.abonent}, ${q.psw})`;
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }

  return JSON.stringify({ func: q.func, dep: users });
}

export async function ChangeDep(q) {
  let res = await sql`SELECT users 
	FROM operators as oper
	INNER JOIN users as usr ON (operators.abonent = users.operator)
	WHERE oper.abonent=${q.abonent} AND oper.operator=${
    q.operator || q.operator
  } AND oper.psw=${q.psw}`;

  if (res[0]) {
    let users = JSON.parse(res[0].users);
    let ind = findIndex(users, { id: String(q.dep.id) });
    if (ind === -1) return;
    users[ind] = q.dep;

    return updateUsers(users, q);
  }
}

export async function AddDep(q) {
  if (q.abonent) {
    let res = await sql`SELECT *, (SELECT users FROM users WHERE operator=${
      q.abonent || q.operator
    }) as users
		FROM  operators as oper
		WHERE oper.operator=${q.abonent || q.operator}  AND abonent=${
      q.abonent
    } AND psw=${q.psw}
		`;
    let users = [];
    if (res[0]) {
      users = JSON.parse(res[0].users);
      let ind = findIndex(users, { id: String(q.id) });
      if (ind === -1) return;
      users[q.id + 1] = {
        id: String(q.id + 1),
        alias: '',
        admin: {
          desc: '',
          name: '',
          role: 'admin',
          email: '',
          picture: { user_pic },
        },
        staff: [],
      };
      return updateUsers(users, q);
    }
    return rows[0];
  }
}

export async function RemDep(q) {
  let res = sql`SELECT users 
		FROM operators as oper
		INNER JOIN users as usr ON (operators.abonent = users.operator)
		WHERE oper.operator=${q.operator || q.abonent} AND oper.psw=${q.psw}`;

  if (res[0]) {
    let users = JSON.parse(res[0].users);
    remove(users, (n) => {
      return n.id === q.dep;
    });
    return updateUsers(users, q);
  }
}

export async function ChangeOperator(q) {
  const res = await sql`SELECT *, (SELECT users FROM users WHERE operator=${
    q.abonent || q.operator
  }) as users 
		FROM  operators as oper 
		WHERE oper.operator=${q.abonent || q.operator}  AND abonent=${
    q.abonent
  } AND psw=${q.psw}`;

  if (res[0]) {
    try {
      let users = [];
      users = JSON.parse(res[0].users);
      let dep = find(users, { id: q.dep_id });
      let user;
      if (q.data.role === 'admin') {
        user = dep['admin'];
      } else {
        let ind = findIndex(dep.staff, { id: q.data.id });
        user = dep.staff[ind];
      }

      if (q.data.alias) user.alias = q.data.alias;
      // if (q.data.picture) user.picture = q.data.picture;
      if (q.data.email) {
        if (q.data.email !== user.email) SendEmail(q, q.data.email);
        user.email = q.data.email;
      }
      if (q.data.name) user.name = q.data.name;
      if (q.data.desc) user.desc = q.data.desc;
    } catch (ex) {}

    return updateUsers(users, q);
  }
}

export async function RemoveOperator(q) {
  const res = sql`SELECT *, (SELECT users FROM users WHERE operator=?) as users ' +
		'FROM  operators as oper 
		'WHERE oper.operator=${q.abonent || q.operator}  AND abonent=${
    q.abonent
  } AND psw=${q.psw}`;
  try {
    let users = [];
    if (res[0]) {
      users = JSON.parse(res[0].users);
      let dep = find(users, { id: q.dep });
      let ind = findIndex(dep.staff, { id: q.id });
      dep.staff.splice(ind, 1);

      return updateUsers(users, q);
    }
  } catch (ex) {
    return;
  }
}

export async function GetListen(q) {
  try {
    let res = await sql`SELECT * FROM listen
		WHERE name= ${q.name} AND lang=${q.lang}`;
    //debugger;
    return { data: res[0].data, html: res[0].html};
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}

export async function GetWords(q) {
  try {
    let res = await sql`SELECT data, subscribe  FROM word
		WHERE name=${q.name} AND owner=${q.owner} AND level=${q.level}`;
    return res[0];
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}

export async function GetBricks(q) { 
  try {
    let contextResult = await sql`
      SELECT c.name, c.data
      FROM context c
      ${q.name ? sql`WHERE c.name = ${q.name}` : sql``}
    `;

    let bricksResult = await sql`
      SELECT b.*
      FROM bricks b
      WHERE b.owner = ${q.owner} 
        AND b.level = ${q.level} 
        AND b.theme = ${q.theme}
        ${q.name ? sql`AND b.name = ${q.name}` : sql``}
    `;

    // Если bricksResult пустой, инициализируем его как пустой массив
    if (!bricksResult) {
      bricksResult = [];
    }

    // Если есть contextResult и bricksResult, добавляем контекст в первый элемент
    if (contextResult[0] && bricksResult[0]) {
      bricksResult[0].context = contextResult[0].data;
    }

    return q.name ? bricksResult[0] : bricksResult;
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}

export async function GetDialog(q) {
  try {
    let dialog = await sql`SELECT * FROM dialogs
		WHERE name=${q.name} AND owner=${q.owner} AND level=${q.level}`;

    let bricks = await sql`SELECT html FROM bricks
		WHERE name=${q.name} AND owner=${q.owner} AND level=${q.level}`;

    let context = await sql`SELECT data, prompt_type FROM context
		WHERE name=${q.name}`;

    dialog[0].brick = bricks[0]?bricks[0].html:'';
    dialog[0].context = context[0]?context[0].data:'';

    return  dialog[0];
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}

export async function GetPrompt(name) {
  let prompt = await sql`SELECT system, user FROM prompts
		WHERE name=${name}`;
  return {
    prompt: prompt[0],
  };
}

export async function getLevels(owner) {
  const levels = await sql`SELECT level FROM lessons WHERE owner=${owner}`;

  return levels.map((item) => {
    return item.level;
  });
}

export async function GetLessonsByDate() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Начало текущего дня

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Конец текущего дня

  return await sql`SELECT owner, data, level, lang 
    FROM lessons 
    WHERE timestamp BETWEEN ${startOfDay} AND ${endOfDay} 
    ORDER BY level DESC`;
}

export async function GetLesson(q) {
  try {
    let res = '';
    if (q.operator !== q.owner) {
      res = await sql`
      SELECT lessons.data, lessons.level, lessons.lang 
        FROM lessons
        JOIN operators ON (operators.operator = ${q.operator} and operators.abonent=${q.owner})
        JOIN groups ON (groups.name = operators.group and groups.level=lessons.level)
        WHERE  groups.owner=${q.owner} AND lessons.owner=${q.owner}
        ORDER BY level desc`;
      
     } else if (q.level) {
      res =
        await sql`SELECT data, level, lang FROM lessons WHERE owner=${q.owner} AND level=${q.level}  ORDER BY level desc`;
    } else {      
      res =
        await sql`SELECT data, level, lang FROM lessons WHERE owner=${q.owner}  ORDER BY level desc`;      
    }
    
    //debugger;
    const levels = await getLevels(q.owner);

    const les = find(res, {level:q.level});

    const lang = res[0].lang; // предполагаем, что это значение приходит как 'nl', 'en' и т.п.

    const news = await sql`
      SELECT 
        json_build_object(${lang}::text, "name") AS "name",  
        MAX((EXTRACT(EPOCH FROM "timestamp") * 1000)::BIGINT) AS "published", 
        "type"
      FROM (
        SELECT "name", "timestamp", 'dialog' AS "type" 
        FROM public.dialogs 
        WHERE "type" = 'news' AND "timestamp" >= DATE_TRUNC('month', CURRENT_DATE)

        UNION

        SELECT "name", "timestamp", 'bricks' AS "type" 
        FROM public.bricks 
        WHERE "type" = 'news' AND "timestamp" >= DATE_TRUNC('month', CURRENT_DATE)
        AND "html" <>''
      ) AS combined
      GROUP BY "name", "type"
      ORDER BY "published" ASC;
    `;

    
    const context_news = await sql`
      SELECT 
        json_build_object(quote_literal(${lang}), "name") AS "name", 
        "data", 
        MAX((EXTRACT(EPOCH FROM "timestamp") * 1000)::BIGINT) AS "published", 
        "type"
      FROM public.context 
      WHERE "type" = 'news' 
        AND "timestamp" >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY "name", "data", "type"
      ORDER BY "published" ASC;
    `;

    return {
      data: les?les.data:res[0].data,
      lang: les?.lang?les.lang:res[0].lang,
      level: les?.level?les.level:res[0].level,
      levels: levels,
      news: news,
      context_news:context_news
    };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}


export async function GetNews(q) {
  try {
    let res = '';

    const news = await sql`
      SELECT 
        json_build_object(${lang}::text, "name") AS "name",  
        MAX((EXTRACT(EPOCH FROM "timestamp") * 1000)::BIGINT) AS "published", 
        "type"
      FROM (
        SELECT "name", "timestamp", 'dialog' AS "type" 
        FROM public.dialogs 
        WHERE "type" = 'news' AND "timestamp" >= DATE_TRUNC('month', CURRENT_DATE)

        UNION

        SELECT "name", "timestamp", 'bricks' AS "type" 
        FROM public.bricks 
        WHERE "type" = 'news' AND "timestamp" >= DATE_TRUNC('month', CURRENT_DATE)
      ) AS combined
      GROUP BY "name", "type"
      ORDER BY "published" ASC;
    `;

    
    const context_news = await sql`
      SELECT 
        json_build_object(quote_literal(${lang}), "name") AS "name", 
        "data", 
        MAX((EXTRACT(EPOCH FROM "timestamp") * 1000)::BIGINT) AS "published", 
        "type"
      FROM public.context 
      WHERE "type" = 'news' 
        AND "timestamp" >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY "name", "data", "type"
      ORDER BY "published" ASC;
    `;

    return {
      news: news,
      context_news:context_news
    };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}

export async function UpdateQuizUsers(q) {
  let res;
  try {
    // Получаем текущие подписки в формате JSON

    if (q.type == 'dialog')
      res =
        await sql`SELECT subscribe FROM dialogs WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
    else if (q.type == 'word')
      res =
        await sql`SELECT subscribe FROM word WHERE name = ${q.quiz} AND owner = ${q.abonent}`;

    // Извлекаем подписки, если пусто - создаем пустой массив
    let qu = res[0]?.subscribe || [];

    // Если нужно добавить новую подписку
    if (q.add) {
      qu.push(q.add);
    }
    // Если нужно удалить подписку
    else if (q.rem) {
      let index = qu.indexOf(q.rem); // находим индекс элемента
      if (index > -1) {
        // проверяем, что элемент найден
        qu.splice(index, 1); // удаляем элемент
      }
    }

    // Обновляем базу данных, преобразуя массив в JSON
    if (q.type == 'dialog')
      res = await sql`UPDATE dialogs 
                    SET subscribe = ${sql.json(
                      qu
                    )} -- используем JSON для PostgreSQL
                    WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
    else if (q.type == 'word')
      res = await sql`UPDATE word 
                    SET subscribe = ${sql.json(
                      qu
                    )} -- используем JSON для PostgreSQL
                    WHERE name = ${q.quiz} AND owner = ${q.abonent}`;

    return qu;
  } catch (ex) {
    console.log(ex);
    throw ex; // чтобы ошибка могла быть обработана выше
  }
}

export async function GetDict(q) {
  try {
    let res = await sql`SELECT words FROM dicts
		WHERE type=${q.type} AND level= ${q.level}  AND owner=${q.owner}`;
    if (res[0]) return res[0].words;
    else return res;
  } catch (ex) {
    // debugger;
    return JSON.stringify({ func: q.func, res: ex });
  }
}

export async function WriteSpeech(q) {
  try {
    await sql.begin(async (tx) => {
      await tx`INSERT INTO speech (lang, key, text, translate)
                VALUES (${q.lang}, ${q.key}, ${q.text}, ${q.translate})
                ON CONFLICT (key, lang) 
                DO UPDATE SET 
                  lang=EXCLUDED.lang,
                  translate = EXCLUDED.translate`;
    });
    return { success: true, message: "Data written successfully." };
  } catch (ex) {
    console.error("Error writing speech:", ex);
    return { success: false, message: "Failed to write data.", error: ex };
  }
}


export async function ReadSpeech(q) {
  try {
    let res = await sql`SELECT translate FROM speech
                        WHERE key = ${q.key} AND lang = ${q.lang}`;
    if (res[0]) {
      return res[0];
    } else {
      return null; // Явно возвращаем null, если записи не найдены
    }
  } catch (ex) {
    console.error('Database query failed:', ex); // Логируем ошибку
    return { error: 'Database query failed' }; // Возвращаем объект ошибки
  }
}

