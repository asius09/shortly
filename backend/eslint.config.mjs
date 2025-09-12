import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: 2021,
      sourceType: 'commonjs',
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
