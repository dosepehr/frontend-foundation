import OtpInput from '@/components/ui/OtpInput';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import ResendTimer from '.';

// Resolves like an SMS API call.
const fakeSend = () => new Promise<void>((resolve) => setTimeout(resolve, 800));

const meta: Meta<typeof ResendTimer> = {
    title: 'UI/ResendTimer',
    component: ResendTimer,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    argTypes: {
        seconds: { control: { type: 'number', min: 0 } },
        locale: { control: 'inline-radio', options: ['en', 'fa'] },
        disabled: { control: 'boolean' },
    },
    args: { onResend: fn(fakeSend), seconds: 60 },
};

export default meta;
type Story = StoryObj<typeof ResendTimer>;

export const Default: Story = {};

export const ShortWait: Story = {
    args: { seconds: 3 },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const button = await waitFor(
            () => canvas.getByRole('button', { name: 'Resend code' }),
            { timeout: 5000 },
        );
        await userEvent.click(button);
        await waitFor(() => expect(args.onResend).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(canvas.getByRole('timer')).toBeVisible());
    },
};

export const Persian: Story = {
    globals: { i18n: 'fa-IR' },
    args: { locale: 'fa', seconds: 120 },
    render: (args) => (
        <div dir="rtl">
            <ResendTimer {...args} />
        </div>
    ),
};

export const FailedSend: Story = {
    args: {
        seconds: 0,
        onResend: () =>
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('SMS failed')), 800),
            ),
        onError: fn(),
    },
};

export const CustomLabels: Story = {
    args: {
        seconds: 10,
        labels: {
            resend: 'Send a new code',
            countdown: (time) => <>Didn&apos;t get it? Try again in {time}</>,
        },
    },
};

const OtpStep = () => {
    const [code, setCode] = useState('');
    return (
        <div dir="rtl" className="flex w-72 flex-col gap-2">
            <OtpInput
                label="کد تأیید"
                length={5}
                value={code}
                onChange={setCode}
            />
            <ResendTimer
                locale="fa"
                seconds={59}
                onResend={() => {
                    setCode('');
                    return fakeSend();
                }}
            />
        </div>
    );
};

// The usual login step: a code input with the resend timer under it.
export const WithOtpInput: Story = {
    globals: { i18n: 'fa-IR' },
    render: () => <OtpStep />,
};
