module.exports = {
  env: {
    browser: false,
    es2021: true
  },
  extends: ['standard-with-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  reportUnusedDisableDirectives: true,
  rules: {}
}
