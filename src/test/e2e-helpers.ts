import type { Page } from '@playwright/test';

// Waits for the service worker to install, activate, and take control of the
// page, including the reload that follows.
//
// `navigator.serviceWorker.controller` flips to non-null the instant
// `self.clients.claim()` runs in the SW's `activate` handler — the same
// event (`controllerchange`) that makes `ServiceWorkerRegister` fire a
// one-time `location.reload()`. Those two things happen back-to-back, so a
// caller that proceeds the moment `.controller` is truthy can start
// interacting with (or navigating) the pre-reload document just as the app
// starts reloading it out from under them — e.g. a caller's own
// `page.reload()` collides with the app's and aborts, or
// `getRegistration()` resolves against a document that's mid-teardown.
// Settling briefly and re-confirming avoids that race.
export const waitForServiceWorkerControl = async (page: Page) => {
    await page.waitForFunction(
        () => navigator.serviceWorker.controller !== null,
        { timeout: 30_000 },
    );
    await page.waitForTimeout(500);
    await page.waitForLoadState('load');
    await page.waitForFunction(
        () => navigator.serviceWorker.controller !== null,
        { timeout: 30_000 },
    );
};
