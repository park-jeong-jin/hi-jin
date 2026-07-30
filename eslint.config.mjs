import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  {
    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // inline `type Foo` → 별도 `import type { Foo }`
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/no-duplicates": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "simple-import-sort/imports": [
        "error",
        {
          // 단일 그룹 → import 사이 빈 줄 없음
          // value 먼저, type은 같은 우선순위(react→next→pkg→@/→.)로 맨 아래
          groups: [
            [
              "^\\u0000",
              "^react",
              "^next",
              "^@?\\w",
              "^@/",
              "^\\.",
              "^react.*\\u0000$",
              "^next.*\\u0000$",
              "^@?\\w.*\\u0000$",
              "^@/.*\\u0000$",
              "^\\..*\\u0000$",
            ],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
