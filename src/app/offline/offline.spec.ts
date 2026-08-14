import { expect, test } from '@playwright/test';
import { waitForServiceWorkerControl } from '../../test/e2e-helpers';

test.describe('offline fallback', () => {
    test('falls back to the precached offline page for a route never visited this session', async ({
        page,
        context,
    }) => {
        await page.goto('/');
        await waitForServiceWorkerControl(page);

        await context.setOffline(true);

        // /notification was never visited, so it isn't in the runtime pages
        // cache — the SW must serve the precached /offline page instead.
        await page.goto('/notification');
        await expect(
            page.getByRole('heading', { name: "You're offline" }),
        ).toBeVisible();
    });

    test('serves the cached copy of a previously visited page while offline', async ({
        page,
        context,
    }) => {
        await page.goto('/');
        await waitForServiceWorkerControl(page);
        // Revisit so the network-first strategy writes it into the pages cache.
        await page.reload();

        await context.setOffline(true);
        await page.goto('/');

        await expect(page.getByText('Project ready!')).toBeVisible();
        await expect(
            page.getByRole('heading', { name: "You're offline" }),
        ).not.toBeVisible();
    });
});
