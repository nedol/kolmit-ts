import { c as create_ssr_component } from "../../chunks/ssr.js";
const css = {
  code: ".app.svelte-11uokw2{display:flex;flex-direction:column;min-height:100vh}main.svelte-11uokw2{flex:1;display:flex;flex-direction:column;width:100%;box-sizing:border-box}@media(min-width: 480px){}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app svelte-11uokw2"><main class="svelte-11uokw2">${slots.default ? slots.default({}) : ``}</main>  </div>`;
});
export {
  Layout as default
};
