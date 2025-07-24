// vite.config.ts
import { sveltekit } from "file:///D:/VSCodeProjects/git/kolmit-ts-latest/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig } from "file:///D:/VSCodeProjects/git/kolmit-ts-latest/node_modules/vite/dist/node/index.js";
import path from "path";
import commonjs from "file:///D:/VSCodeProjects/git/kolmit-ts-latest/node_modules/vite-plugin-commonjs/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [sveltekit(), commonjs()],
  assetsInclude: ["**/*.html"],
  resolve: {
    alias: {
      $src: path.resolve("./src"),
      $assets: path.resolve("./src/routes/assets")
    }
  },
  define: {
    global: "globalThis"
  },
  build: {
    sourcemap: true
    // Оставляем только нужные настройки для сборки
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: {
      key: path.resolve("./key.pem"),
      cert: path.resolve("./cert.pem")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "./src/variables.scss" as *;'
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxWU0NvZGVQcm9qZWN0c1xcXFxnaXRcXFxca29sbWl0LXRzLWxhdGVzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVlNDb2RlUHJvamVjdHNcXFxcZ2l0XFxcXGtvbG1pdC10cy1sYXRlc3RcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1ZTQ29kZVByb2plY3RzL2dpdC9rb2xtaXQtdHMtbGF0ZXN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSBcIkBzdmVsdGVqcy9raXQvdml0ZVwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgY29tbW9uanMgZnJvbSBcInZpdGUtcGx1Z2luLWNvbW1vbmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtzdmVsdGVraXQoKSwgY29tbW9uanMoKV0sXHJcbiAgYXNzZXRzSW5jbHVkZTogW1wiKiovKi5odG1sXCJdLFxyXG5cclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAkc3JjOiBwYXRoLnJlc29sdmUoXCIuL3NyY1wiKSxcclxuICAgICAgJGFzc2V0czogcGF0aC5yZXNvbHZlKFwiLi9zcmMvcm91dGVzL2Fzc2V0c1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcclxuICB9LFxyXG5cclxuICBidWlsZDoge1xyXG4gICAgc291cmNlbWFwOiB0cnVlLCAvLyBcdTA0MUVcdTA0NDFcdTA0NDJcdTA0MzBcdTA0MzJcdTA0M0JcdTA0NEZcdTA0MzVcdTA0M0MgXHUwNDQyXHUwNDNFXHUwNDNCXHUwNDRDXHUwNDNBXHUwNDNFIFx1MDQzRFx1MDQ0M1x1MDQzNlx1MDQzRFx1MDQ0Qlx1MDQzNSBcdTA0M0RcdTA0MzBcdTA0NDFcdTA0NDJcdTA0NDBcdTA0M0VcdTA0MzlcdTA0M0FcdTA0MzggXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQ0MVx1MDQzMVx1MDQzRVx1MDQ0MFx1MDQzQVx1MDQzOFxyXG4gIH0sXHJcblxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIGh0dHBzOiB7XHJcbiAgICAgIGtleTogcGF0aC5yZXNvbHZlKFwiLi9rZXkucGVtXCIpLFxyXG4gICAgICBjZXJ0OiBwYXRoLnJlc29sdmUoXCIuL2NlcnQucGVtXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBjc3M6IHtcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgc2Nzczoge1xyXG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQHVzZSBcIi4vc3JjL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjsnLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0UyxTQUFTLGlCQUFpQjtBQUN0VSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFDakIsT0FBTyxjQUFjO0FBRXJCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQUEsRUFDakMsZUFBZSxDQUFDLFdBQVc7QUFBQSxFQUUzQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxNQUFNLEtBQUssUUFBUSxPQUFPO0FBQUEsTUFDMUIsU0FBUyxLQUFLLFFBQVEscUJBQXFCO0FBQUEsSUFDN0M7QUFBQSxFQUNGO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBO0FBQUEsRUFDYjtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVztBQUFBLE1BQzdCLE1BQU0sS0FBSyxRQUFRLFlBQVk7QUFBQSxJQUNqQztBQUFBLEVBQ0Y7QUFBQSxFQUVBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
