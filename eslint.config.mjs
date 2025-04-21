import { config as baseConfig } from '@workspace/eslint-config/base'

export default [
  {
    ignores: ['apps/**', 'packages/**'],
  },
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
]
