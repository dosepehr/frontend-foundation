import { render, screen } from '@testing-library/react';
import { Badge } from './index';
import Link from 'next/link';

describe('Badge', () => {
    it('renders text content', () => {
        render(<Badge>New</Badge>);
        expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders as a span by default', () => {
        render(<Badge>Label</Badge>);
        expect(screen.getByText('Label').tagName).toBe('SPAN');
    });

    it('has data-slot="badge"', () => {
        render(<Badge>Label</Badge>);
        expect(screen.getByText('Label')).toHaveAttribute('data-slot', 'badge');
    });

    it('reflects variant via data-variant', () => {
        render(<Badge variant='destructive'>Error</Badge>);
        expect(screen.getByText('Error')).toHaveAttribute(
            'data-variant',
            'destructive'
        );
    });

    it('reflects appearance via data-appearance', () => {
        render(<Badge appearance='solid'>Solid</Badge>);
        expect(screen.getByText('Solid')).toHaveAttribute(
            'data-appearance',
            'solid'
        );
    });

    it('defaults to variant="default" and appearance="soft"', () => {
        render(<Badge>Default</Badge>);
        const el = screen.getByText('Default');
        expect(el).toHaveAttribute('data-variant', 'default');
        expect(el).toHaveAttribute('data-appearance', 'soft');
    });

    it('forwards className', () => {
        render(<Badge className='custom-class'>Label</Badge>);
        expect(screen.getByText('Label')).toHaveClass('custom-class');
    });

    it('renders as child element when asChild is true', () => {
        render(
            <Badge asChild>
                <Link href='/'>Link badge</Link>
            </Badge>
        );
        const el = screen.getByText('Link badge');
        expect(el.tagName).toBe('A');
        expect(el).toHaveAttribute('data-slot', 'badge');
    });

    it.each([
        'default',
        'secondary',
        'destructive',
        'success',
        'warning',
        'info',
        'outline',
        'ghost',
        'link',
    ] as const)('renders variant "%s" without errors', (variant) => {
        render(<Badge variant={variant}>{variant}</Badge>);
        expect(screen.getByText(variant)).toBeInTheDocument();
    });

    it.each(['solid', 'soft'] as const)(
        'renders appearance "%s" without errors',
        (appearance) => {
            render(<Badge appearance={appearance}>{appearance}</Badge>);
            expect(screen.getByText(appearance)).toBeInTheDocument();
        }
    );
});

