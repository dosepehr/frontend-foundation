import { render, screen } from '@testing-library/react';
import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from './components';
import AvatarWrapper from './index';

describe('Avatar primitives', () => {
    it('renders with data-slot="avatar"', () => {
        const { container } = render(<Avatar />);
        expect(
            container.querySelector('[data-slot="avatar"]'),
        ).toBeInTheDocument();
    });

    it('reflects size via data-size', () => {
        const { container } = render(<Avatar size="lg" />);
        expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute(
            'data-size',
            'lg',
        );
    });

    it('defaults to size="default"', () => {
        const { container } = render(<Avatar />);
        expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute(
            'data-size',
            'default',
        );
    });

    it('forwards className', () => {
        const { container } = render(<Avatar className="custom-class" />);
        expect(container.querySelector('[data-slot="avatar"]')).toHaveClass(
            'custom-class',
        );
    });

    it('AvatarFallback renders text content', () => {
        render(
            <Avatar>
                <AvatarFallback>AB</AvatarFallback>
            </Avatar>,
        );
        expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('AvatarFallback has data-slot="avatar-fallback"', () => {
        const { container } = render(
            <Avatar>
                <AvatarFallback>AB</AvatarFallback>
            </Avatar>,
        );
        expect(
            container.querySelector('[data-slot="avatar-fallback"]'),
        ).toBeInTheDocument();
    });

    it('AvatarImage renders without errors when given src and alt', () => {
        // Radix AvatarImage does not mount an <img> until the image loads;
        // in happy-dom there is no network, so we verify no throw occurs.
        expect(() =>
            render(
                <Avatar>
                    <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>,
            ),
        ).not.toThrow();
    });

    it('AvatarBadge renders with data-slot="avatar-badge"', () => {
        const { container } = render(
            <Avatar>
                <AvatarFallback>AB</AvatarFallback>
                <AvatarBadge />
            </Avatar>,
        );
        expect(
            container.querySelector('[data-slot="avatar-badge"]'),
        ).toBeInTheDocument();
    });

    it('AvatarBadge renders children', () => {
        render(
            <Avatar>
                <AvatarFallback>AB</AvatarFallback>
                <AvatarBadge>
                    <span data-testid="badge-content" />
                </AvatarBadge>
            </Avatar>,
        );
        expect(screen.getByTestId('badge-content')).toBeInTheDocument();
    });

    it('AvatarBadge forwards className', () => {
        const { container } = render(
            <Avatar>
                <AvatarFallback>AB</AvatarFallback>
                <AvatarBadge className="bg-green-600" />
            </Avatar>,
        );
        expect(
            container.querySelector('[data-slot="avatar-badge"]'),
        ).toHaveClass('bg-green-600');
    });

    it('AvatarBadge is not clipped by Avatar (no overflow-hidden on root)', () => {
        const { container } = render(<Avatar />);
        const root = container.querySelector('[data-slot="avatar"]')!;
        expect(root.className).not.toContain('overflow-hidden');
    });

    it('AvatarGroup renders with data-slot="avatar-group"', () => {
        const { container } = render(
            <AvatarGroup>
                <Avatar>
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
            </AvatarGroup>,
        );
        expect(
            container.querySelector('[data-slot="avatar-group"]'),
        ).toBeInTheDocument();
    });

    it('AvatarGroup renders multiple avatars', () => {
        render(
            <AvatarGroup>
                <Avatar>
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarFallback>C</AvatarFallback>
                </Avatar>
            </AvatarGroup>,
        );
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('AvatarGroupCount renders with data-slot="avatar-group-count"', () => {
        const { container } = render(<AvatarGroupCount>+3</AvatarGroupCount>);
        expect(
            container.querySelector('[data-slot="avatar-group-count"]'),
        ).toBeInTheDocument();
    });

    it('AvatarGroupCount renders its label', () => {
        render(<AvatarGroupCount>+5</AvatarGroupCount>);
        expect(screen.getByText('+5')).toBeInTheDocument();
    });
});

describe('AvatarWrapper', () => {
    it('renders fallback text', () => {
        render(<AvatarWrapper fallback="AB" />);
        expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('does not render badge when badge prop is omitted', () => {
        const { container } = render(<AvatarWrapper fallback="AB" />);
        expect(
            container.querySelector('[data-slot="avatar-badge"]'),
        ).not.toBeInTheDocument();
    });

    it('renders badge when badge prop is provided', () => {
        const { container } = render(
            <AvatarWrapper fallback="AB" badge={<span />} />,
        );
        expect(
            container.querySelector('[data-slot="avatar-badge"]'),
        ).toBeInTheDocument();
    });

    it('applies badgeClassName to the badge', () => {
        const { container } = render(
            <AvatarWrapper
                fallback="AB"
                badge={<span />}
                badgeClassName="bg-green-600"
            />,
        );
        expect(
            container.querySelector('[data-slot="avatar-badge"]'),
        ).toHaveClass('bg-green-600');
    });

    it('forwards size to Avatar', () => {
        const { container } = render(<AvatarWrapper fallback="AB" size="lg" />);
        expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute(
            'data-size',
            'lg',
        );
    });

    it.each(['sm', 'default', 'lg'] as const)(
        'renders size "%s" without errors',
        (size) => {
            const { container } = render(
                <AvatarWrapper fallback="AB" size={size} />,
            );
            expect(
                container.querySelector('[data-slot="avatar"]'),
            ).toHaveAttribute('data-size', size);
        },
    );

    it('forwards className to Avatar root', () => {
        const { container } = render(
            <AvatarWrapper fallback="AB" className="custom-avatar" />,
        );
        expect(container.querySelector('[data-slot="avatar"]')).toHaveClass(
            'custom-avatar',
        );
    });

    it('renders without errors when src is provided', () => {
        // Radix AvatarImage only mounts <img> after the image loads (no network in happy-dom)
        expect(() =>
            render(
                <AvatarWrapper
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    fallback="CN"
                />,
            ),
        ).not.toThrow();
    });

    it('shows fallback when src is omitted', () => {
        render(<AvatarWrapper fallback="CN" />);
        expect(screen.getByText('CN')).toBeInTheDocument();
    });
});
