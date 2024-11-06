

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lesson/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.6Zv1xMYN.js","_app/immutable/chunks/scheduler.BiCo1YSR.js","_app/immutable/chunks/index.CRrunSqy.js"];
export const stylesheets = ["_app/immutable/assets/2.BkKEX2pm.css"];
export const fonts = [];
