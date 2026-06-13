import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import typescript from '@vue/eslint-config-typescript';

import perfectionist from 'eslint-plugin-perfectionist';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vue from 'eslint-plugin-vue';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,jsx,cjs,mjs}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      'src/client/**', // Auto-generated OpenAPI code
    ],
  },
  ...vue.configs['flat/essential'],
  ...typescript(),
  skipFormatting,
  {
    name: 'app/rules',
    plugins: {
      'simple-import-sort': simpleImportSort,
      perfectionist,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/valid-v-bind': 'off',

      'vue/component-api-style': ['error', ['script-setup']],

      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits', 'defineSlots', 'defineOptions'],
          defineExposeLast: true,
        },
      ],

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^vue', '^@vue', '^vue-router', '^pinia'],
            ['^@?\\w'],
            ['^@/'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.s?css$'],
            ['^.*\\u0000$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        },
      ],
    },
  },
];
