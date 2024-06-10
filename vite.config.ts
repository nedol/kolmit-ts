import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";

import commonjs from "vite-plugin-commonjs";
// import nodeGlobals from 'rollup-plugin-node-globals';

export default defineConfig({
  plugins: [sveltekit(),commonjs()],
  assetsInclude: ["**/*.html"],

  resolve: {
    alias: {
      // создание алиаса
      $src: path.resolve("./src"),
      $assets: path.resolve("./src/routes/assets"),
    },
  },

    define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
      global: 'globalThis',
  },

  build: {
    // Устанавливаем dev: true только для целей разработки
    dev: true,
  },

  server: {
    //port: 3478, // Измените этот порт по вашему усмотрению
    https: {
      key: path.resolve("./key.pem"),
      cert: path.resolve("./cert.pem"),
    },
    // middleware: [
    // 	createProxyMiddleware('/turn', {
    // 		target: 'http://0.0.0.0:3478',
    // 		pathRewrite: {
    // 			'^/turn': '' // Удалить префикс /turn из URL перед отправкой на сервер TURN
    // 		},
    // 		changeOrigin: true // Включить изменение происхождения запросов
    // 	})
    // ]
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
});

//# sourceMappingURL=vite.config.js.map
