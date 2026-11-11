import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export function createConfig({
  files = ['**/*.js'],
  ignores = [],
  globals: extraGlobals = {},
  rules = {},
} = {}) {
  return [
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        ...ignores,
      ],
    },
    {
      files,
      ...js.configs.recommended,
      languageOptions: {
        parser: babelParser,
        parserOptions: {
          requireConfigFile: false,
          babelOptions: {
            presets: ['@babel/preset-flow'],
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        globals: {
          ...globals.node,
          ...extraGlobals,
        },
      },
      plugins: {
        prettier,
      },
      rules: {
        ...js.configs.recommended.rules,
        'prettier/prettier': 'error',
        'no-constant-condition': ['error', { checkLoops: false }],
        'no-console': 'warn',
        'no-unused-vars': [
          'error',
          { args: 'none', caughtErrors: 'none' },
        ],
        ...rules,
      },
    },
    prettierConfig,
  ];
}

export default createConfig();
