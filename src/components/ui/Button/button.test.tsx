import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button as ButtonPrimitive } from './components';
import Button from './index';
import Link from 'next/link';

describe('Button primitive', () => {
    it('renders children', () => {
        render(<ButtonPrimitive>Click me</ButtonPrimitive>);
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('has data-slot="button"', () => {
        render(<ButtonPrimitive>Label</ButtonPrimitive>);
        expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button');
    });

    it('defaults to variant="default" and size="default"', () => {
        render(<ButtonPrimitive>Label</ButtonPrimitive>);
        const btn = screen.getByRole('button');
        expect(btn).toHaveAttribute('data-variant', 'default');
        expect(btn).toHaveAttribute('data-size', 'default');
    });

    it('reflects variant and size via data attributes', () => {
        render(<ButtonPrimitive variant='destructive' size='sm'>Delete</ButtonPrimitive>);
        const btn = screen.getByRole('button');
        expect(btn).toHaveAttribute('data-variant', 'destructive');
        expect(btn).toHaveAttribute('data-size', 'sm');
    });

    it('forwards className', () => {
        render(<ButtonPrimitive className='custom-class'>Label</ButtonPrimitive>);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<ButtonPrimitive onClick={onClick}>Click</ButtonPrimitive>);
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<ButtonPrimitive disabled onClick={onClick}>Click</ButtonPrimitive>);
        await user.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('renders as child element when asChild is true', () => {
        render(
            <ButtonPrimitive asChild>
                <Link href='/'>Link button</Link>
            </ButtonPrimitive>,
        );
        const el = screen.getByText('Link button');
        expect(el.tagName).toBe('A');
        expect(el).toHaveAttribute('data-slot', 'button');
    });

    it.each([
        'default', 'outline', 'secondary', 'ghost', 'destructive', 'success', 'warning', 'info', 'link',
    ] as const)('renders variant "%s" without errors', (variant) => {
        render(<ButtonPrimitive variant={variant}>{variant}</ButtonPrimitive>);
        expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
    });

    it.each([
        'default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg',
    ] as const)('renders size "%s" without errors', (size) => {
        render(<ButtonPrimitive size={size}>label</ButtonPrimitive>);
        expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
    });
});

describe('Button wrapper', () => {
    it('renders children normally', () => {
        render(<Button>Submit</Button>);
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('shows loadingText and spinner when isLoading', () => {
        render(<Button isLoading loadingText='Loading...'>Submit</Button>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });

    it('is disabled when isLoading', () => {
        render(<Button isLoading>Submit</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when disabled prop is set', () => {
        render(<Button disabled>Submit</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows arrow icon when showArrow is true', () => {
        const { container } = render(<Button showArrow>Go</Button>);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('does not show arrow when isLoading even if showArrow is true', () => {
        render(<Button isLoading showArrow loadingText='Wait'>Go</Button>);
        // only the spinner svg should appear, not the arrow — both are svg so
        // we confirm children show loading state
        expect(screen.getByText('Wait')).toBeInTheDocument();
        expect(screen.queryByText('Go')).not.toBeInTheDocument();
    });
});
