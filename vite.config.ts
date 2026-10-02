import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// SPA with hash routing. Progress lives in the browser and syncs to backend/server.ts when signed in.
// `dist/` also works on a plain static host; accounts then simply stay unavailable.
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  server: {
    port: 5173,
    // The API server (backend/server.ts) runs on 8787 during development.
    proxy: { "/api": "http://localhost:8787" },
  },
  build: { outDir: "dist", emptyOutDir: true },
});
