import { expect, test } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { waitForServiceWorkerControl } from '../../../test/e2e-helpers';

// `registration.update()`'s own network request for /sw.js is dispatched by
// the browser's internal service worker machinery, not the page — Playwright
// can't intercept it (confirmed empirically: a context.route('**/sw.js')
// handler fires once for the initial registration and never again for the
// update check). `next start` serves everything under public/ straight from
// disk on every request with no caching, so briefly editing the real
// public/sw.js is the only reliable way to make the browser's own
// byte-comparison see a new version — reverted in `finally` either way.
const SW_PATH = path.join(process.cwd(), 'public', 'sw.js');

test.describe('service worker update flow', () => {
    test('prompts to reload when a new version is found, and activates it on accept', async ({
        page,
    }) => {
        await page.goto('/');
        await waitForServiceWorkerControl(page);

        const original = await readFile(SW_PATH, 'utf-8');
        const updated = original.replace(
            "const VERSION = 'v1';",
            "const VERSION = 'v2';",
        );
        expect(updated).not.toBe(original);

        try {
            await writeFile(SW_PATH, updated);

            await page.evaluate(async () => {
                const registration =
                    await navigator.serviceWorker.getRegistration();
                if (!registration) {
                    throw new Error('No active service worker registration');
                }
                await registration.update();
            });

            await expect(page.getByText('Update available')).toBeVisible({
                timeout: 15_000,
            });

            const reloaded = page.waitForEvent('load');
            await page.getByRole('button', { name: 'Reload' }).click();
            await reloaded;

            // The new worker has taken over: its `activate` handler deletes
            // the old version's caches and creates its own (see
            // public/sw.js), so this is real proof v2 is running, not just
            // that a button worked.
            const cacheKeys = await page.evaluate(() => caches.keys());
            expect(cacheKeys).toContain('ff-precache-v2');
            expect(cacheKeys).not.toContain('ff-precache-v1');

            await expect(page.getByText('Update available')).not.toBeVisible();
        } finally {
            await writeFile(SW_PATH, original);
        }
    });
});
