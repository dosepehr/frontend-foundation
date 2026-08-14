import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundaryWrapper from '.';

const Bomb = (): never => {
    throw new Error('boom');
};

describe('ErrorBoundaryWrapper', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        // React logs caught render errors to console.error; silence it so
        // the expected-failure tests below don't spam test output.
        consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('renders children when nothing throws', () => {
        render(
            <ErrorBoundaryWrapper>
                <p>All good</p>
            </ErrorBoundaryWrapper>,
        );
        expect(screen.getByText('All good')).toBeInTheDocument();
    });

    it('renders the default fallback when a child throws', () => {
        render(
            <ErrorBoundaryWrapper>
                <Bomb />
            </ErrorBoundaryWrapper>,
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('boom')).toBeInTheDocument();
    });

    it('renders custom title and description when provided', () => {
        render(
            <ErrorBoundaryWrapper
                title="Failed to load widget"
                description="Try again shortly."
            >
                <Bomb />
            </ErrorBoundaryWrapper>,
        );
        expect(screen.getByText('Failed to load widget')).toBeInTheDocument();
        expect(screen.getByText('Try again shortly.')).toBeInTheDocument();
    });

    it('calls onReset when "Try again" is clicked', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();

        render(
            <ErrorBoundaryWrapper onReset={onReset}>
                <Bomb />
            </ErrorBoundaryWrapper>,
        );

        await user.click(screen.getByRole('button', { name: 'Try again' }));
        expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('calls onError when a child throws', () => {
        const onError = vi.fn();

        render(
            <ErrorBoundaryWrapper onError={onError}>
                <Bomb />
            </ErrorBoundaryWrapper>,
        );

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it('renders a custom fallback when provided', () => {
        render(
            <ErrorBoundaryWrapper fallback={() => <p>Custom fallback UI</p>}>
                <Bomb />
            </ErrorBoundaryWrapper>,
        );
        expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
        expect(
            screen.queryByText('Something went wrong'),
        ).not.toBeInTheDocument();
    });
});
