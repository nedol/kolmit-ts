import lodash from 'lodash';
const { find, remove, findIndex } = lodash;
import { Translate } from '../../routes/translate/Translate';
import md5 from 'md5';
import postgres from 'postgres';
import type { Sql } from 'postgres';

let sql: Sql;

import { sql_st } from '$lib/stores.ts';
import { redirect } from '@sveltejs/kit';
import Email from './email.js';

sql_st.subscribe((data) => {
  sql = data;
});

import { config } from 'dotenv';
config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;




const conStrNeon = {
  connectionString:ENDPOINT_ID,
};

export async function CreatePool_neon(): Promise<void> {
  sql_st.set(
    postgres(conStrNeon.connectionString, {
      host: PGHOST,
      port: 5432,
      database: PGDATABASE,
      username: PGUSER,
      password: PGPASSWORD,
    })
  );
}

function getHash(par: string): string {
  return md5(par + par);
}

interface EmailParams {
  abonent: string;
  send_email: string;
  lang: string;
  name: string;
}

export async function SendEmail(q: EmailParams): Promise<void> {
  let operator = new Email();
  const { abonent, send_email: mail, lang, name } = q;

  const helpLink = `https://kolmit.onrender.com/html/howto.${lang}.html`;
  const link = `https://kolmit.onrender.com/?abonent=${abonent}&user=${mail}`;

  const subject = await Translate(
    'Приглашение присоединиться к приложению Kolmit',
    'ru',
    lang
  );

  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #007BFF;">${await Translate(
      'Здравствуйте',
      'ru',
      lang
    )} ${name}!</h2>
    ${await Translate(
      `<p>Спасибо, что выбрали <strong>Kolmit</strong> для изучения иностранных языков! Мы рады приветствовать вас в нашем сообществе.</p>
      <p>Для входа в приложение используйте следующую ссылку:</p>`,
      'ru',
      lang
    )}
    <p style="text-align: center;">
      <a href="${link}" style="background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        👉 ${await Translate('Войти в Kolmit', 'ru', lang)}
      </a>
    </p>
    ${await Translate(
      '<p>Для получения помощи по работе с приложением ознакомьтесь с инструкцией по ссылке ниже:</p>',
      'ru',
      lang
    )}
    <p style="text-align: center;">
      <a href="${helpLink}" style="color: #007BFF; text-decoration: underline;">
        📖 ${await Translate(
          'Инструкция по работе с приложением',
          'ru',
          lang
        )}
      </a>
    </p>
    ${await Translate(
      `<p>Удачи в изучении языков и увлекательного обучения!</p><p>С уважением,</p>`,
      'ru',
      lang
    )}
    <p><strong>${await Translate(
      'Команда Kolmit</strong></p>',
      'ru',
      lang
    )}
    <p style="font-size: 0.9em; color: #666;">kolmit.be@gmail.com</p>
  </div>
`;

  operator.SendMail(mail, subject, html, (result) => {
    console.log('Письмо успешно отправлено:', result);
  });
}

export function SendEmailTodayPublished(q: {
  send_email: string;
  html: string;
  head: string;
}): void {
  let operator = new Email();
  const mail = q.send_email;
  const head = q.head;
  const html = q.html;

  operator.SendMail(mail, head, html, (result) => {
    console.log('Письмо успешно отправлено:', result);
  });
}

interface OperatorParams {
  abonent: string;
  name: string;
  email: string;
  psw: string;
  picture: string;
  lang: string;
}

export async function CreateOperator(  par: OperatorParams): Promise<OperatorParams | undefined> {
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
      lang: par.lang,
    };
  } catch (er) {
    console.log(er);
  }
}

export async function CreateSession(
  oper: string,
  suid: string
): Promise<void> {
  await sql`
    SELECT create_session(${oper}, ${suid})
  `;
}

export async function GetLastSession(user_id:string) {
  try {
    const latestSession = await sql`
      SELECT *
      FROM public.sessions
      WHERE user_id=${user_id}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (latestSession.length === 0) {
      console.log('No sessions found.');
      return null;
    }

    return latestSession[0];
  } catch (err) {
    console.error('Error fetching last session:', err);
    return null;
  }
}

