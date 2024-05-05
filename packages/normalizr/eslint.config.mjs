// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      commaDangle: 'always-multiline',
    },
  },
})
  .override('nuxt/javascript', {
    rules: {
      'curly': ['error', 'all'], // Including if blocks with a single statement
      'dot-notation': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
      'no-lonely-if': 'error', // No single if in an "else" block
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: false }],
      'require-await': 'error',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
    },
  })

  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
        },
      ],
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      ...{
        // TODO: Discuss if we want to enable this
        '@typescript-eslint/ban-types': 'off',
        // TODO: Discuss if we want to enable this
        '@typescript-eslint/no-explicit-any': 'off',
        // TODO: Discuss if we want to enable this
        '@typescript-eslint/no-invalid-void-type': 'off',
      },
    },
  })

  // Stylistic rules
  .override('nuxt/stylistic', {
    rules: {
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/indent-binary-ops': 'off',
      '@stylistic/max-statements-per-line': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/quote-props': ['error', 'consistent'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
    },
  })

  .append(
    {
      files: ['tests/**'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  )
