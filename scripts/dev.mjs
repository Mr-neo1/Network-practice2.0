// `npm run dev`: runs the API server (with restart on change) and the Vite dev server together.
import { spawn } from "node:child_process";

const procs = [
  spawn(process.execPath, ["--no-warnings=ExperimentalWarning", "--watch-path=backend", "--watch-path=src/lib/progress-model.ts", "backend/server.ts"], {
    stdio: "inherit",
    env: { ...process.env, PORT: process.env.API_PORT ?? "8787" },
  }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js", ...process.argv.slice(2)], { stdio: "inherit" }),
];

const stop = () => procs.forEach((p) => p.kill());
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
procs.forEach((p) => p.on("exit", (code) => code && code !== 0 && stop()));
