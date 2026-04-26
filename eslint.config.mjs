import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

// Lint du noyau testable (`src/core.mjs`), de ses tests et des configs.
// `index.html` n'est volontairement pas linté : il mélange HTML + CSS + JS et
// sera découpé avec Vite/esbuild dans une itération ultérieure (roadmap phase 1).
export default [
  js.configs.recommended,
  prettier,
  {
    files: ['src/**/*.{js,mjs}', 'tests/**/*.{js,mjs}', 'vitest.config.mjs', 'eslint.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
  {
    files: ['tests/**/*.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    ignores: ['node_modules/**', 'vendor/**', 'package-lock.json', '*.min.js', '.netlify/**'],
  },
];
