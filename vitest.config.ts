import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname =
    typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

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
                    alias: {
                        '@': path.resolve(dirname, '.'),
                    },
                },
            },

            // ─── Storybook story tests ───────────────────────────────────────
            {
                extends: true,
                plugins: [
                    storybookTest({ configDir: path.join(dirname, '.storybook') }),
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