export async function GetTodayTotalTokens(user_id:string) {
  try {
    // Получаем текущую дату (без времени)
    const today = new Date().toISOString().split('T')[0];

    // Выполняем SQL-запрос для суммирования total_tokens за сегодня
    const result = await sql`
      SELECT COALESCE(SUM(total_tokens), 0) AS total
      FROM public.sessions
      WHERE user_id=${user_id} AND DATE(created_at) = ${today}
    `;

    // Возвращаем сумму total_tokens за сегодня
    return Number(result[0].total);
  } catch (err) {
    console.error('Error fetching today\'s total tokens:', err);
    return 0; // В случае ошибки возвращаем 0
  }
}

export async function UpdateLastSession(user_id:string, newTotalTokens:number) {
  try {
    const lastSession = await GetLastSession(user_id);

    if (!lastSession) {
      console.log('No session to update.');
      return;
    }

    const result = await sql`
      UPDATE public.sessions
      SET total_tokens = ${newTotalTokens}
      WHERE user_id=${user_id} AND id = ${lastSession.id}
    `;

    console.log(`Updated ${result.count} row(s)`);
  } catch (err) {
    console.error('Error updating session:', err);
  }
}

async function updateUsers(users: any[], q: any): Promise<string> {
  try {
    await sql`
      UPDATE users SET
      users=${users}, 
      last=CURRENT_TIMESTAMP, 
      editor=${q.abonent || q.email}
      WHERE operator=${q.abonent || q.email}
    `;
  } catch (ex) {}
  return JSON.stringify({ func: q.func, dep: users[0] });
}


export async function GetGroup(par: {
  abonent: string;
  operator: string;
  psw: string;
}): Promise<{ group: any; oper: any }> {
  const group = await sql`
    SELECT "group", abonent, role, operator, picture, lang, name, level
    FROM operators
    WHERE operators.abonent=${par.abonent} 
    AND operators.operator=${par.operator}
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
    SELECT "group", abonent, role, operator, picture, lang, name, level
    FROM operators
    WHERE operators.abonent=${par.abonent} AND operator=${par.operator}
  `;

  return { group, oper };
}


interface Query {
  psw?: string;
  operator?: string;
  abonent?: string;
  name?: string;
  func?: string;
  email?: string;
  dep?: any;
  id?: number;
  data?: any;
  level?: string;
  owner?: string;
  theme?: string;
  lang?: string;
}

export async function CheckOperator(q: Query) {
  let result;

  if (q.psw && q.operator) {
    try {
      await sql`INSERT INTO operators (psw, operator, abonent, name) VALUES(${q.psw}, ${q.operator}, ${q.abonent || null}, ${q.name || null})`;
    } catch (ex) {
      console.error('Error in CheckOperator INSERT:', ex);
    }
  }

  if (q.operator) {
    if (q.abonent) {
      result = await sql`SELECT * FROM operators WHERE operator=${q.operator} AND abonent=${q.abonent} AND psw=${q.psw}`;
    } else {
      result = await sql`SELECT * FROM operators WHERE operator=${q.operator}`;
    }

    if (result?.length > 0) {
      if (q.psw === result[0].psw) {
        return { func: q.func, check: true };
      } else {
        return { func: q.func, check: false };
      }
    } else {
      return { func: q.func, check: false };
    }
  }

  return { func: q.func, check: false };
}

interface AddOperatorQuery {
  abonent: string;
  email: string;
  psw: string;
  func: string;
}

interface AddOperatorResponse {
  func: string;
  dep?: string;
  res?: string;
}

export async function AddOperator(q: AddOperatorQuery): Promise<AddOperatorResponse> {
  const client = await sql.begin(); // Start transaction

  try {
    // Query to select the users
    const res = await client<{ users: string }[]>`
      SELECT users
      FROM users
      INNER JOIN operators ON (operators.abonent = users.operator)
      WHERE operators.abonent = ${q.abonent}`;
      
    let users: string = res[0] ? res[0].users : '';

    // Update user information
    await client`
      UPDATE users SET
        users = ${users},
        last = CURRENT_TIMESTAMP,
        editor = ${q.email}
      WHERE operator = ${q.abonent}`;

    // Insert operator details
    await client`
      INSERT INTO operators (operator, abonent, psw)
      VALUES (${q.email}, ${q.abonent}, ${q.psw})`;

    await client.commit(); // Commit the transaction

    return { func: q.func, dep: users }; // Return object directly

  } catch (ex) {
    await client.rollback(); // Rollback transaction in case of error
    return { func: q.func, res: ex instanceof Error ? ex.message : String(ex) }; // Return error message
  }
}


