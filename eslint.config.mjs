import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import vitest from "eslint-plugin-vitest";
import testingLibrary from "eslint-plugin-testing-library";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.test.{ts,tsx}"],
    plugins: {
      ...vitest.configs.recommended.plugins,
      ...testingLibrary.configs["flat/react"].plugins,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...testingLibrary.configs["flat/react"].rules,
      // globals:true 미설정으로 테스트마다 렌더 결과가 남으니 cleanup 필요
      "testing-library/no-manual-cleanup": "off",
    },
  },
  // 포맷팅 관련 ESLint 규칙 끄기. 겉모양은 Prettier가 담당. 반드시 맨 마지막.
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
