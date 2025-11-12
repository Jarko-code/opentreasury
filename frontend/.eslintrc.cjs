/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier/skip-formatting'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    // add your custom rules here
    rules: {
        'prefer-promise-reject-errors': 'off',

        quotes: ['warn', 'single', { avoidEscape: true }],

        // this rule, if on, would require explicit return type on the `render` function
        '@typescript-eslint/explicit-function-return-type': 'off',

        // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
        '@typescript-eslint/no-var-requires': 'off',

        // The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
        // does not work with type definitions
        //        "no-unused-vars": "warn",
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',

        // allow debugger during development only
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        'vue/html-self-closing': [
            'error',
            { html: { void: 'any', normal: 'any', component: 'always' } }
        ],

        'vue/match-component-file-name': [
            'error',
            {
                extensions: ['vue'],
                shouldMatchCase: true
            }
        ], //TODO - bcs of using composition api
        'vue/no-empty-component-block': 'error',
        'vue/no-potential-component-option-typo': 'error', //TODO - bcs of using composition api
        'vue/no-useless-mustaches': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/padding-line-between-blocks': 'error',
        'vue/require-direct-export': 'error', //TODO - bcs of using composition api
        'vue/require-name-property': 'error', //TODO - bcs of using composition api
        'vue/v-for-delimiter-style': 'error',
        'vue/template-curly-spacing': 'error'
    }
};