interface ChangeDepQuery {
  abonent: string;
  operator: string;
  psw: string;
  dep: { id: string; [key: string]: any };
}

interface User {
  id: string;
  [key: string]: any;
}

export async function ChangeDep(q: ChangeDepQuery): Promise<void> {
  // Query to find the user data
  const res = await sql<{ users: string }[]>`
    SELECT users
    FROM operators as oper
    INNER JOIN users as usr 
    ON oper.abonent = usr.operator
    WHERE oper.abonent = ${q.abonent} 
      AND oper.operator = ${q.operator} 
      AND oper.psw = ${q.psw}`;

  if (res[0]) {
    // Parse users and find the user to update
    let users: User[] = JSON.parse(res[0].users);
    let ind = findIndex(users, { id: String(q.dep.id) });

    if (ind === -1) {
      // If user not found, return or handle appropriately
      return;
    }

    // Update the user data
    users[ind] = q.dep;

    // Call updateUsers function to persist changes
    return updateUsers(users, q);
  }
}

interface AddDepQuery {
  abonent: string;
  operator: string;
  psw: string;
  id: string;
}

interface RemDepQuery {
  operator: string;
  psw: string;
  dep: string;
}

interface Admin {
  desc: string;
  name: string;
  role: string;
  email: string;
  picture: { user_pic: string };
}

interface User {
  id: string;
  alias: string;
  admin: Admin;
  staff: any[];
}

export async function AddDep(q: AddDepQuery): Promise<void> {
  if (q.abonent) {
    const res = await sql<{ users: string }[]>`
      SELECT *, 
        (SELECT users FROM users WHERE operator = ${q.abonent || q.operator}) as users
      FROM operators as oper
      WHERE oper.operator = ${q.abonent || q.operator}  
        AND abonent = ${q.abonent} 
        AND psw = ${q.psw}
    `;
    let users: User[] = [];
    if (res[0]) {
      users = JSON.parse(res[0].users);
      const ind = findIndex(users, { id: String(q.id) });
      if (ind === -1) return;

      // Adding new department information
      users[q.id + 1] = {
        id: String(q.id + 1),
        alias: '',
        admin: {
          desc: '',
          name: '',
          role: 'admin',
          email: '',
          picture: { user_pic: '' }, // Adjust 'user_pic' based on your actual picture data
        },
        staff: [],
      };
      return updateUsers(users, q);
    }
    // If no result, handle the case (returning undefined or an empty object)
    return;
  }
}

export async function RemDep(q: RemDepQuery): Promise<void> {
  const res = await sql<{ users: string }[]>`
    SELECT users 
    FROM operators as oper
    INNER JOIN users as usr ON (oper.abonent = usr.operator)
    WHERE oper.operator = ${q.operator || q.abonent} 
      AND oper.psw = ${q.psw}
  `;

  if (res[0]) {
    let users: User[] = JSON.parse(res[0].users);
    // Remove the department by ID
    remove(users, (n) => n.id === q.dep);
    return updateUsers(users, q);
  }
}

interface ChangeOperatorQuery {
  abonent: string;
  operator: string;
  psw: string;
  dep_id: string;
  data: {
    id: string;
    role: string;
    alias?: string;
    email?: string;
    name?: string;
    desc?: string;
    picture?: string;
  };
}

interface Admin {
  desc: string;
  name: string;
  role: string;
  email: string;
  picture: { user_pic: string };
}

interface User {
  id: string;
  alias: string;
  admin: Admin;
  staff: Staff[];
}

interface Staff {
  id: string;
  alias: string;
  email: string;
  name: string;
  desc: string;
  picture: string;
}

