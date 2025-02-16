import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
// import adapter from '@sveltejs/adapter-auto';
import adapter from "@sveltejs/adapter-node";
// import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from "@sveltejs/kit/vite";

// import { vitePreprocess } from "@sveltejs/kit/vite";

import path from "path";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  // preprocess: vitePreprocess(),
  preprocess: [preprocess(), vitePreprocess({})],
  

  css: (css) => {
    css.write("public/bundle.css");
  },

  scss: {},

  onwarn: (warning, handler) => {
    if (
      warning.code.startsWith("a11y-") ||
      warning.code.startsWith("Unused-")
    ) {
      return;
    }
    handler(warning);
  },

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({
      runtime: 'nodejs18.x' // Отключение edge-функций
    }),
  },
};

export default config;
