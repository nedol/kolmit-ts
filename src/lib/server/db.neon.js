// import { page, navigating, updated } from '$app/stores';

import { moment } from 'moment';

import pkg from 'lodash';
const { find, remove, findIndex } = pkg;

import md5 from 'md5';
import { writable } from 'svelte/store';

import { tarifs } from './tarifs.json';

import user_pic from '$lib/images/operator.svg';

import postgres from 'postgres';

let sql;

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

import { redirect } from '@sveltejs/kit';
import pkg_e from 'nodemailer';
const { Email } = pkg_e;

let conStrNeon = {
	connectionString:
		'postgresql://nedooleg:nHLhfQB0WS5Y@ep-polished-bush-a2n4g5y9-pooler.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require'
};

export async function CreatePool(resolve) {
	sql = postgres(conStrNeon.connectionString, {
		host: 'ep-polished-bush-a2n4g5y9-pooler.eu-central-1.aws.neon.tech', // Postgres ip address[s] or domain name[s]
		port: 5432, // Postgres server port[s]
		database: 'neondb', // Name of database to connect to
		username: 'nedooleg', // Username of database user
		password: 'nHLhfQB0WS5Y' // Password of database user
	});
	resolve(sql);
}

let conStr = {
	connectionStringSupabase:
		'postgresql://postgres.abzyzzvokjdnwgjbitga:NissanPathfinder@386/aws-0-eu-central-1.pooler.supabase.com:5432'
};

export async function CreatePool_(resolve) {
	sql = postgres(conStr.connectionStringSupabase, {
		host: 'aws-0-eu-central-1.pooler.supabase.com', // Postgres ip address[s] or domain name[s]
		port: 5432, // Postgres server port[s]
		database: 'postgres', // Name of database to connect to
		username: 'postgres.abzyzzvokjdnwgjbitga', // Username of database user
		password: 'NissanPathfinder@386', // Password of database user
		idle_timeout: 20,
		max_lifetime: 60 * 30
	});
	resolve(sql);
}

function getHash(par) {
	return md5(par + par);
}

function SendEmail(q, new_email) {
	let em = new Email();
	const abonent = q.abonent ? '&abonent=' + q.abonent : '';
	const mail = q.send_mail || new_email;
	const hash = getHash(mail);
	let text = {
		ru: '<h1>Присоединиться к сети</h1></a>',
		en: '<h1>Join network</h1></a>',
		fr: '<h1>Rejoindre le réseau</h1></a>'
	}[q.lang];
	let html =
		"<div><a href='http://localhost:5000/kolmit/site/operator.html?operator=" +
		(q.send_mail || new_email) +
		abonent +
		'&hash=' +
		hash +
		"'>" +
		text +
		'</a></div>';

	em.SendMail(
		'nedol@narod.ru',
		q.send_mail || new_email,
		{
			ru: 'Новый оператор сети Колми',
			en: 'New Kolmi network operator',
			fr: 'Le nouvel opérateur de Kolmi'
		}[q.lang],
		html,
		(result) => {
			console.log();
		}
	);
}

export async function CreateOperator(par) {
	try {
		if (par.abonent === par.email) return false;
		const nedol = par.psw;
		par.psw = md5(par.psw);
		let res = await sql`SELECT operators.psw as psw, users.users as users 
			FROM operators
			INNER JOIN users ON (users.operator = operators.abonent)
			WHERE operators.operator=${par.email} 
			AND operators.abonent=${par.abonent}`;
		if (res[0]) {
			let psw = res[0].psw;
			if (psw) {
				if (nedol !== 'nedol') if (psw !== par.psw) return false;
			}
			let users = res[0].users;
			par.dep_id = '0';
			let oper = find(users[0].staff, { email: par.email });
			if (!oper) {
				oper = {
					id: users[0].staff.length + 1,
					role: 'operator',
					name: par.name,
					email: par.email
				};

				users[0].staff.push(oper);
			}
			updateOper(par);

			return updateUsers(users, par);
		} else {
			if (par.email.toLowerCase().includes('cvoantwerpen.org')) {
				return AddOperator(par);
			} else {
				return false;
			}
		}
	} catch (er) {
		console.log(er);
	}
}

async function updateOper(q) {
	try {
		let res = await sql`UPDATE operators SET
		psw = ${q.psw}, picture=${q.picture}
		WHERE  operator=${q.email} AND abonent=${q.abonent}`;
	} catch (ex) {}
}

async function updateUsers(users, q) {
	let usrs = JSON.stringify(users);

	try {
		let res = await sql`UPDATE users SET
		users=${usrs}, 
		last=CURRENT_TIMESTAMP, 
		editor=${q.abonent || q.email}
		WHERE  operator=${q.abonent || q.email}`;
	} catch (ex) {}
	return JSON.stringify({ func: q.func, dep: users[0] });
}

