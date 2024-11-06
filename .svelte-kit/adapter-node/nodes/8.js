import * as universal from '../entries/pages/site/about/_page.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/site/about/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/site/about/+page.js";
export const imports = ["_app/immutable/nodes/8.CgNrJPBm.js","_app/immutable/chunks/scheduler.BiCo1YSR.js","_app/immutable/chunks/index.CRrunSqy.js"];
export const stylesheets = [];
export const fonts = [];
