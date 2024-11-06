import * as universal from '../entries/pages/site/_page.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/site/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/site/+page.js";
export const imports = ["_app/immutable/nodes/7.BXHgehs_.js","_app/immutable/chunks/scheduler.BiCo1YSR.js","_app/immutable/chunks/index.CRrunSqy.js"];
export const stylesheets = ["_app/immutable/assets/7.DnowOQRu.css"];
export const fonts = [];
