import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5001, // Fixed port
    proxy: {
      "/api": "http://localhost:5001",
    },
  },
});
