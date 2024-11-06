import { c as create_ssr_component, e as escape } from "../../../chunks/ssr.js";
const css = {
  code: "footer.svelte-15q17qn{display:flex;position:static;flex-direction:column;justify-content:center;align-items:center;padding:12px}",
  map: null
};
let level = "level 1.2";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<header></header>  <footer class="svelte-15q17qn"><p>${escape(level)}</p></footer>`;
});
export {
  Layout as default
};
