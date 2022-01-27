/** @type { import('eslint').Linter.Config } */
const config = {
   root: true,
   env: {
      browser: true,
      es2021: true,
      node: true,
   },
   extends: 'airbnb-typescript-prettier',
   parserOptions: {
      ecmaVersion: 2021,
   },
   rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
      'no-console': 'off',
      'class-methods-use-this': 'off',
      'import/extensions': 'off',
      'import/no-absolute-path': 'off',
      'import/no-unresolved': 'off',
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'react/function-component-definition': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'react/no-unstable-nested-components': 'off',
      'react-hooks/rules-of-hooks': 'off',
   },
   overrides: [
      {
         files: '*.d.ts',
         rules: {
            'no-var': 'off',
         },
      },
   ],
};

module.exports = config;
