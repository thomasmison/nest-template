module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // custom rules go here
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'prettier/prettier': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/newline-after-import': 'error',
    'import/first': 'error',
  },
};