export async function ChangeOperator(q: ChangeOperatorQuery): Promise<void> {
  const res = await sql<{ users: string }[]>`
    SELECT *, 
      (SELECT users FROM users WHERE operator = ${q.abonent || q.operator}) AS users 
    FROM operators AS oper 
    WHERE oper.operator = ${q.abonent || q.operator}  
      AND abonent = ${q.abonent} 
      AND psw = ${q.psw}
  `;

  if (res[0]) {
    try {
      let users: User[] = JSON.parse(res[0].users);
      let dep = find(users, { id: q.dep_id });

      if (dep) {
        let user;

        if (q.data.role === 'admin') {
          user = dep.admin;
        } else {
          let ind = findIndex(dep.staff, { id: q.data.id });
          user = dep.staff[ind];
        }

        if (user) {
          if (q.data.alias) user.alias = q.data.alias;
          if (q.data.email) {
            if (q.data.email !== user.email) {
              SendEmail(q, q.data.email); // Assuming this function is defined elsewhere
            }
            user.email = q.data.email;
          }
          if (q.data.name) user.name = q.data.name;
          if (q.data.desc) user.desc = q.data.desc;
          // if (q.data.picture) user.picture = q.data.picture; // Uncomment and adjust if picture is used
        }
      }
    } catch (ex) {
      console.error('Error updating operator data:', ex);
      // Optionally handle the error (e.g., return error response)
    }

    return updateUsers(users, q); // Assuming this function updates the users in the database
  }
}


interface RemoveOperatorQuery {
  abonent: string;
  operator: string;
  psw: string;
  dep: string;
  id: string;
}

interface User {
  id: string;
  alias: string;
  admin: Admin;
  staff: Staff[];
}

interface Admin {
  desc: string;
  name: string;
  role: string;
  email: string;
  picture: { user_pic: string };
}

interface Staff {
  id: string;
  alias: string;
  email: string;
  name: string;
  desc: string;
  picture: string;
}

export async function RemoveOperator(q: RemoveOperatorQuery): Promise<void> {
  const res = await sql<{ users: string }[]>`
    SELECT *, 
      (SELECT users FROM users WHERE operator = ${q.abonent || q.operator}) AS users
    FROM operators AS oper
    WHERE oper.operator = ${q.abonent || q.operator}  
      AND abonent = ${q.abonent} 
      AND psw = ${q.psw}
  `;

  try {
    let users: User[] = [];
    if (res[0]) {
      users = JSON.parse(res[0].users);

      // Find the department
      let dep = find(users, { id: q.dep });
      if (dep) {
        let ind = findIndex(dep.staff, { id: q.id });
        if (ind !== -1) {
          // Remove the staff member
          dep.staff.splice(ind, 1);
        }
      }
      return updateUsers(users, q); // Assuming this function updates the users in the database
    }
  } catch (ex) {
    console.error('Error removing operator:', ex);
    // Optionally, handle the error (e.g., return an error response)
    return;
  }
}

interface GetWordsQuery {
  name: string;
  owner: string;
  level: string;
  func: string;
}

interface WordData {
  data: string; // or whatever type `data` is
  subscribe: boolean;
}

export async function GetWords(q: GetWordsQuery): Promise<WordData | string> {
  try {
    let res = await sql<{ data: string; subscribe: boolean }[]>`
      SELECT data, subscribe  
      FROM word
      WHERE name = ${q.name} 
        AND owner = ${q.owner} 
        AND level = ${q.level}
    `;
    
    if (res[0]) {
      return res[0]; // Returns the first result, which contains data and subscribe
    } else {
      return 'No data found'; // Handle case where no result is found
    }
  } catch (ex) {
    console.error('Error in GetWords:', ex); // Log error for debugging
    return JSON.stringify({ func: q.func, res: ex }); // Or return a more structured error response
  }
}


interface GetBricksQuery {
  owner: string;
  level: string;
  theme: string;
  name?: string; // Optional name field
  func: string;  // Name of the function (used in error reporting)
}

interface Brick {
  id: string;
  name: string;
  owner: string;
  level: string;
  theme: string;
  context?: string; // Context data to be added if available
}

interface Context {
  name: string;
  data: string;
}

