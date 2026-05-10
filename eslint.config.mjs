import { FlatCompat } from '@eslint/eslintrc';
import nxEslintPlugin from '@nx/eslint-plugin';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import tsParser from '@typescript-eslint/parser'; // 1. Import parser
import tsPlugin from '@typescript-eslint/eslint-plugin'; // 2. Import plugin TS

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  { plugins: { '@nx': nxEslintPlugin, '@typescript-eslint': tsPlugin } }, // 3. Thêm plugin TS

  // Cấu hình riêng cho TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser, // 4. Chỉ định parser ở đây
      parserOptions: {
        project: ['./tsconfig.*.json'], // Kết nối với tsconfig của bạn
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules, // Sử dụng các rules TS mặc định
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            { sourceTag: 'scope:client', onlyDependOnLibsWithTags: ['scope:shared'] },
            { sourceTag: 'scope:service', onlyDependOnLibsWithTags: ['scope:shared'] },
          ],
        },
      ],
    },
  },

  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', '.nx/**'],
  },
];
