import md5 from 'md5';
import { getLevels, SendEmail } from './db.ts';
import postgres from 'postgres';
import type { Sql } from 'postgres';

let sql: Sql;

import pkg_l from 'lodash';
const { find, remove, findIndex, difference } = pkg_l;

import { sql_st } from '$lib/stores.ts';


sql_st.subscribe((data: Sql) => {
  sql = data;
});

const conStr = {
  connectionStringSupabase:
    'postgresql://postgres.abzyzzvokjdnwgjbitga:NissanPathfinder@386/aws-0-eu-central-1.pooler.supabase.com:5432',
};

export async function CreatePool_(resolve: (value: Sql | PromiseLike<Sql>) => void): Promise<void> {
  sql_st(postgres(conStr.connectionStringSupabase, {
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    username: 'postgres.abzyzzvokjdnwgjbitga',
    password: 'NissanPathfinder@386',
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  }));
  resolve(sql);
}

const conStrNeon = {
  connectionString:
    'postgresql://nedooleg:nHLhfQB0WS5Y@ep-polished-bush-a2n4g5y9-pooler.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require',
};

export async function CreatePool_neon(): Promise<void> {
  sql_st.set(postgres(conStrNeon.connectionString, {
    host: 'ep-polished-bush-a2n4g5y9-pooler.eu-central-1.aws.neon.tech',
    port: 5432,
    database: 'neondb',
    username: 'nedooleg',
    password: 'nHLhfQB0WS5Y',
  }));
}

interface AdminParams {
  name: string;
  email: string;
  psw: string;
  lang: string;
}

export async function CreateAdmin(par: AdminParams) {
  try {
    const res = await sql`INSERT INTO admins
      (name , email, operator, psw, lang)
      VALUES(${par.name},${par.email},${md5(par.email)},${md5(par.psw)},${par.lang})
      ON CONFLICT ( email)
      DO NOTHING`;

    return {
      name: par.name,
      email: par.email,
      operator: md5(par.email),
      psw: md5(par.psw),
      lang: par.lang,
    };
  } catch (ex) {
    console.log(ex);
  }
}

interface GroupParams {
  abonent: string;
  psw: string;
}

