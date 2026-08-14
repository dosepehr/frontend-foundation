import { defineConfig, devices } from '@playwright/test';

// Dedicated port, separate from `next dev`'s 5000 — the service worker
// (offline fallback, notifications) only registers in production (see
// docs/pwa.md), so these specs always run against a real `next build` +
// `next start`, never the dev server.
const PORT = 4300;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
    // Specs live next to what they test (e.g. src/app/offline/offline.spec.ts),
    // matching the *.test.tsx co-location convention Vitest already uses.
    testDir: './src',
    testMatch: '**/*.spec.ts',
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
