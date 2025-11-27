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

      // Vue block order: template -> script -> style
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/valid-v-bind': 'off',

      // Enforce Composition API style
      'vue/component-api-style': ['error', ['script-setup']],

      // Script setup order enforcement
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits', 'defineSlots', 'defineOptions'],
          defineExposeLast: true,
        },
      ],

      // Import sorting
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Vue and framework imports first
            ['^vue', '^@vue', '^vue-router', '^pinia'],
            // External packages
            ['^@?\\w'],
            // Internal packages (@ alias)
            ['^@/'],
            // Parent imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Same folder imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.s?css$'],
            // Type imports
            ['^.*\\u0000$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Vue component attributes ordering
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
