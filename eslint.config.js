import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import sveltePlugin from 'eslint-plugin-svelte'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      semi: ['error', 'never'],
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.svelte'],
    ...sveltePlugin.configs.recommended,
    plugins: {
      svelte: sveltePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      semi: ['error', 'never'],
      'prettier/prettier': 'error',
    },
  },
  prettierConfig,
]