export async function GetBricks(q: GetBricksQuery): Promise<Brick | Brick[] | string> {
  try {

    let res;
    // Fetch context data if name is provided
    const contextResult = await sql<Context[]>`
      SELECT c.name, c.data
      FROM context c
      ${q.name ? sql`WHERE c.name = ${q.name}` : sql``}
    `;

    // Fetch brick data based on provided filters
    let bricksResult = await sql<Brick[]>`
      SELECT b.*
      FROM bricks b
      WHERE b.owner = ${q.owner} 
        AND b.level = ${q.level} 
        AND b.theme = ${q.theme}
        ${q.name ? sql`AND b.name = ${q.name}` : sql``}
    `;

    res = bricksResult[0]||{}

    // If contextResult and bricksResult exist, add context to the first brick
    if (contextResult[0]) {
      res.context = contextResult[0].data;
    }

    // Return either a single brick or an array of bricks
    return res;
  } catch (ex) {
    console.error('Error in GetBricks:', ex); // Log error for debugging
    return JSON.stringify({ func: q.func, res: ex }); // Return structured error response
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

interface Context {
  data: string;
  prompt_type: string;
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
    const bricks = await sql<{ data: string }[]>`
      SELECT data, prompt_type 
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

    dialog[0].brick = bricks[0]?.data || ''; // Add brick HTML if available
    dialog[0].context = context[0]?.data || ''; // Add context data if available
  

    return dialog[0] || 'Dialog not found'; // Return the first dialog or a message if not found
  } catch (ex) {
    console.error('Error in GetDialog:', ex); // Log the error for debugging
    return JSON.stringify({ func: q.func, res: ex }); // Return structured error response
  }
}


interface Prompt {
  system: string;
  user: string;
}

export async function GetPrompt(name: string): Promise<{ prompt?: Prompt, error?: string }> {
  try {
    // Fetch prompt data from the database
    const prompt = await sql<Prompt[]>`
      SELECT *
      FROM prompts
      WHERE name = ${name}
    `;

    // If prompt is found, return it; otherwise, return an error message
    if (prompt[0]) {
      return { prompt: prompt[0] };
    } else {
      return { error: 'Prompt not found' };
    }
  } catch (ex) {
    // Log the error for debugging
    console.error('Error in GetPrompt:', ex);
    return { error: 'An error occurred while fetching the prompt' };
  }
}


interface Level {
  level: string;
}

export async function getLevels(owner: string): Promise<string[]> {
  try {
    // Fetch levels for the given owner
    const levels = await sql<Level[]>`
      SELECT level 
      FROM lessons 
      WHERE owner = ${owner}
    `;

    // If levels are found, return an array of level strings
    return levels.map((item) => item.level);
  } catch (ex) {
    console.error('Error in getLevels:', ex);
    return []; // Return an empty array if an error occurs
  }
}

interface Group {
  group: string;
}

export async function getGroups(owner: string): Promise<string[]> {
  try {
    // Fetch levels for the given owner
    const groups = await sql<Group[]>`
      SELECT "group" 
      FROM lessons 
      WHERE owner = ${owner}
    `;

    // If levels are found, return an array of level strings
    return groups.map((item) => item.group);
  } catch (ex) {
    console.error('Error in getLevels:', ex);
    return []; // Return an empty array if an error occurs
  }
}


interface Lesson {
  owner: string;
  data: string; // Assuming 'data' is of type string (e.g., lesson data or description)
  level: string;
  lang: string;
}

export async function GetLessonsByDate(): Promise<Lesson[]> {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Начало текущего дня

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Конец текущего дня

    // Fetch lessons for the current day within the specified time range
    const lessons = await sql<Lesson[]>`
      SELECT owner, data, level, lang 
      FROM lessons 
      WHERE timestamp BETWEEN ${startOfDay} AND ${endOfDay} 
      ORDER BY level DESC
    `;

    return lessons; // Return the lessons found
  } catch (ex) {
    console.error('Error in GetLessonsByDate:', ex);
    return []; // Return an empty array in case of an error
  }
}


interface Lesson {
  data: string;
  level: string;
  lang: string;
}

interface News {
  name: string;
  published: number;
  type: string;
}

interface ContextNews {
  name: string;
  data: string;
  published: number;
  type: string;
}

interface GetLessonResponse {
  data: string;
  lang: string;
  level: string;
  levels: string[];
  news: News[];
  context_news: ContextNews[];
}

export async function GetLesson(q: { operator: string; owner: string; level?: string; func?: string }): Promise<GetLessonResponse> {
  try {
    let res: Lesson[] = [];
    let levels: string[] = [];
    let news: NewsItem[] = [];
    let operatorGroup: string | null = null;

    // Начинаем транзакцию
    await sql.begin(async (sql) => {
      // First get the operator's group
      const operatorInfo = await sql<{group: string}[]>`
        SELECT "group" FROM operators 
        WHERE operator = ${q.operator} AND abonent = ${q.owner}
        LIMIT 1
      `;
      operatorGroup = operatorInfo[0]?.group || null;

      // Query based on operator and owner relationship
      if (operatorGroup) {
        res = await sql<Lesson[]>`
          SELECT lessons.data, lessons.lang 
          FROM lessons
          JOIN groups ON (groups.name = ${operatorGroup} AND groups.name = lessons.group)
          WHERE groups.owner = ${q.owner} AND lessons.owner = ${q.owner}
        `;
      } else {
        res = await sql<Lesson[]>`
          SELECT data,  lang 
          FROM lessons 
          WHERE owner = ${q.owner}  
        `;
      }

    });

    // Find lesson for the specific level
    const les = res.find((lesson) => lesson.level === q.level);

    // Return structured response
    return {
      data: les?.data || res[0]?.data || '', // Default to first lesson's data if not found
      lang: les?.lang || res[0]?.lang || 'en', // Default to 'en' if not found
      operatorGroup: operatorGroup // Include the found group in response if needed
    };
  } catch (ex) {
    console.error('Error in GetLesson:', ex);
    return { 
      data: '', 
      lang: 'en', 
      operatorGroup: null, 
      news: [], 
    }; // Return empty/default values on error
  }
}
interface NewsItem {
  name: string;
  published: number;
  type: string;
}

interface GetNewsResponse {
  news: NewsItem[];
  context_news: NewsItem[];
}

export async function GetNews(q: { lang: string; func?: string }): Promise<GetNewsResponse> {
  try {
    const lang = q.lang; // Use lang from the query parameters

    // Query for news items from dialogs and bricks
    const news = await sql<NewsItem[]>`
      SELECT 
        json_build_object(${lang}::text, "name") AS "name",  
        MAX((EXTRACT(EPOCH FROM "timestamp") * 1000)::BIGINT) AS "published", 
        "type"
      FROM (
        SELECT "name", "timestamp", 'dialog' AS "type" 
        FROM public.dialogs 
        WHERE "type" = 'news' 

        UNION

        SELECT "name", "timestamp" AS "published", 'bricks' AS "type" 
        FROM public.bricks 
        WHERE "type" = 'news'
      ) AS combined
      GROUP BY "name", "type"
      ORDER BY "published" DESC
      LIMIT 20;
    `;

    // Query for context-related news
    const context_news = await sql<NewsItem[]>`
      SELECT 
        json_build_object(quote_literal(${lang}), "name") AS "name", 
        "data", 
        MAX((EXTRACT(EPOCH FROM "timestamp") * 1000)::BIGINT) AS "published", 
        "type"
      FROM public.context 
      WHERE "type" = 'news' 
      GROUP BY "name", "data", "type"
      ORDER BY "published" DESC;
    `;

    // Return structured response
    return {
      news: news || [],
      context_news: context_news || []
    };
  } catch (ex) {
    console.error('Error in GetNews:', ex);
    return {
      news: [],
      context_news: []
    };
  }
}


interface UpdateQuizUsersRequest {
  type: 'dialog' | 'word';
  quiz: string;
  abonent: string;
  add?: string;
  rem?: string;
}

export async function UpdateQuizUsers(q: UpdateQuizUsersRequest): Promise<string[]> {
  let res;
  try {
    // Function to fetch the subscription from the appropriate table
    const getSubscriptions = async () => {
      if (q.type === 'dialog') {
        return await sql`SELECT subscribe FROM dialogs WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
      } else if (q.type === 'word') {
        return await sql`SELECT subscribe FROM word WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
      }
    };

    // Получаем текущие подписки
    res = await getSubscriptions();
    let qu = res[0]?.subscribe || []; // если подписки нет - создаем пустой массив

    // Обработка добавления или удаления подписки
    if (q.add) {
      qu.push(q.add); // добавляем новую подписку
    } else if (q.rem) {
      // удаляем подписку
      const index = qu.indexOf(q.rem);
      if (index > -1) qu.splice(index, 1); // проверяем, что подписка существует
    }

    // Функция для обновления подписок в базе данных
    const updateSubscriptions = async () => {
      if (q.type === 'dialog') {
        return await sql`UPDATE dialogs SET subscribe = ${sql.json(qu)} WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
      } else if (q.type === 'word') {
        return await sql`UPDATE word SET subscribe = ${sql.json(qu)} WHERE name = ${q.quiz} AND owner = ${q.abonent}`;
      }
    };

    // Обновляем подписки в базе данных
    await updateSubscriptions();
    return qu; // возвращаем обновленный список подписок
  } catch (ex) {
    console.error('Error in UpdateQuizUsers:', ex);
    throw ex; // выбрасываем ошибку для обработки выше
  }
}


