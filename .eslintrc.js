module.exports = {
  env: {
    browser: false,
    es2021: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'standard-with-typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  reportUnusedDisableDirectives: true,
  rules: {
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false
      }
    ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        // TODO: Figure out which VS Code setting is enforcing named: never and disable it so that this can be 'always'
        named: 'never',
        anonymous: 'always',
        asyncArrow: 'always'
      }
    ],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    // TODO: Something is mysteriously enforcing 'after' for functions, but 'before'/'neither' for class methods
    // Eslint doesn't allow that granularity ???
    'generator-star-spacing': 'off'
  }
}
