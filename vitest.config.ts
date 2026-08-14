import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname =
    typeof __dirname !== 'undefined'
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            include: ['src/components/**', 'src/utils/**'],
            exclude: [
                '**/*.stories.*',
                '**/*.types.*',
                '**/index.ts',
                'src/components/_icons/**',
                'src/components/ui/ThemeChanger/**',
            ],
        },
        projects: [
            // ─── Unit tests (components, utils) ─────────────────────────────
            {
                plugins: [react()],
                test: {
                    name: 'unit',
                    environment: 'happy-dom',
                    globals: true,
                    setupFiles: ['./src/test/setup.ts'],
                    include: ['src/**/*.test.{ts,tsx}'],
                    exclude: ['src/**/*.stories.{ts,tsx}', 'node_modules'],
                },
                resolve: {
                    // Mirrors tsconfig.json's `paths` — most specific first,
                    // since Vite picks the first matching alias.
                    alias: [
                        {
                            find: '@/components',
                            replacement: path.resolve(
                                dirname,
                                './src/components',
                            ),
                        },
                        {
                            find: '@/utils',
                            replacement: path.resolve(dirname, './src/utils'),
                        },
                        {
                            find: '@/hooks',
                            replacement: path.resolve(
                                dirname,
                                './src/utils/hooks',
                            ),
                        },
                        { find: '@', replacement: path.resolve(dirname, '.') },
                    ],
                },
            },

            // ─── Storybook story tests ───────────────────────────────────────
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, '.storybook'),
                    }),
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [{ browser: 'chromium' }],
                    },
                },
            },
        ],
    },
});