export async function GetGroups(par: GroupParams) {
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

interface DeleteUserParams {
  operator: string;
  abonent: string;
}

export async function DeleteUser(par: DeleteUserParams) {
  let resp;
  try {
    resp = await sql`UPDATE operators SET "group"='public', abonent='public' 
    WHERE operator=${par.operator} AND abonent=${par.abonent}`;
  } catch (ex) {
    console.log(ex);
  }
  return { resp };
}

interface AddUserParams {
  func:string;
  class_name: string;
  role: string;
  email: string;
  abonent: string;
  name: string;
  lang: string;
}

export async function AddUser(q: AddUserParams) {
  try {
    const operator = md5(q.email);
    const resp = await sql`INSERT INTO operators
      ("group", role, operator , email, abonent , name, lang )
      VALUES(${q.class_name}, ${q.role},${operator}, ${q.email}, ${q.abonent}, ${q.name}, ${q.lang})
      ON CONFLICT (operator, abonent)
      DO NOTHING`;
    if (resp.count > 0) {
      SendEmail({ send_email: q.email, abonent: q.abonent, lang: q.lang, name: q.name });
    }
    return { resp };
  } catch (ex) {
    return JSON.stringify({ func: q.func, resp: ex });
  }
}

interface LessonParams {
  func:string;
  owner: string;
  level: string;
  data: string;
  lang: string;
  levels: string[];
}

export async function UpdateLesson(q: LessonParams) {
  try {
    const levels = await getLevels(q.owner);
    levels.map((item) => {
      if (q.levels.indexOf(item) === -1) removeModule(item);
    });

    const res = await sql`
      INSERT INTO lessons
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

async function removeModule(item: string) {
  return await sql`DELETE FROM lessons WHERE level=${item}`;
}

interface Query {
  new_name?: string;
  data?: any;
  owner: string;
  html?: string;
  level?: string;
  lang?: string;
  func?: string;
  context?: string;
  operator?: string;
}

export async function UpdateDialog(q: Query) {
  try {
    const res = await sql`
      INSERT INTO dialogs
        (name, dialog, owner, html, level, timestamp)
      VALUES
        (${q.new_name}, ${q.data}, ${q.owner}, ${q.data?.html || ''}, ${q.level}, NOW())
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

export async function UpdateBricks(q: Query) {
  try {
    const res = await sql`
      INSERT INTO bricks
        (name, owner, html, level, timestamp)
      VALUES
        (${q.new_name}, ${q.owner}, ${q.html || ''}, ${q.level}, NOW())
      ON CONFLICT (name, owner, level)
      DO UPDATE SET
        name = EXCLUDED.name,
        html = EXCLUDED.html,
        timestamp = NOW()`;
    return { res };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}

export async function UpdateListen(q: Query) {
  try {
    const res = await sql`
      INSERT INTO listen
        (owner, name, data, lang, timestamp)
      VALUES
        (${q.owner}, ${q.new_name}, ${q.data}, ${q.lang}, NOW())
      ON CONFLICT (name, lang, owner)
      DO UPDATE SET
        data = EXCLUDED.data,
        timestamp = NOW()`;
    return { res };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}

export async function UpdateWords(q: Query) {
  try {
    const res = await sql`
      INSERT INTO word
        (name, data, owner, level, context, timestamp)
      VALUES
        (${q.new_name}, ${q.data}, ${q.owner}, ${q.level}, ${q.context}, NOW())
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

export async function GetPrompt(
  prompt: string = '',
  quiz_name: string = '',
  owner: string = '',
  level: string = ''
) {
  let prompt_res: any, words_res: any, gram_res: any, gram: any, context: any;
  try {
    if (prompt) {
      prompt_res = await sql`SELECT * FROM prompts WHERE name=${prompt}`;
    }
    if (quiz_name) {
      words_res = await sql`SELECT * FROM word WHERE name=${quiz_name}`;
    }
    if (owner && level) {
      gram_res = await sql`SELECT * FROM grammar WHERE owner=${owner} AND level=${level}`;
      if (gram_res[0]) {
        gram = find(gram_res[0].data, { theme: quiz_name });
      }
      context = await sql`SELECT html FROM bricks WHERE owner=${owner} AND level=${level} AND name=${quiz_name}`;
    }
  } catch (ex) {
    console.log(JSON.stringify({ res: ex }));
  }
  return {
    prompt: prompt_res?.[0],
    words: words_res,
    grammar: gram,
    context: context,
  };
}

export async function GetLesson(q: Query) {
  try {
    let res: any = '';
    if (q.operator !== q.owner) {
      res = await sql`
        SELECT lessons.data, lessons.level, lessons.lang 
        FROM lessons
        JOIN operators ON (operators.operator = ${q.operator} AND operators.abonent=${q.owner})
        JOIN groups ON (groups.name = operators.group AND groups.level = lessons.level)
        WHERE groups.owner=${q.owner} AND lessons.owner=${q.owner}
        ORDER BY level DESC`;
    } else if (q.level) {
      res = await sql`
        SELECT data, level, lang 
        FROM lessons 
        WHERE owner=${q.owner} AND level=${q.level} 
        ORDER BY level DESC`;
    } else {
      res = await sql`
        SELECT data, level, lang 
        FROM lessons 
        WHERE owner=${q.owner} 
        ORDER BY level DESC`;
    }

    const levels = await getLevels(q.owner);

    const les = find(res, { level: q.level });

    const lang = res[0]?.lang;

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
      data: les ? les.data : res[0]?.data,
      lang: les?.lang ? les.lang : res[0]?.lang,
      level: les?.level ? les.level : res[0]?.level,
      levels: levels,
      news: news,
      context_news: context_news,
    };
  } catch (ex) {
    return JSON.stringify({ func: q.func, res: ex });
  }
}

interface GetDialogQuery {
  name: string;
  owner: string;
  level: string;
  func: string;  // Name of the function (used in error reporting)
}

interface Dialog {
  id: string;
  name: string;
  owner: string;
  level: string;
  brick?: string; // Optional, to store the HTML brick
  context?: string; // Optional, to store the context data
}

export async function GetDialog(q: GetDialogQuery): Promise<Dialog | string> {
  try {
    // Fetch dialog data
    const dialog = await sql<Dialog[]>`
      SELECT * 
      FROM dialogs
      WHERE name = ${q.name} 
        AND owner = ${q.owner} 
        AND level = ${q.level}
    `;

    // Fetch brick data (HTML content)
    const bricks = await sql<{ html: string }[]>`
      SELECT html, prompt_type 
      FROM bricks
      WHERE name = ${q.name} 
        AND owner = ${q.owner} 
        AND level = ${q.level}
    `;

    // Fetch context data (context and prompt_type)
    const context = await sql<Context[]>`
      SELECT data, prompt_type 
      FROM context
      WHERE name = ${q.name}
    `;

    // Check if dialog exists and add brick and context data
    if (!dialog[0]) {
      dialog[0] = {}
    }

    dialog[0].brick = bricks[0]?.html || ''; // Add brick HTML if available
    dialog[0].context = context[0] || ''; // Add context data if available
  

    return dialog[0] || 'Dialog not found'; // Return the first dialog or a message if not found
  } catch (ex) {
    console.error('Error in GetDialog:', ex); // Log the error for debugging
    return JSON.stringify({ func: q.func, res: ex }); // Return structured error response
  }
}


