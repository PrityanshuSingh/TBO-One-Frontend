import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Load environment variables
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_BASE_URL || "http://localhost:3000";

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
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/tbo":{
          target: "http://api.tektravels.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tbo/, ""),
        }
      },
    },
  };
});
