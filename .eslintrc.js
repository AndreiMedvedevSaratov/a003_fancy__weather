module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    // eslint-disable-next-line quote-props
    'indent': 'off',
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'no-plusplus': 'off',
    // eslint-disable-next-line quote-props
    'semi': 'error',
    'eol-last': 'off',
    'linebreak-style': 0,
    'import/extensions': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'no-unused-expressions': 'off',
    'no-param-reassign': 'off',
    'no-useless-return': 'off',
  },
};
