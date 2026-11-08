import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MarkerWrapper from '.';

// ─── MarkerWrapper ─────────────────────────────────────────────────────────

describe('MarkerWrapper', () => {
    it('renders with data-slot', () => {
        const { container } = render(<MarkerWrapper>text</MarkerWrapper>);
        expect(container.querySelector('[data-slot="marker"]')).toBeTruthy();
    });

    it('renders as a div by default', () => {
        const { container } = render(<MarkerWrapper>text</MarkerWrapper>);
        expect(container.querySelector('div[data-slot="marker"]')).toBeTruthy();
    });

    it('defaults data-variant to default', () => {
        const { container } = render(<MarkerWrapper>text</MarkerWrapper>);
        expect(
            container.querySelector('[data-variant="default"]'),
        ).toBeTruthy();
    });

    it.each<'default' | 'border' | 'separator'>([
        'default',
        'border',
        'separator',
    ])('accepts variant="%s"', (variant) => {
        const { container } = render(
            <MarkerWrapper variant={variant}>text</MarkerWrapper>,
        );
        expect(
            container.querySelector(`[data-variant="${variant}"]`),
        ).toBeTruthy();
    });

    it('renders children via the content slot', () => {
        render(<MarkerWrapper>Explored 4 files</MarkerWrapper>);
        expect(screen.getByText('Explored 4 files')).toBeTruthy();
    });

    it('does not render a content slot when children is omitted', () => {
        const { container } = render(<MarkerWrapper icon={<span />} />);
        expect(
            container.querySelector('[data-slot="marker-content"]'),
        ).toBeNull();
    });

    it('does not render an icon slot when icon is omitted', () => {
        const { container } = render(<MarkerWrapper>text</MarkerWrapper>);
        expect(container.querySelector('[data-slot="marker-icon"]')).toBeNull();
    });

    it('renders the icon slot when icon is provided', () => {
        const { container } = render(
            <MarkerWrapper icon={<span data-testid="icon" />}>
                text
            </MarkerWrapper>,
        );
        expect(
            container.querySelector('[data-slot="marker-icon"]'),
        ).toBeTruthy();
        expect(screen.getByTestId('icon')).toBeTruthy();
    });

    it('hides the icon slot from assistive tech', () => {
        const { container } = render(
            <MarkerWrapper icon={<span />}>text</MarkerWrapper>,
        );
        expect(
            container.querySelector(
                '[data-slot="marker-icon"][aria-hidden="true"]',
            ),
        ).toBeTruthy();
    });

    it('forwards iconClassName to the icon slot', () => {
        const { container } = render(
            <MarkerWrapper icon={<span />} iconClassName="icon-extra">
                text
            </MarkerWrapper>,
        );
        expect(
            container.querySelector('[data-slot="marker-icon"]')?.className,
        ).toContain('icon-extra');
    });

    it('forwards contentClassName to the content slot', () => {
        const { container } = render(
            <MarkerWrapper contentClassName="content-extra">
                text
            </MarkerWrapper>,
        );
        expect(
            container.querySelector('[data-slot="marker-content"]')?.className,
        ).toContain('content-extra');
    });

    it('applies the shimmer class to the content slot when shimmer is true', () => {
        const { container } = render(
            <MarkerWrapper shimmer>Loading...</MarkerWrapper>,
        );
        expect(
            container.querySelector('[data-slot="marker-content"]')?.className,
        ).toContain('shimmer');
    });

    it('does not apply the shimmer class by default', () => {
        const { container } = render(<MarkerWrapper>Loading...</MarkerWrapper>);
        expect(
            container.querySelector('[data-slot="marker-content"]')?.className,
        ).not.toContain('shimmer');
    });

    it('forwards className to the root marker', () => {
        const { container } = render(
            <MarkerWrapper className="my-class">text</MarkerWrapper>,
        );
        expect(
            container.querySelector('[data-slot="marker"]')?.className,
        ).toContain('my-class');
    });

    it('forwards role to the root marker for status markers', () => {
        const { container } = render(
            <MarkerWrapper role="status">Loading...</MarkerWrapper>,
        );
        expect(container.querySelector('[role="status"]')).toBeTruthy();
    });

    it('forwards aria-label for icon-only markers', () => {
        const { container } = render(
            <MarkerWrapper aria-label="Synced" icon={<span />} />,
        );
        expect(container.querySelector('[aria-label="Synced"]')).toBeTruthy();
    });

    it('renders as the given element when render is provided', () => {
        render(
            <MarkerWrapper render={<a href="/files" />}>
                Explored 4 files
            </MarkerWrapper>,
        );
        const link = screen.getByRole('link', { name: 'Explored 4 files' });
        expect(link.getAttribute('data-slot')).toBe('marker');
        expect(link.getAttribute('href')).toBe('/files');
    });

    it('renders icon and content inside the render element', () => {
        render(
            <MarkerWrapper
                render={<button type="button" />}
                icon={<span data-testid="icon" />}
            >
                Explored 4 files
            </MarkerWrapper>,
        );
        const button = screen.getByRole('button', { name: 'Explored 4 files' });
        expect(button.querySelector('[data-testid="icon"]')).toBeTruthy();
        expect(
            button.querySelector('[data-slot="marker-content"]'),
        ).toBeTruthy();
    });
});
