import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import prettierPlugin from "eslint-plugin-prettier"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"
import importPlugin from "eslint-plugin-import"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "prettier/prettier": ["error", {
        "trailingComma": "es5",
        "tabWidth": 2,
        "semi": false,
        "singleQuote": true,
        "printWidth": 120,
        "endOfLine": "lf",
        },
      ],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["sibling", "parent", "index"]],
          pathGroups: [
            {
              pattern: "@workspace/**",
              group: "external",
              position: "after",
            },
          ],
          "pathGroupsExcludedImportTypes": ["@workspace/**"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    ignores: ["dist/**"],
  },
]
