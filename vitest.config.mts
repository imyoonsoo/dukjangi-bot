import { defineConfig } from "vitest/config";
import path from "node:path";

// server-only는 테스트에서 빈 모듈로 대체
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "server-only": path.resolve(import.meta.dirname, "test/empty-module.ts"),
      "@": import.meta.dirname,
    },
  },
});
