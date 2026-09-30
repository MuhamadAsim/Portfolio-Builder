import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "**/references/**", "**/.next/**"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
