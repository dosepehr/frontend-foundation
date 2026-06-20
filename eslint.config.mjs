import storybook from 'eslint-plugin-storybook';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwindcss from 'eslint-plugin-tailwindcss';
import unicorn from 'eslint-plugin-unicorn';

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
    ...storybook.configs['flat/recommended'],
    // ── React Refresh ──────────────────────────────────────────────────────────
    {
        plugins: { 'react-refresh': reactRefresh },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
    // Component library files intentionally co-export variants, hooks, and components
    {
        files: ['src/components/**', '.storybook/**'],
        rules: {
            'react-refresh/only-export-components': 'off',
            '@next/next/no-img-element': 'off',
        },
    },
    // ── Tailwind CSS ───────────────────────────────────────────────────────────
    {
        plugins: { tailwindcss },
        settings: {
            tailwindcss: { cssConfigPath: './src/app/globals.css' },
        },
        rules: {
            'tailwindcss/classnames-order': 'off', // handled by prettier-plugin-tailwindcss
            'tailwindcss/no-custom-classname': 'off',
            'tailwindcss/no-contradicting-classname': 'error',
            'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
        },
    },
    // ── Unicorn ────────────────────────────────────────────────────────────────
    {
        plugins: { unicorn },
        rules: {
            'unicorn/prefer-array-flat-map': 'error',
            'unicorn/no-array-for-each': 'error',
            'unicorn/no-useless-undefined': 'error',
            'unicorn/prefer-includes': 'error',
            'unicorn/prefer-string-starts-ends-with': 'error',
            'unicorn/no-array-push-push': 'error',
            'unicorn/consistent-function-scoping': 'warn',
        },
    },
    // ── TypeScript strict ──────────────────────────────────────────────────────
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/consistent-type-imports': ['error', {
                prefer: 'type-imports',
                fixStyle: 'inline-type-imports',
            }],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
        },
    },
]);

export default eslintConfig;
