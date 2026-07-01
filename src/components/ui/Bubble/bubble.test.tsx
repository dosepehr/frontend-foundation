import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BubbleWrapper from '.';
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from './components';

// ─── BubbleGroup ───────────────────────────────────────────────────────────────

describe('BubbleGroup', () => {
    it('renders with data-slot', () => {
        const { container } = render(<BubbleGroup />);
        expect(container.querySelector('[data-slot="bubble-group"]')).toBeTruthy();
    });

    it('forwards className', () => {
        const { container } = render(<BubbleGroup className="test-class" />);
        expect(container.querySelector('[data-slot="bubble-group"]')?.className).toContain('test-class');
    });

    it('renders children', () => {
        render(<BubbleGroup><span>child</span></BubbleGroup>);
        expect(screen.getByText('child')).toBeTruthy();
    });
});

// ─── Bubble ────────────────────────────────────────────────────────────────────

describe('Bubble', () => {
    it('renders with data-slot', () => {
        const { container } = render(<Bubble />);
        expect(container.querySelector('[data-slot="bubble"]')).toBeTruthy();
    });

    it('sets data-variant from variant prop', () => {
        const { container } = render(<Bubble variant="secondary" />);
        expect(container.querySelector('[data-variant="secondary"]')).toBeTruthy();
    });

    it('defaults data-variant to default', () => {
        const { container } = render(<Bubble />);
        expect(container.querySelector('[data-variant="default"]')).toBeTruthy();
    });

    it('sets data-align from align prop', () => {
        const { container } = render(<Bubble align="end" />);
        expect(container.querySelector('[data-align="end"]')).toBeTruthy();
    });

    it('defaults data-align to start', () => {
        const { container } = render(<Bubble />);
        expect(container.querySelector('[data-align="start"]')).toBeTruthy();
    });

    it.each<'default' | 'secondary' | 'muted' | 'tinted' | 'outline' | 'ghost' | 'destructive'>([
        'default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive',
    ])('accepts variant="%s"', (variant) => {
        const { container } = render(<Bubble variant={variant} />);
        expect(container.querySelector(`[data-variant="${variant}"]`)).toBeTruthy();
    });

    it('forwards className', () => {
        const { container } = render(<Bubble className="extra" />);
        expect(container.querySelector('[data-slot="bubble"]')?.className).toContain('extra');
    });

    it('renders children', () => {
        render(<Bubble><span>hello</span></Bubble>);
        expect(screen.getByText('hello')).toBeTruthy();
    });
});

// ─── BubbleContent ─────────────────────────────────────────────────────────────

describe('BubbleContent', () => {
    it('renders with data-slot', () => {
        const { container } = render(<BubbleContent />);
        expect(container.querySelector('[data-slot="bubble-content"]')).toBeTruthy();
    });

    it('renders text content', () => {
        render(<BubbleContent>Hello world</BubbleContent>);
        expect(screen.getByText('Hello world')).toBeTruthy();
    });

    it('renders as a div by default', () => {
        const { container } = render(<BubbleContent />);
        expect(container.querySelector('div[data-slot="bubble-content"]')).toBeTruthy();
    });

    it('renders as child element when asChild is true', () => {
        render(
            <BubbleContent asChild>
                <button type="button">Click me</button>
            </BubbleContent>
        );
        const btn = screen.getByRole('button', { name: 'Click me' });
        expect(btn.getAttribute('data-slot')).toBe('bubble-content');
    });

    it('forwards className', () => {
        const { container } = render(<BubbleContent className="custom" />);
        expect(container.querySelector('[data-slot="bubble-content"]')?.className).toContain('custom');
    });
});

// ─── BubbleReactions ───────────────────────────────────────────────────────────

