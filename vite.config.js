import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  if (command === "serve") {
    // Local development
    return {
      plugins: [react()],
      server: {
        host: true,
        port: 5173,
        allowedHosts: [env.VITE_NGROK_URL || "localhost"]
      }
    };
  } else {
    // Build / deployment
    return {
      plugins: [react()],
      build: {
        outDir: "dist"
      }
    };
  }
});
