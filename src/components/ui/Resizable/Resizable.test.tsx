import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from './components';

describe('ResizablePanelGroup', () => {
    it('renders with data-slot', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel>One</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(
            container.querySelector('[data-slot="resizable-panel-group"]'),
        ).toBeTruthy();
    });

    it('defaults to a horizontal (row) layout', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel>One</ResizablePanel>
            </ResizablePanelGroup>,
        );
        const group = container.querySelector(
            '[data-slot="resizable-panel-group"]',
        ) as HTMLElement;
        expect(group.style.flexDirection).toBe('row');
    });

    it('lays out as a column when orientation is vertical', () => {
        const { container } = render(
            <ResizablePanelGroup orientation="vertical">
                <ResizablePanel>One</ResizablePanel>
            </ResizablePanelGroup>,
        );
        const group = container.querySelector(
            '[data-slot="resizable-panel-group"]',
        ) as HTMLElement;
        expect(group.style.flexDirection).toBe('column');
    });

    it('forwards className', () => {
        const { container } = render(
            <ResizablePanelGroup className="extra">
                <ResizablePanel>One</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(
            container.querySelector('[data-slot="resizable-panel-group"]')
                ?.className,
        ).toContain('extra');
    });

    it('renders panel children', () => {
        render(
            <ResizablePanelGroup>
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(screen.getByText('One')).toBeInTheDocument();
        expect(screen.getByText('Two')).toBeInTheDocument();
    });
});

describe('ResizablePanel', () => {
    it('renders with data-slot', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel>Content</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(
            container.querySelector('[data-slot="resizable-panel"]'),
        ).toBeTruthy();
    });

    it('renders children', () => {
        render(
            <ResizablePanelGroup>
                <ResizablePanel>Panel content</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(screen.getByText('Panel content')).toBeInTheDocument();
    });

    it('sets data-panel attribute', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel id="my-panel">Content</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(container.querySelector('[data-panel]')).toBeTruthy();
    });
});

describe('ResizableHandle', () => {
    it('renders with data-slot', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(
            container.querySelector('[data-slot="resizable-handle"]'),
        ).toBeTruthy();
    });

    it('renders with role="separator"', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(container.querySelector('[role="separator"]')).toBeTruthy();
    });

    it('renders a vertical separator line in a horizontal group', () => {
        const { container } = render(
            <ResizablePanelGroup orientation="horizontal">
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(
            container.querySelector('[aria-orientation="vertical"]'),
        ).toBeTruthy();
    });

    it('renders a horizontal separator line in a vertical group', () => {
        const { container } = render(
            <ResizablePanelGroup orientation="vertical">
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(
            container.querySelector('[aria-orientation="horizontal"]'),
        ).toBeTruthy();
    });

    it('does not render an inner handle bar by default', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>,
        );
        const handle = container.querySelector(
            '[data-slot="resizable-handle"]',
        );
        expect(handle?.querySelector('div')).toBeNull();
    });

    it('renders an inner handle bar when withHandle is true', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>,
        );
        const handle = container.querySelector(
            '[data-slot="resizable-handle"]',
        );
        expect(handle?.querySelector('div')).toBeTruthy();
    });

    it('forwards className', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle className="handle-extra" />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>,
        );
        expect(
            container.querySelector('[data-slot="resizable-handle"]')
                ?.className,
        ).toContain('handle-extra');
    });

    it('is keyboard focusable', () => {
        const { container } = render(
            <ResizablePanelGroup>
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>,
        );
        const handle = container.querySelector(
            '[data-slot="resizable-handle"]',
        );
        expect(handle?.getAttribute('tabindex')).toBe('0');
    });
});
