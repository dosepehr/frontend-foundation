import { defineConfig, devices } from '@playwright/test';

// Dedicated port, separate from `next dev`'s 5000 — the service worker
// (offline fallback, notifications) only registers in production (see
// docs/pwa.md), so these specs always run against a real `next build` +
// `next start`, never the dev server.
const PORT = 4300;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
    // Each spec lives in an e2e/ folder inside the unit it tests (e.g.
    // src/features/offline/e2e/offline.spec.ts) - never inside src/app, whose
    // route folders hold only their page.tsx.
    testDir: './src',
    testMatch: '**/e2e/**/*.spec.ts',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: 'html',
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: `npx next build && npx next start --port ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
});
