module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': 'off',
    'no-debugger': 'off',
    'no-multiple-empty-lines': 'off',
    'no-trailing-spaces': 'off',
    'padded-blocks': 'off',
    'vue/attribute-hyphenation': 'error',
    'vue/html-closing-bracket-newline': 'error',
    'vue/html-closing-bracket-spacing': 'error',
    'vue/html-end-tags': 'error',
    'vue/html-indent': 'error',
    'vue/html-quotes': 'error',
    'vue/html-self-closing': 'error',
    'vue/max-attributes-per-line': 'error',
    'vue/multiline-html-element-content-newline': 'error',
    'vue/mustache-interpolation-spacing': 'error',
    'vue/name-property-casing': 'error',
    'vue/no-multi-spaces': 'error',
    'vue/no-spaces-around-equal-signs-in-attribute': 'error',
    'vue/no-template-shadow': 'error',
    'vue/attributes-order': 'error',
    'vue/no-confusing-v-for-v-if': 'error',
    'vue/no-v-html': 'error',
    'vue/order-in-components': 'error',
    'vue/this-in-template': 'error',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
