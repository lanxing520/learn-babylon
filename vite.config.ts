import { fileURLToPath, URL } from "node:url"
import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
import { viteStaticCopy } from "vite-plugin-static-copy"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import path from 'path' // 明确导入 path 模块

// https://vite.dev/config/
export default defineConfig({
  base: "./", // 改为相对路径
  // build: {
  //   outDir: path.resolve(__dirname, "../build/exp6-dist"), // 现在应该可以正常工作了
  // },
  plugins: [
    vue(),
    vueDevTools(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@babylonjs/havok/lib/esm/*.wasm",
          dest: "assets",
        },
      ],
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "pinia",
        // 可以添加其他需要的自动导入
      ],
      dts: "src/auto-imports.d.ts", // 生成自动导入的TypeScript声明文件

      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  optimizeDeps: {
    exclude: ["@babylonjs/havok"],
  },
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.bin", "**/*.wasm"], // 包含GLTF相关文件
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@assets": resolve(__dirname, "src/assets"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5170,
    fs: {
      strict: false, // 允许从public目录外加载文件
    },
    headers: {
      // 确保 iframe 可以正常加载
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    // hmr: false, //禁用热更新,每次热更新刷新页面
  },
})
