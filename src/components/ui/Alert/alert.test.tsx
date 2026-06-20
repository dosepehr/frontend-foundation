import { render, screen } from '@testing-library/react';
import { ShieldAlert } from 'lucide-react';
import { Alert, AlertAction, AlertDescription, AlertTitle } from './components';
import AlertWrapper from './index';

describe('Alert primitives', () => {
    it('renders with role="alert"', () => {
        render(<Alert>Message</Alert>);
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders title and description', () => {
        render(
            <Alert>
                <AlertTitle>Heads up</AlertTitle>
                <AlertDescription>Something happened.</AlertDescription>
            </Alert>,
        );
        expect(screen.getByText('Heads up')).toBeInTheDocument();
        expect(screen.getByText('Something happened.')).toBeInTheDocument();
    });

    it('renders action slot', () => {
        render(
            <Alert>
                <AlertAction>
                    <button>Dismiss</button>
                </AlertAction>
            </Alert>,
        );
        expect(
            screen.getByRole('button', { name: 'Dismiss' }),
        ).toBeInTheDocument();
    });

    it('applies variant via data-slot', () => {
        render(<Alert variant="destructive">Error</Alert>);
        expect(screen.getByRole('alert')).toHaveAttribute('data-slot', 'alert');
    });

    it('forwards className', () => {
        render(<Alert className="custom-class">Content</Alert>);
        expect(screen.getByRole('alert')).toHaveClass('custom-class');
    });
});

describe('AlertWrapper', () => {
    it('renders description text', () => {
        render(<AlertWrapper>Something went wrong.</AlertWrapper>);
        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
        render(<AlertWrapper title="Warning">Watch out.</AlertWrapper>);
        expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('does not render title element when omitted', () => {
        const { container } = render(
            <AlertWrapper>No title here.</AlertWrapper>,
        );
        expect(
            container.querySelector('[data-slot="alert-title"]'),
        ).not.toBeInTheDocument();
    });

    it('renders default icon when no variant given', () => {
        render(<AlertWrapper>Default alert.</AlertWrapper>);
        // icon is an svg — confirm the alert renders
        const alert = screen.getByRole('alert');
        expect(alert.querySelector('svg')).toBeInTheDocument();
    });

    it.each([
        ['info', 'Info alert'],
        ['success', 'Success alert'],
        ['warning', 'Warning alert'],
        ['destructive', 'Error alert'],
    ] as const)('renders an icon for variant "%s"', (variant, message) => {
        render(<AlertWrapper variant={variant}>{message}</AlertWrapper>);
        const alert = screen.getByRole('alert');
        expect(alert.querySelector('svg')).toBeInTheDocument();
    });

    it('accepts a custom Icon prop that overrides the default', () => {
        render(
            <AlertWrapper Icon={ShieldAlert}>Custom icon alert.</AlertWrapper>,
        );
        const alert = screen.getByRole('alert');
        expect(alert.querySelector('svg')).toBeInTheDocument();
    });

    it('title accepts ReactNode', () => {
        render(
            <AlertWrapper
                title={<strong data-testid="bold-title">Bold</strong>}
            >
                Content
            </AlertWrapper>,
        );
        expect(screen.getByTestId('bold-title')).toBeInTheDocument();
    });
});
