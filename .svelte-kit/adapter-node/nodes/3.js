import * as universal from '../entries/pages/_page.js';
import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.b9XDQBa5.js","_app/immutable/chunks/scheduler.BiCo1YSR.js","_app/immutable/chunks/index.CRrunSqy.js","_app/immutable/chunks/SelectionGroupIcon.CkJYDs02.js","_app/immutable/chunks/Textfield.BKZax2Uy.js","_app/immutable/chunks/entry.CROC4EY9.js","_app/immutable/chunks/load-image-scale.D6-7SQP6.js"];
export const stylesheets = ["_app/immutable/assets/3.C6dgbHsM.css","_app/immutable/assets/SelectionGroupIcon.Cwfk-kdc.css"];
export const fonts = ["_app/immutable/assets/icofont.CegLT4Ez.woff2","_app/immutable/assets/icofont.CRj9mKsw.woff"];
