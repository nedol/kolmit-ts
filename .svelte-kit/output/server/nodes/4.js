import * as universal from '../entries/pages/admin/_page.js';
import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/admin/+page.js";
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.LtfMClTB.js","_app/immutable/chunks/scheduler.BiCo1YSR.js","_app/immutable/chunks/index.CRrunSqy.js","_app/immutable/chunks/SelectionGroupIcon.CkJYDs02.js","_app/immutable/chunks/Textfield.BKZax2Uy.js","_app/immutable/chunks/entry.CROC4EY9.js","_app/immutable/chunks/dict.DEzP0HtJ.js"];
export const stylesheets = ["_app/immutable/assets/4.BLv5L6D3.css","_app/immutable/assets/SelectionGroupIcon.Cwfk-kdc.css"];
export const fonts = [];
