import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { worker } from '@/src/mocks/browser';
import { loginScenarios } from '@/src/mocks/handlers/auth.handlers';
import { LoginPage } from './LoginPage';

const meta: Meta<typeof LoginPage> = {
    title: 'Features/Auth/LoginPage',
    component: LoginPage,
    parameters: { layout: 'fullscreen' },
    beforeEach() {
        return () => worker.resetHandlers();
    },
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

async function fillAndSubmit(canvas: ReturnType<typeof within>) {
    await userEvent.type(canvas.getByPlaceholderText('you@example.com'), 'user@example.com');
    await userEvent.type(canvas.getByPlaceholderText('••••••••'), 'secret123');
    await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));
}

// Global handler fires → success
export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await fillAndSubmit(canvas);
        await expect(
            canvas.findByText('Logged in successfully.'),
        ).resolves.toBeInTheDocument();
    },
};

// Idle state — form visible, nothing submitted yet
export const Idle: Story = {};

// Loading state — override with a slow handler so the spinner is visible
export const Loading: Story = {
    play: async ({ canvasElement }) => {
        worker.use(loginScenarios.slowResponse);
        const canvas = within(canvasElement);
        await fillAndSubmit(canvas);
        await expect(
            canvas.findByText('Signing in...'),
        ).resolves.toBeInTheDocument();
    },
};

// 401 — wrong credentials
export const InvalidCredentials: Story = {
    play: async ({ canvasElement }) => {
        worker.use(loginScenarios.invalidCredentials);
        const canvas = within(canvasElement);
        await fillAndSubmit(canvas);
        await expect(
            canvas.findByText('Invalid email or password.'),
        ).resolves.toBeInTheDocument();
    },
};

// 500 — server blew up
export const ServerError: Story = {
    play: async ({ canvasElement }) => {
        worker.use(loginScenarios.serverError);
        const canvas = within(canvasElement);
        await fillAndSubmit(canvas);
        await expect(
            canvas.findByText('Server error. Please try again later.'),
        ).resolves.toBeInTheDocument();
    },
};

// No response at all
export const NetworkError: Story = {
    play: async ({ canvasElement }) => {
        worker.use(loginScenarios.networkError);
        const canvas = within(canvasElement);
        await fillAndSubmit(canvas);
        await expect(
            canvas.findByText('Network error. Please try again.'),
        ).resolves.toBeInTheDocument();
    },
};
