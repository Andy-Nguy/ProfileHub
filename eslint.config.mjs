import { FlatCompat } from '@eslint/eslintrc';
import nxEslintPlugin from '@nx/eslint-plugin';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  { plugins: { '@nx': nxEslintPlugin } },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
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
