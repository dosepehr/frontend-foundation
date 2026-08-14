import { expect, test, type Page } from '@playwright/test';
import { waitForServiceWorkerControl } from '../../test/e2e-helpers';

type ShownNotification = { title: string; options?: NotificationOptions };
type NotificationWindow = Window & { __shown: ShownNotification[] };

const getShown = (page: Page) =>
    page.evaluate(() => (window as unknown as NotificationWindow).__shown);

// The real Notification permission prompt and the notifications it produces
// are OS-level UI — invisible to Playwright and nonexistent in happy-dom.
// Stubbing both `Notification` and `ServiceWorkerRegistration.showNotification`
// (the app prefers the SW path once a registration exists — see
// `useNotification`) records what the app *tried* to show without needing a
// native permission prompt in headless Chromium.
const stubNotifications = (page: Page, permission: NotificationPermission) =>
    page.addInitScript((initialPermission: NotificationPermission) => {
        const win = window as unknown as NotificationWindow;
        win.__shown = [];
        const currentPermission = initialPermission;

        class FakeNotification {
            static get permission() {
                return currentPermission;
            }
            static requestPermission() {
                return Promise.resolve(currentPermission);
            }
            constructor(title: string, options?: NotificationOptions) {
                win.__shown.push({ title, options });
            }
        }

        Object.defineProperty(window, 'Notification', {
            value: FakeNotification,
            writable: true,
        });

        if ('ServiceWorkerRegistration' in window) {
            window.ServiceWorkerRegistration.prototype.showNotification =
                function (title: string, options?: NotificationOptions) {
                    win.__shown.push({ title, options });
                    return Promise.resolve();
                };
        }
    }, permission);

test.describe('notification flow', () => {
    test('shows a system notification and resets the form once permission is granted', async ({
        page,
        context,
    }) => {
        await context.grantPermissions(['notifications']);
        await stubNotifications(page, 'granted');

        await page.goto('/notification');
        await waitForServiceWorkerControl(page);
        const input = page.getByPlaceholder('Type a message…');
        await input.fill('Build finished');
        await page.getByRole('button', { name: 'Notify' }).click();

        await expect(input).toHaveValue('');
        await expect.poll(async () => (await getShown(page)).length).toBe(1);
        const [shown] = await getShown(page);
        expect(shown.options?.body).toBe('Build finished');
    });

    test('shows an error and keeps the form when permission is denied', async ({
        page,
    }) => {
        await stubNotifications(page, 'denied');

        await page.goto('/notification');
        await waitForServiceWorkerControl(page);
        const input = page.getByPlaceholder('Type a message…');
        await input.fill('Should not send');
        await page.getByRole('button', { name: 'Notify' }).click();

        await expect(page.getByText('Notifications are blocked')).toBeVisible();
        // Not reset — `notify()` only calls `reset()` on success.
        await expect(input).toHaveValue('Should not send');
    });
});
