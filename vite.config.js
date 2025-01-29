// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { Buffer } from "node:buffer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_BASE_URL || "http://localhost:3000";

  return {
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          api: ["modern"],
          silenceDeprecations: ["legacy-js-api"]
        }
      }
    },
    server: {
      proxy: {
        // Local API route
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
        // Development proxy for TBO calls
        "/tbo": {
          target: "http://sharedapi.tektravels.com",
          changeOrigin: true,
          // For example: "/tbo/auth" => "http://sharedapi.tektravels.com/SharedData.svc/rest/Authenticate"
          // Adjust rewriting for your TBO routes as needed
          rewrite: (path) => {
            if (path.startsWith("/tbo/auth")) {
              return path.replace("/tbo/auth", "/SharedData.svc/rest/Authenticate");
            }
            if (path.startsWith("/tbo/logout")) {
              return path.replace("/tbo/logout", "/SharedData.svc/rest/Logout");
            }
            return path.replace(/^\/tbo/, "/TBOHolidays_HotelAPI");
          },
          // configure: (proxy) => {
          //   proxy.on("proxyReq", (proxyReq, req) => {
          //     // Optionally set headers, tokens or additional config here
          //     try {
          //       // Example to set Basic Auth, if needed
          //       // const authString = Buffer.from("username:password").toString("base64");
          //       // proxyReq.setHeader("Authorization", `Basic ${authString}`);
          //     } catch (err) {
          //       console.error("Proxy error:", err);
          //     }
          //   });
          // }
        }
      }
    }
  };
});
