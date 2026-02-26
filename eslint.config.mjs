import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
  features: {
    tooling   : true,
    stylistic : {
      semi        : true,
      quotes      : 'single',
      quoteProps  : 'consistent',
      braceStyle  : 'stroustrup',
      severity    : 'error',
      commaDangle : 'always-multiline',
    },
  },
  dirs: {
    src: ['./src'],
  },
})
  .override('nuxt/import/rules', {
    rules: {
      'import/first'         : 'off',
      'import/no-duplicates' : 'off',
    },
  })
  .override('nuxt/vue/rules', {
    rules: {
      'vue/no-v-html'                                 : ['off'],
      'vue/template-curly-spacing'                    : ['error', 'always'],
      'vue/no-multiple-template-root'                 : ['off'],
      'vue/multi-word-component-names'                : ['off'],
      'vue/script-indent'                             : ['error', 2, { baseIndent: 1, switchCase: 1 }],
      'vue/no-multi-spaces'                           : ['off', { ignoreProperties: true }],
      'vue/no-spaces-around-equal-signs-in-attribute' : ['off'],
      'vue/max-attributes-per-line'                   : ['warn', { singleline: { max: 3 }, multiline: { max: 1 } }],

      'vue/key-spacing': ['error', {
        multiLine: {
          beforeColon : false,
          afterColon  : true,
        },

        align: {
          beforeColon : true,
          afterColon  : true,
          on          : 'colon',
        },
      }],
    },
  })
  .override('nuxt/stylistic', {
    rules: {
      '@stylistic/key-spacing': ['error', {
        multiLine: {
          beforeColon : false,
          afterColon  : true,
        },

        align: {
          beforeColon : true,
          afterColon  : true,
          on          : 'colon',
        },
      }],

      '@stylistic/no-multi-spaces': ['error', {
        // See https://eslint.style/rules/js/no-multi-spaces#exceptions
        exceptions: {
          TSPropertySignature    : true,
          TSTypeAliasDeclaration : true,
          TSNamedTupleMember     : true,
          PropertyDefinition     : true,
          VariableDeclarator     : true,
          AssignmentExpression   : true,
        },
      }],

      '@stylistic/no-multiple-empty-lines'  : ['error', { max: 2, maxEOF: 1 }],
      '@stylistic/type-annotation-spacing'  : ['off'], // Disabling due to bug https://github.com/eslint-stylistic/eslint-stylistic/issues/476
      '@stylistic/type-named-tuple-spacing' : ['off'],
      '@stylistic/template-curly-spacing'   : ['error', 'always'],
      '@stylistic/arrow-parens'             : ['error', 'always'],
      '@stylistic/block-spacing'            : ['error', 'always'],
      '@stylistic/quote-props'              : ['error', 'consistent'],
    },
  })
  .append({
    name: 'resee/vue-stylistic-deconflict',

    rules: {
      '@stylistic/indent': 'off',
    },

    files: ['**/*.vue'],
  })
  .append({
    name: 'resee/test-rules',

    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },

    files: ['test/**/*'],
  });
