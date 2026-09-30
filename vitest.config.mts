import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "**/references/**", "**/.next/**"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    setupFiles: ["./src/test/setup.ts"],
  },
});
