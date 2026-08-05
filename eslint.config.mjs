import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const dataLayerImportRestriction = {
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: '@/app/_lib/data',
          message:
            'Do not import `_lib/data` from client modules. Use Server Actions (`_lib/actions`) or pass data from a Server Component page.',
        },
      ],
      patterns: [
        {
          group: ['@/app/_lib/data/*', '**/app/_lib/data/*'],
          message:
            'Do not import `_lib/data` from client modules. Use Server Actions (`_lib/actions`) or pass data from a Server Component page.',
        },
      ],
    },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: [
      'src/app/_lib/hooks/**/*.{ts,tsx}',
      'src/app/_lib/components/**/*.{ts,tsx}',
      'src/app/**/*Client*.{ts,tsx}',
      'src/app/providers.tsx',
      'src/app/dashboard/**/_components/**/*.{ts,tsx}',
    ],
    ignores: [
      'src/app/dashboard/courses/_components/Classes/Classes.tsx',
      'src/app/dashboard/manage-courses/_components/Classes/Classes.tsx',
    ],
    rules: dataLayerImportRestriction,
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    '_build_check/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