export async function GetUsers(par) {
	let users = '';

	if (par.abonent) {
		users = await sql`
		SELECT  users, quiz_users
			FROM operators
			INNER JOIN users ON (operators.abonent = users.operator)
			WHERE  operators.operator=${par.operator} AND operators.abonent=${par.abonent}  
				AND operators.psw=${par.psw};`;
	} else {
		users = await sql`
		SELECT  users, quiz_users
			FROM operators
			INNER JOIN users ON (operators.abonent = users.operator = operators.operator) 
			WHERE operators.operator=users.operators.operator AND operators.operator=${par.em} 
				AND operators.psw=${par.psw};`;
	}

	users[0].pictures = await sql`
		SELECT  operator, picture
			FROM operators
			WHERE  operators.abonent=${par.abonent} AND operators.picture<>''`;

	return users[0];
}

export async function CheckOperator(q) {
	let result;

	// console.log(sql);

	if (q.psw && q.hash && getHash(q.em) === q.hash) {
		try {
			await sql`
			INSERT INTO operators (psw, operator, abonent,  name) VALUES(${q.psw}, ${q.em}, 
			, ${q.name})`;
		} catch (ex) {}
	}

	if (q.em) {
		if (q.abonent) {
			result = await sql`
			SELECT * FROM  operators WHERE operator=${q.em} AND abonent=${q.abonent} AND psw=${q.psw}`;
		} else {
			result = result;
			await sql`
			SELECT * FROM  operators WHERE operator=${q.em} AND abonent=${q.abonent} AND psw=${q.psw}`;
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
		SELECT * FROM  operators WHERE operator=${q.em}`;

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
	WHERE oper.abonent=${q.abonent} AND oper.operator=${q.em || q.operator} AND oper.psw=${q.psw}`;

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
			q.abonent || q.em
		}) as users
		FROM  operators as oper
		WHERE oper.operator=${q.abonent || q.em}  AND abonent=${q.abonent} AND psw=${q.psw}
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
					picture: { user_pic }
				},
				staff: []
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
		WHERE oper.operator=${q.em || q.abonent} AND oper.psw=${q.psw}`;

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
		q.abonent || q.em
	}) as users 
		FROM  operators as oper 
		WHERE oper.operator=${q.abonent || q.em}  AND abonent=${q.abonent} AND psw=${q.psw}`;

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
			if (q.data.picture) user.picture = q.data.picture;
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
		'WHERE oper.operator=${q.abonent || q.em}  AND abonent=${q.abonent} AND psw=${q.psw}`;
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

export async function GetText(q) {
	try {
		let res = await sql`SELECT text, questions FROM texts
		WHERE level= ${q.level} AND theme=${q.theme} AND title=${q.title} AND owner=${q.owner}`;
		//debugger;
		return { text: res[0].text, questions: res[0].questions };
	} catch (ex) {
		return JSON.stringify({ func: q.func, res: ex });
	}
}

export async function GetWords(q) {
	try {
		let res = await sql`SELECT data FROM words
		WHERE name=${q.name} AND owner=${q.owner}`;
		//debugger;
		return res[0].data;
	} catch (ex) {
		return JSON.stringify({ func: q.func, res: ex });
	}
}

export async function UpdateQuizUsers(q) {
	try {
		let res = await sql`SELECT quiz_users FROM users 
		WHERE operator=${q.abonent}`;
		let qu = res[0].quiz_users;
		if (!qu[q.quiz]) qu[q.quiz] = [];
		if (q.add && !qu[q.quiz].includes(q.add)) {
			qu[q.quiz].push(q.add);
		} else if (q.rem && qu[q.quiz].includes(q.rem)) {
			let ind = qu[q.quiz].indexOf(q.rem);
			qu[q.quiz].splice(1, ind);
		}

		res = await sql`UPDATE users SET quiz_users=${qu}
		WHERE operator=${q.abonent}`;

		return qu;
		//debugger;
	} catch (ex) {}
}

export async function GetDict(q) {
	try {
		let res = await sql`SELECT words FROM dicts
		WHERE type=${q.type} AND level= ${q.level} AND theme=${q.theme} AND owner=${q.owner}`;
		//debugger;
		return res[0].words;
	} catch (ex) {
		// debugger;
		return JSON.stringify({ func: q.func, res: ex });
	}
}

export async function WriteSpeech(q) {
	await sql.begin(async (sql) => {
		let res = await sql`INSERT INTO speech
		(admin,key, data) VALUES (${q.admin}, ${q.key}, ${q.data})`;
	});
}

export async function ReadSpeech(q) {
	try {
		let res = await sql`SELECT data FROM speech
		WHERE key= ${q.key}`;
		if (res[0]) {
			return res[0].data;
		}
	} catch (ex) {
		return JSON.stringify('');
	}
}
