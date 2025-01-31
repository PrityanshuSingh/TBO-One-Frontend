import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_BASE_URL || "http://localhost:3000";
  const tboApiTarget = env.VITE_TBO_API_BASE_URL || "http://api.tbotechnology.in";

  return {
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          api: ["modern"],
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false, // Ensures compatibility with HTTP and HTTPS
          rewrite: (path) => path.replace(/^\/api/, ""), // Fixes path rewriting
        },
        "/tbo": {
          target: tboApiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/tbo/, ""),
        },
      },
    },
  };
});
