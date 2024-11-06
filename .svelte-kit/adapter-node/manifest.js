export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["assets/operator.svg","favicon.png","test.html"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".html":"text/html"},
	_: {
		client: {"start":"_app/immutable/entry/start.CgY5nH8g.js","app":"_app/immutable/entry/app.DY-0rNxF.js","imports":["_app/immutable/entry/start.CgY5nH8g.js","_app/immutable/chunks/entry.CROC4EY9.js","_app/immutable/chunks/scheduler.BiCo1YSR.js","_app/immutable/entry/app.DY-0rNxF.js","_app/immutable/chunks/scheduler.BiCo1YSR.js","_app/immutable/chunks/index.CRrunSqy.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: __memo(() => import('./entries/endpoints/_server.js'))
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: __memo(() => import('./entries/endpoints/admin/_server.ts.js'))
			},
			{
				id: "/admin/group",
				pattern: /^\/admin\/group\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/admin/group/_server.ts.js'))
			},
			{
				id: "/admin/login",
				pattern: /^\/admin\/login\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/admin/login/_server.js'))
			},
			{
				id: "/admin/module",
				pattern: /^\/admin\/module\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/admin/module/_server.js'))
			},
			{
				id: "/admin/quiz/dialog",
				pattern: /^\/admin\/quiz\/dialog\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/admin/quiz/dialog/_server.ts.js'))
			},
			{
				id: "/lesson",
				pattern: /^\/lesson\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: __memo(() => import('./entries/endpoints/lesson/_server.js'))
			},
			{
				id: "/operator",
				pattern: /^\/operator\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/operator/_server.js'))
			},
			{
				id: "/operator/chat",
				pattern: /^\/operator\/chat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/operator/chat/_server.js'))
			},
			{
				id: "/public",
				pattern: /^\/public\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/site",
				pattern: /^\/site\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/site/about",
				pattern: /^\/site\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/speech/stt",
				pattern: /^\/speech\/stt\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/speech/stt/_server.js'))
			},
			{
				id: "/speech/tts",
				pattern: /^\/speech\/tts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/speech/tts/_server.js'))
			},
			{
				id: "/translate",
				pattern: /^\/translate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/translate/_server.js'))
			},
			{
				id: "/user",
				pattern: /^\/user\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/user/_server.js'))
			},
			{
				id: "/user/group",
				pattern: /^\/user\/group\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/user/group/_server.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base = "";