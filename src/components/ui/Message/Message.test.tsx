import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MessageWrapper from '.';
import { MessageGroup } from './components';

// ─── MessageWrapper ────────────────────────────────────────────────────────

describe('MessageWrapper', () => {
    it('renders with data-slot', () => {
        const { container } = render(<MessageWrapper>text</MessageWrapper>);
        expect(container.querySelector('[data-slot="message"]')).toBeTruthy();
    });

    it('defaults data-align to start', () => {
        const { container } = render(<MessageWrapper>text</MessageWrapper>);
        expect(container.querySelector('[data-align="start"]')).toBeTruthy();
    });

    it.each<'start' | 'end'>(['start', 'end'])(
        'accepts align="%s"',
        (align) => {
            const { container } = render(
                <MessageWrapper align={align}>text</MessageWrapper>,
            );
            expect(
                container.querySelector(`[data-align="${align}"]`),
            ).toBeTruthy();
        },
    );

    it('renders a MessageContent slot', () => {
        const { container } = render(<MessageWrapper>text</MessageWrapper>);
        expect(
            container.querySelector('[data-slot="message-content"]'),
        ).toBeTruthy();
    });

    it('forwards className to the root message', () => {
        const { container } = render(
            <MessageWrapper className="my-class">text</MessageWrapper>,
        );
        expect(
            container.querySelector('[data-slot="message"]')?.className,
        ).toContain('my-class');
    });

    // ─── Bubble content ────────────────────────────────────────────────────

    it('renders children inside a Bubble by default', () => {
        const { container } = render(
            <MessageWrapper>How can I help you today?</MessageWrapper>,
        );
        expect(container.querySelector('[data-slot="bubble"]')).toBeTruthy();
        expect(
            container.querySelector('[data-slot="bubble-content"]'),
        ).toBeTruthy();
        expect(screen.getByText('How can I help you today?')).toBeTruthy();
    });

    it('does not render a Bubble when children is omitted', () => {
        const { container } = render(<MessageWrapper avatarFallback="CN" />);
        expect(container.querySelector('[data-slot="bubble"]')).toBeNull();
    });

    it('passes variant to the Bubble', () => {
        const { container } = render(
            <MessageWrapper variant="destructive">
                Failed to send.
            </MessageWrapper>,
        );
        expect(
            container.querySelector('[data-variant="destructive"]'),
        ).toBeTruthy();
    });

    it('passes align to the Bubble', () => {
        const { container } = render(
            <MessageWrapper align="end">text</MessageWrapper>,
        );
        expect(
            container.querySelector('[data-slot="bubble"][data-align="end"]'),
        ).toBeTruthy();
    });

    it('renders BubbleContent as child element when contentAsChild is true', () => {
        render(
            <MessageWrapper contentAsChild>
                <a href="#">View the changelog</a>
            </MessageWrapper>,
        );
        const link = screen.getByRole('link', { name: 'View the changelog' });
        expect(link.getAttribute('data-slot')).toBe('bubble-content');
    });

    // ─── render override ───────────────────────────────────────────────────

    it('renders custom content via render instead of a Bubble', () => {
        render(
            <MessageWrapper
                render={<div data-testid="custom">Custom surface</div>}
            >
                ignored children
            </MessageWrapper>,
        );
        expect(screen.getByTestId('custom')).toBeTruthy();
        expect(screen.queryByText('ignored children')).toBeNull();
    });

    it('does not render a Bubble when render is provided', () => {
        const { container } = render(
            <MessageWrapper render={<div data-testid="custom" />} />,
        );
        expect(container.querySelector('[data-slot="bubble"]')).toBeNull();
    });

    // ─── Avatar ─────────────────────────────────────────────────────────────

    it('does not render an avatar slot by default', () => {
        const { container } = render(<MessageWrapper>text</MessageWrapper>);
        expect(
            container.querySelector('[data-slot="message-avatar"]'),
        ).toBeNull();
    });

    it('renders an avatar slot when avatarFallback is provided', () => {
        const { container } = render(
            <MessageWrapper avatarFallback="CN">text</MessageWrapper>,
        );
        expect(
            container.querySelector('[data-slot="message-avatar"]'),
        ).toBeTruthy();
        expect(container.querySelector('[data-slot="avatar"]')).toBeTruthy();
        expect(screen.getByText('CN')).toBeTruthy();
    });

    it('renders a custom avatar node when avatar is provided', () => {
        render(
            <MessageWrapper avatar={<span data-testid="custom-avatar" />}>
                text
            </MessageWrapper>,
        );
        expect(screen.getByTestId('custom-avatar')).toBeTruthy();
    });

    it('prefers avatar over the built-in AvatarWrapper', () => {
        const { container } = render(
            <MessageWrapper
                avatar={<span data-testid="custom-avatar" />}
                avatarFallback="CN"
            >
                text
            </MessageWrapper>,
        );
        expect(screen.getByTestId('custom-avatar')).toBeTruthy();
        expect(container.querySelector('[data-slot="avatar"]')).toBeNull();
    });

    it('renders an empty avatar slot when reserveAvatarSpace is true', () => {
        const { container } = render(
            <MessageWrapper reserveAvatarSpace>text</MessageWrapper>,
        );
        expect(
            container.querySelector('[data-slot="message-avatar"]'),
        ).toBeTruthy();
        expect(container.querySelector('[data-slot="avatar"]')).toBeNull();
    });

    // ─── Header and footer ──────────────────────────────────────────────────

    it('does not render a header slot when header is omitted', () => {
        const { container } = render(<MessageWrapper>text</MessageWrapper>);
        expect(
            container.querySelector('[data-slot="message-header"]'),
        ).toBeNull();
    });

    it('renders a header slot when header is provided', () => {
        render(<MessageWrapper header="Claude">text</MessageWrapper>);
        expect(screen.getByText('Claude')).toBeTruthy();
    });

    it('does not render a footer slot when footer is omitted', () => {
        const { container } = render(<MessageWrapper>text</MessageWrapper>);
        expect(
            container.querySelector('[data-slot="message-footer"]'),
        ).toBeNull();
    });

    it('renders a footer slot when footer is provided', () => {
        render(<MessageWrapper footer="Read 2:14 PM">text</MessageWrapper>);
        expect(screen.getByText('Read 2:14 PM')).toBeTruthy();
    });

    it('forwards headerClassName to the header slot', () => {
        const { container } = render(
            <MessageWrapper header="Claude" headerClassName="header-extra">
                text
            </MessageWrapper>,
        );
        expect(
            container.querySelector('[data-slot="message-header"]')?.className,
        ).toContain('header-extra');
    });

    it('forwards footerClassName to the footer slot', () => {
        const { container } = render(
            <MessageWrapper footer="Read" footerClassName="footer-extra">
                text
            </MessageWrapper>,
        );
        expect(
            container.querySelector('[data-slot="message-footer"]')?.className,
        ).toContain('footer-extra');
    });
});

// ─── MessageGroup ──────────────────────────────────────────────────────────

describe('MessageGroup', () => {
    it('renders with data-slot', () => {
        const { container } = render(<MessageGroup />);
        expect(
            container.querySelector('[data-slot="message-group"]'),
        ).toBeTruthy();
    });

    it('renders children', () => {
        render(
            <MessageGroup>
                <MessageWrapper>first</MessageWrapper>
                <MessageWrapper>second</MessageWrapper>
            </MessageGroup>,
        );
        expect(screen.getByText('first')).toBeTruthy();
        expect(screen.getByText('second')).toBeTruthy();
    });
});
