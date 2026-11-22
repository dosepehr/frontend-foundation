import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResendTimer from '.';

const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe('ResendTimer', () => {
    beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
    afterEach(() => vi.useRealTimers());

    it('counts down before the code can be resent', () => {
        render(<ResendTimer onResend={vi.fn()} />);
        expect(screen.getByRole('timer')).toHaveTextContent(
            'Resend code in 1:00',
        );
        wait(1000);
        expect(screen.getByRole('timer')).toHaveTextContent('0:59');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows the resend button once the wait is over', () => {
        render(<ResendTimer seconds={5} onResend={vi.fn()} />);
        wait(5000);
        expect(screen.queryByRole('timer')).not.toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Resend code' }),
        ).toBeEnabled();
    });

    it('resends and starts the wait again', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onResend = vi.fn(() => Promise.resolve());
        render(<ResendTimer seconds={5} onResend={onResend} />);
        wait(5000);

        await user.click(screen.getByRole('button', { name: 'Resend code' }));
        expect(onResend).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('timer')).toHaveTextContent('0:05');
    });

    it('shows the sending state while onResend is pending', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(
            <ResendTimer seconds={1} onResend={() => new Promise(() => {})} />,
        );
        wait(1000);
        await user.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveTextContent('Sending...');
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('keeps the button after a failed send', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onError = vi.fn();
        render(
            <ResendTimer
                seconds={1}
                onResend={() => Promise.reject(new Error('SMS failed'))}
                onError={onError}
            />,
        );
        wait(1000);
        await user.click(screen.getByRole('button'));
        expect(onError).toHaveBeenCalledWith(new Error('SMS failed'));
        expect(
            screen.getByRole('button', { name: 'Resend code' }),
        ).toBeEnabled();
    });

    it('uses Persian copy and digits for fa', () => {
        render(<ResendTimer locale="fa" seconds={90} onResend={vi.fn()} />);
        expect(screen.getByRole('timer')).toHaveTextContent(
            '۱:۳۰ تا ارسال مجدد کد',
        );
        wait(90_000);
        expect(
            screen.getByRole('button', { name: 'ارسال مجدد کد' }),
        ).toBeInTheDocument();
    });

    it('lets labels override the locale copy', () => {
        render(
            <ResendTimer
                seconds={3}
                onResend={vi.fn()}
                labels={{
                    resend: 'Send again',
                    countdown: (time) => <>Wait {time}</>,
                }}
            />,
        );
        expect(screen.getByRole('timer')).toHaveTextContent('Wait 0:03');
        wait(3000);
        expect(screen.getByRole('button')).toHaveTextContent('Send again');
    });

    it('disables the button', () => {
        render(<ResendTimer seconds={0} disabled onResend={vi.fn()} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('forwards className', () => {
        const { container } = render(
            <ResendTimer onResend={vi.fn()} className="mt-4" />,
        );
        expect(
            container.querySelector('[data-slot="resend-timer"]'),
        ).toHaveClass('mt-4');
    });
});