interface GetDictRequest {
  type: string;
  level: string;
  owner: string;
  func?: string;
}

export async function GetDict(q: GetDictRequest): Promise<any> {
  try {
    const res = await sql`
      SELECT words 
      FROM dicts
      WHERE type = ${q.type} 
        AND level = ${q.level}  
        AND owner = ${q.owner}
    `;

    // Use optional chaining to return words or the whole result if not found
    return res[0]?.words || res; 
  } catch (ex) {
    // Log the error and rethrow it for further handling
    console.error(`Error in GetDict function:`, ex);
    throw new Error(`Failed to get dictionary for ${q.func || 'unknown function'}: ${ex}`);
  }
}

interface WriteTranslateRequest {
  lang: string;
  key: string;
  text: string;
  translate: string;
  provider:string;
  quiz:string;
}

interface WriteTranslateResponse {
  success: boolean;
  message: string;
  error?: any;
}

export async function WriteTranslate(q: WriteTranslateRequest): Promise<WriteTranslateResponse> {
  try {
    await sql`
        INSERT INTO translate (lang, key, text, translate, provider, quiz)
        VALUES (
          ${q.lang ?? null}, 
          ${q.key ?? null}, 
          ${q.text ?? null}, 
          ${q.translate ?? null}, 
          ${q.provider ?? null}, 
          ${q.quiz ?? null} -- Заменяем undefined на null
        )
        ON CONFLICT (key, lang) 
        DO UPDATE SET 
          lang = EXCLUDED.lang,
          translate = EXCLUDED.translate,
          provider = EXCLUDED.provider,
          quiz = CASE 
            WHEN EXCLUDED.quiz <> '' OR translate.quiz = '' THEN EXCLUDED.quiz 
            ELSE translate.quiz 
          END
      `;

    // Return success response
    return { success: true, message: "Data written successfully." };
  } catch (ex) {
    // Log the error and return a failure message with error details
    console.error("Error writing translate:", ex);
    return { success: false, message: "Failed to write data.", error: ex };
  }
}

