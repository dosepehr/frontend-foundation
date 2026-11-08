import { render, screen } from '@testing-library/react';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from './components';
import BreadcrumbWrapper from './index';

describe('Breadcrumb primitives', () => {
    it('renders a nav with aria-label="breadcrumb"', () => {
        render(<Breadcrumb />);
        expect(
            screen.getByRole('navigation', { name: 'breadcrumb' }),
        ).toBeInTheDocument();
    });

    it('BreadcrumbPage has aria-current="page"', () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Current</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );
        expect(screen.getByText('Current')).toHaveAttribute(
            'aria-current',
            'page',
        );
    });

    it('BreadcrumbPage has aria-disabled="true"', () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Current</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );
        expect(screen.getByText('Current')).toHaveAttribute(
            'aria-disabled',
            'true',
        );
    });

    it('BreadcrumbLink renders as an anchor by default', () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );
        const link = screen.getByRole('link', { name: 'Home' });
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', '/home');
    });

    it('BreadcrumbLink renders as child element when asChild is true', () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <button>Home</button>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );
        expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute(
            'data-slot',
            'breadcrumb-link',
        );
    });

    it('BreadcrumbSeparator renders with role="presentation" and aria-hidden', () => {
        const { container } = render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbSeparator />
                </BreadcrumbList>
            </Breadcrumb>,
        );
        const sep = container.querySelector(
            '[data-slot="breadcrumb-separator"]',
        );
        expect(sep).toHaveAttribute('role', 'presentation');
        expect(sep).toHaveAttribute('aria-hidden', 'true');
    });

    it('BreadcrumbSeparator renders custom children instead of default icon', () => {
        render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbSeparator>
                        <span data-testid="custom-sep" />
                    </BreadcrumbSeparator>
                </BreadcrumbList>
            </Breadcrumb>,
        );
        expect(screen.getByTestId('custom-sep')).toBeInTheDocument();
    });

    it('BreadcrumbEllipsis renders with aria-hidden and sr-only label', () => {
        const { container } = render(
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>,
        );
        const ellipsis = container.querySelector(
            '[data-slot="breadcrumb-ellipsis"]',
        );
        expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByText('More')).toBeInTheDocument();
    });
});

describe('BreadcrumbWrapper', () => {
    const items = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Shoes' },
    ];

    it('renders all item labels', () => {
        render(<BreadcrumbWrapper items={items} />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Shoes')).toBeInTheDocument();
    });

    it('renders last item as BreadcrumbPage (aria-current="page")', () => {
        render(<BreadcrumbWrapper items={items} />);
        expect(screen.getByText('Shoes')).toHaveAttribute(
            'aria-current',
            'page',
        );
    });

    it('renders non-last items as links', () => {
        render(<BreadcrumbWrapper items={items} />);
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
            'href',
            '/',
        );
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute(
            'href',
            '/products',
        );
    });

    it('item without href falls back to "#"', () => {
        render(
            <BreadcrumbWrapper
                items={[{ label: 'Home' }, { label: 'Page' }]}
            />,
        );
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
            'href',
            '#',
        );
    });

    it('renders separators between items', () => {
        const { container } = render(<BreadcrumbWrapper items={items} />);
        const separators = container.querySelectorAll(
            '[data-slot="breadcrumb-separator"]',
        );
        // 3 items → 2 separators
        expect(separators).toHaveLength(2);
    });

    it('renders a custom separator', () => {
        render(
            <BreadcrumbWrapper
                items={items}
                separator={<span data-testid="slash">/</span>}
            />,
        );
        expect(screen.getAllByTestId('slash')).toHaveLength(2);
    });

    it('does not collapse when ellipsis is false', () => {
        const manyItems = Array.from({ length: 6 }, (_, i) => ({
            label: `Item ${i + 1}`,
            href: `/${i + 1}`,
        }));
        render(<BreadcrumbWrapper items={manyItems} />);
        expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
        for (const { label } of manyItems)
            expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('collapses middle items with ellipsis when items exceed maxItems', () => {
        const manyItems = Array.from({ length: 6 }, (_, i) => ({
            label: `Item ${i + 1}`,
            href: `/${i + 1}`,
        }));
        const { container } = render(
            <BreadcrumbWrapper items={manyItems} ellipsis maxItems={3} />,
        );
        // first item and last two visible, middle collapsed
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 5')).toBeInTheDocument();
        expect(screen.getByText('Item 6')).toBeInTheDocument();
        expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
        expect(
            container.querySelector('[data-slot="breadcrumb-ellipsis"]'),
        ).toBeInTheDocument();
    });

    it('renders a single item without separator', () => {
        const { container } = render(
            <BreadcrumbWrapper items={[{ label: 'Only' }]} />,
        );
        expect(screen.getByText('Only')).toBeInTheDocument();
        expect(
            container.querySelectorAll('[data-slot="breadcrumb-separator"]'),
        ).toHaveLength(0);
    });
});
