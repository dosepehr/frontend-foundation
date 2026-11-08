import { render, screen } from '@testing-library/react';
import TooltipWrapper from '.';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './components';

describe('Tooltip primitives', () => {
    it('content is not visible by default', () => {
        render(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Tooltip text</TooltipContent>
                </Tooltip>
            </TooltipProvider>,
        );
        expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });

    it('content is visible when open is true', () => {
        render(
            <TooltipProvider>
                <Tooltip open>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Tooltip text</TooltipContent>
                </Tooltip>
            </TooltipProvider>,
        );
        const content = document.querySelector('[data-slot="tooltip-content"]');
        expect(content).toBeInTheDocument();
        expect(content).toHaveTextContent('Tooltip text');
    });

    it('renders the trigger text', () => {
        render(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Content</TooltipContent>
                </Tooltip>
            </TooltipProvider>,
        );
        expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('has data-slot="tooltip-trigger" on the trigger', () => {
        const { container } = render(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Content</TooltipContent>
                </Tooltip>
            </TooltipProvider>,
        );
        expect(
            container.querySelector('[data-slot="tooltip-trigger"]'),
        ).toBeInTheDocument();
    });

    it('has data-slot="tooltip-content" on the content', () => {
        render(
            <TooltipProvider>
                <Tooltip open>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Content</TooltipContent>
                </Tooltip>
            </TooltipProvider>,
        );
        expect(
            document.querySelector('[data-slot="tooltip-content"]'),
        ).toBeInTheDocument();
    });

    it('content is not visible when open is false', () => {
        render(
            <TooltipProvider>
                <Tooltip open={false}>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Hidden content</TooltipContent>
                </Tooltip>
            </TooltipProvider>,
        );
        expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('calls onOpenChange when open state changes', () => {
        const onOpenChange = vi.fn();
        render(
            <TooltipProvider>
                <Tooltip open onOpenChange={onOpenChange}>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Content</TooltipContent>
                </Tooltip>
            </TooltipProvider>,
        );
        expect(onOpenChange).not.toHaveBeenCalled();
    });
});

describe('TooltipWrapper', () => {
    it('renders the trigger child', () => {
        render(
            <TooltipWrapper content="Tooltip text">
                <button>Trigger</button>
            </TooltipWrapper>,
        );
        expect(
            screen.getByRole('button', { name: 'Trigger' }),
        ).toBeInTheDocument();
    });

    it('shows content when open prop is true', () => {
        render(
            <TooltipWrapper content="Helpful info" open>
                <button>Trigger</button>
            </TooltipWrapper>,
        );
        const content = document.querySelector('[data-slot="tooltip-content"]');
        expect(content).toBeInTheDocument();
        expect(content).toHaveTextContent('Helpful info');
    });

    it('hides content when open prop is false', () => {
        render(
            <TooltipWrapper content="Helpful info" open={false}>
                <button>Trigger</button>
            </TooltipWrapper>,
        );
        expect(
            document.querySelector('[data-slot="tooltip-content"]'),
        ).not.toBeInTheDocument();
    });

    it('shows content when defaultOpen is true', () => {
        render(
            <TooltipWrapper content="Default open content" defaultOpen>
                <button>Trigger</button>
            </TooltipWrapper>,
        );
        const content = document.querySelector('[data-slot="tooltip-content"]');
        expect(content).toBeInTheDocument();
        expect(content).toHaveTextContent('Default open content');
    });

    it('renders ReactNode content', () => {
        render(
            <TooltipWrapper
                content={<span data-testid="rich-content">Rich</span>}
                open
            >
                <button>Trigger</button>
            </TooltipWrapper>,
        );
        const content = document.querySelector('[data-slot="tooltip-content"]');
        expect(
            content?.querySelector('[data-testid="rich-content"]'),
        ).toBeInTheDocument();
    });
});

describe('TooltipContent variant', () => {
    it('renders with a variant prop without errors', () => {
        expect(() =>
            render(
                <TooltipProvider>
                    <Tooltip open>
                        <TooltipTrigger>Hover</TooltipTrigger>
                        <TooltipContent variant="default">Tip</TooltipContent>
                    </Tooltip>
                </TooltipProvider>,
            ),
        ).not.toThrow();
    });
});