interface ReadSpeechRequest {
  key: string;
  lang: string;
}

interface ReadSpeechResponse {
  translate?: string;
  error?: string;
}

export async function ReadSpeech(q: ReadSpeechRequest): Promise<ReadSpeechResponse> {
  try {
    // Perform the database query to retrieve the translation
    let res = await sql`SELECT translate, quiz FROM translate
                        WHERE key = ${q.key} AND lang = ${q.lang}`;

    // If a result is found, return the translation
    if (res[0]) {
      return { translate: res[0].translate, quiz:res[0].quiz };
    } else {
      // Explicitly return a structured response when no data is found
      return { error: 'Translation not found' };
    }
  } catch (ex) {
    // Log the error and return a structured error response
    console.error('Database query failed:', ex);
    return { error: 'Database query failed' };
  }
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
  let operators;
  let admin;

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

export async function GetQuizContext(params) {
  try {
    // Debugging: Log the parameters
    console.log('Query Parameters:', params);

    // Validate and sanitize the table name
    const validTypes = ['bricks', 'words', 'dialogs']; // Add valid table names here
    if (!validTypes.includes(params.type)) {
      throw new Error(`Invalid table type: ${params.type}`);
    }

    // Manually construct the query with the table name
    const query = `
      SELECT data AS context
      FROM public.${params.type}
      WHERE name = $1::text AND owner::text = $2 AND level::text = $3
    `;

    // Debugging: Log the query
    console.log('Generated Query:', query);

    // Execute the query with parameters
    const res = await sql.unsafe(query, [params.name, params.owner, params.level]);

    // Debugging: Log the query result
    console.log('Query Result:', res);

    // Return the first row (or null if no rows are found)
    return res.length > 0 ? res[0] : null;
  } catch (error) {
    // Log the error and rethrow it
    console.error('Error in GetQuizContext:', error);
    throw error;
  }
}

export async function UpdateUserLevel(text, operator) {

  function compareLevels(currentLevel, newLevel) {
    // Проверяем, что currentLevel и newLevel не null или undefined
    if (!currentLevel || !newLevel) {
      throw new Error("Один из уровней не определён.");
    }

    // Разделяем уровни на части
    const currentParts = currentLevel.split('.');
    const newParts = newLevel.split('.');
  
    // Сравниваем каждую часть
    for (let i = 0; i < Math.max(currentParts.length, newParts.length); i++) {
      const currentPart = parseInt(currentParts[i] || '0', 10); // Если часть отсутствует, считаем её равной 0
      const newPart = parseInt(newParts[i] || '0', 10);
  
      if (newPart > currentPart) {
        return true; // Новый уровень выше
      } else if (newPart < currentPart) {
        return false; // Новый уровень ниже
      }
      // Если части равны, переходим к следующей
    }
  
    return false; // Уровни равны
  }

  const userRegex = /<user>([\s\S]*?)<\/user>/;
  const levelRegex = /<level>([\s\S]*?)<\/level>/;

  // Поиск содержимого <user>
  const uMatch = userRegex.exec(text);
  const uContent = uMatch ? uMatch[1].trim() : null;

  if (!uContent) {
    throw new Error("Тег <user> не найден в тексте.");
  }

  // Поиск уровня в содержимом <user>
  const levelMatch = levelRegex.exec(uContent);
  const newLevel = levelMatch ? levelMatch[1].trim() : null;

  if (!newLevel) {
    throw new Error("Тег <level> не найден в содержимом <user>.");
  }

  try {
    // Получаем текущий уровень оператора из базы данных
    const currentLevelResult = await sql`
      SELECT level FROM operators WHERE "operator" = ${operator}
    `;

    if (currentLevelResult.length === 0) {
      throw new Error(`Оператор с ID ${operator} не найден.`);
    }

    let currentLevel = currentLevelResult[0].level;

    // Если currentLevel равен null, устанавливаем значение по умолчанию
    if (currentLevel === null || currentLevel === undefined) {
      console.warn(`Текущий уровень оператора ${operator} не определён. Устанавливаем значение по умолчанию "0".`);
      currentLevel = "0"; // Уровень по умолчанию
    }

    // Сравниваем уровни
    if (compareLevels(currentLevel, newLevel)) {
      // Если новый уровень выше, обновляем
      const result = await sql`
        UPDATE operators
        SET level = ${newLevel}
        WHERE "operator" = ${operator}
      `;

      console.log(`Уровень оператора ${operator} успешно обновлён на ${newLevel}.`);
    } else {
      console.warn(`Уровень оператора ${operator} не обновлён, так как новый уровень ${newLevel} не выше текущего ${currentLevel}.`);
    }
  } catch (error) {
    console.error("Ошибка при обновлении уровня оператора:", error);
    throw error;
  }
}

export function GetSTT(){

}

export async function SaveSTT(operator, text='', lang='nl', original=null){

    try {
    // Проверяем, что текст не пустой
    if (!text || text.trim() === '') {
      throw new Error("Текст не может быть пустым.");
    }

    // Проверяем, что текст не короче 20 символов
    if (text.length < 20) {
      throw new Error("Текст должен содержать не менее 20 символов.");
    } 

      // Вставляем данные в таблицу stt (предположим, что такая таблица существует)
      const result = await sql`
      INSERT INTO stt (operator, data, lang, original)
      VALUES (
      ${operator}, 
      ${text}, 
      ${lang}, 
      ${original !== null && original !== undefined && original !== 'undefined' ? original : sql`NULL`}
      )
      ON CONFLICT (original,operator, lang, data) 
      DO UPDATE SET
        data = EXCLUDED.data
      RETURNING data
      `;
  
      // Возвращаем успешный результат с ID новой записи
      return {
        success: true,
        message: "Данные успешно сохранены."
      };
    } catch (error) {
      // Логируем ошибку и возвращаем сообщение об ошибке
      console.error("Ошибка при сохранении данных STT:", error);
      return {
        success: false,
        message: "Не удалось сохранить данные.",
        error: error.message,
      };
    }
  
}

export async function SetRate(par) {
  console.log(par); // Debugging purposes

  try {
    const result = await sql`
      INSERT INTO rate (operator, name, level, rate, type, total)
      VALUES (
        ${par.operator},
        ${par.name},
        ${par.level}, 
        ${par.rate},
        ${par.type},
        ${par.total}
      )
      ON CONFLICT (operator, name, level, type) 
      DO UPDATE SET
        rate = GREATEST(rate.rate, EXCLUDED.rate),
        total = EXCLUDED.total
      RETURNING *; 
    `;

    return result; // Return the result of the query
  } catch (ex) {
    console.error('Error in SetRate:', ex); // More detailed error logging
    throw ex; // Rethrow the error to handle it elsewhere
  }
}