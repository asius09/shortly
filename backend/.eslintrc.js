module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'no-undef': 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    eqeqeq: ['error', 'always'],
    curly: 'error',
    semi: ['error', 'always'],
    quotes: ['error', 'double', { avoidEscape: true }],
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.config.js'],
};
