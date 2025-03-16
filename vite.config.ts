import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [sveltekit(), commonjs()],
  assetsInclude: ["**/*.html"],

  resolve: {
    alias: {
      $src: path.resolve("./src"),
      $assets: path.resolve("./src/routes/assets"),
    },
  },

  define: {
    global: 'globalThis',
  },

  build: {
    sourcemap: true, // Оставляем только нужные настройки для сборки
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: path.resolve("./key.pem"),
      cert: path.resolve("./cert.pem"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "./src/variables.scss" as *;',
      },
    },
  },
});
