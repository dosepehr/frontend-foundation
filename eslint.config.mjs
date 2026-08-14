import storybook from 'eslint-plugin-storybook';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwindcss from 'eslint-plugin-tailwindcss';
import unicorn from 'eslint-plugin-unicorn';
import jsxA11y from 'eslint-plugin-jsx-a11y';

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
        'public/stories/**',
        'public/r/**',
        'storybook-static/**',
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
    // ── Accessibility (jsx-a11y) ──────────────────────────────────────────────
    // eslint-config-next already enables a handful of jsx-a11y rules (alt-text,
    // aria-props/proptypes, etc.) — this adds the full recommended set, plus
    // turns on control-has-associated-label (off by default even in
    // "recommended") mapped onto our own icon-capable wrapper components, so a
    // <Button size="icon"><TrashIcon /></Button> with no aria-label is flagged
    // at lint time. Only catches direct JSX usage — components that take
    // icon-only content through a data/array prop (ButtonGroup's `items`,
    // Breadcrumb's `items`) aren't visible to static analysis this way.
    {
        // eslint-config-next already registers the "jsx-a11y" plugin instance —
        // redeclaring it in `plugins` throws a "cannot redefine plugin" config
        // error, so only the rule set is merged in here, not `jsxA11y.flatConfigs`
        // itself.
        rules: {
            ...jsxA11y.flatConfigs.recommended.rules,
            'jsx-a11y/control-has-associated-label': ['warn', {
                controlComponents: ['Button', 'Toggle', 'ToggleGroupItem'],
                ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
                ignoreRoles: [
                    'grid', 'listbox', 'menu', 'menubar', 'radiogroup',
                    'row', 'tablist', 'toolbar', 'tree', 'treegrid',
                ],
            }],
        },
    },
    // Story/test files are demo and test scaffolding, never shipped UI — a
    // placeholder href="#" or an empty control in a mock render() is noise,
    // not a real accessibility bug. Real component source files (index.tsx,
    // components.tsx) keep full jsx-a11y strictness.
    {
        files: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}'],
        rules: {
            'jsx-a11y/anchor-is-valid': 'off',
            'jsx-a11y/anchor-has-content': 'off',
            'jsx-a11y/control-has-associated-label': 'off',
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
