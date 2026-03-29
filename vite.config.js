import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    strictPort: true,
    proxy: {
      "/send": "http://localhost:3000",
      "/status": "http://localhost:3000",
    },
  },
});