describe('BubbleReactions', () => {
    it('renders with data-slot', () => {
        const { container } = render(<BubbleReactions />);
        expect(container.querySelector('[data-slot="bubble-reactions"]')).toBeTruthy();
    });

    it('defaults data-side to bottom', () => {
        const { container } = render(<BubbleReactions />);
        expect(container.querySelector('[data-side="bottom"]')).toBeTruthy();
    });

    it('defaults data-align to end', () => {
        const { container } = render(<BubbleReactions />);
        expect(container.querySelector('[data-align="end"]')).toBeTruthy();
    });

    it.each<'top' | 'bottom'>(['top', 'bottom'])('accepts side="%s"', (side) => {
        const { container } = render(<BubbleReactions side={side} />);
        expect(container.querySelector(`[data-side="${side}"]`)).toBeTruthy();
    });

    it.each<'start' | 'end'>(['start', 'end'])('accepts align="%s"', (align) => {
        const { container } = render(<BubbleReactions align={align} />);
        expect(container.querySelector(`[data-align="${align}"]`)).toBeTruthy();
    });

    it('renders children', () => {
        render(<BubbleReactions><span>👍</span></BubbleReactions>);
        expect(screen.getByText('👍')).toBeTruthy();
    });

    it('forwards className', () => {
        const { container } = render(<BubbleReactions className="extra" />);
        expect(container.querySelector('[data-slot="bubble-reactions"]')?.className).toContain('extra');
    });
});

// ─── BubbleWrapper ─────────────────────────────────────────────────────────────

describe('BubbleWrapper', () => {
    it('renders Bubble, BubbleContent, and children', () => {
        const { container } = render(<BubbleWrapper>Hello</BubbleWrapper>);
        expect(container.querySelector('[data-slot="bubble"]')).toBeTruthy();
        expect(container.querySelector('[data-slot="bubble-content"]')).toBeTruthy();
        expect(screen.getByText('Hello')).toBeTruthy();
    });

    it('defaults variant to default', () => {
        const { container } = render(<BubbleWrapper>text</BubbleWrapper>);
        expect(container.querySelector('[data-variant="default"]')).toBeTruthy();
    });

    it('defaults align to start', () => {
        const { container } = render(<BubbleWrapper>text</BubbleWrapper>);
        expect(container.querySelector('[data-align="start"]')).toBeTruthy();
    });

    it.each<'default' | 'secondary' | 'muted' | 'tinted' | 'outline' | 'ghost' | 'destructive'>([
        'default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive',
    ])('passes variant="%s" to Bubble', (variant) => {
        const { container } = render(<BubbleWrapper variant={variant}>text</BubbleWrapper>);
        expect(container.querySelector(`[data-variant="${variant}"]`)).toBeTruthy();
    });

    it.each<'start' | 'end'>(['start', 'end'])('passes align="%s" to Bubble', (align) => {
        const { container } = render(<BubbleWrapper align={align}>text</BubbleWrapper>);
        expect(container.querySelector(`[data-align="${align}"]`)).toBeTruthy();
    });

    it('forwards className to Bubble', () => {
        const { container } = render(<BubbleWrapper className="my-class">text</BubbleWrapper>);
        expect(container.querySelector('[data-slot="bubble"]')?.className).toContain('my-class');
    });

    it('does not render BubbleReactions when reactions is omitted', () => {
        const { container } = render(<BubbleWrapper>text</BubbleWrapper>);
        expect(container.querySelector('[data-slot="bubble-reactions"]')).toBeNull();
    });

    it('renders BubbleReactions when reactions prop is provided', () => {
        const { container } = render(
            <BubbleWrapper reactions={<span>👍</span>}>text</BubbleWrapper>
        );
        expect(container.querySelector('[data-slot="bubble-reactions"]')).toBeTruthy();
        expect(screen.getByText('👍')).toBeTruthy();
    });

    it('passes reactionsSide to BubbleReactions', () => {
        const { container } = render(
            <BubbleWrapper reactions={<span>👍</span>} reactionsSide="top">text</BubbleWrapper>
        );
        expect(container.querySelector('[data-side="top"]')).toBeTruthy();
    });

    it('passes reactionsAlign to BubbleReactions', () => {
        const { container } = render(
            <BubbleWrapper reactions={<span>👍</span>} reactionsAlign="start">text</BubbleWrapper>
        );
        expect(container.querySelector('[data-align="start"][data-slot="bubble-reactions"]')).toBeTruthy();
    });

    it('renders BubbleContent as child element when contentAsChild is true', () => {
        render(
            <BubbleWrapper contentAsChild>
                <button type="button">Action</button>
            </BubbleWrapper>
        );
        const btn = screen.getByRole('button', { name: 'Action' });
        expect(btn.getAttribute('data-slot')).toBe('bubble-content');
    });
});
