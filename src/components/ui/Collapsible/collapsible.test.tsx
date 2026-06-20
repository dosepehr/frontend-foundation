import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from './components';

function TestCollapsible({
    defaultOpen = false,
    open,
    onOpenChange,
}: {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    return (
        <Collapsible
            defaultOpen={defaultOpen}
            open={open}
            onOpenChange={onOpenChange}
        >
            <CollapsibleTrigger>Toggle</CollapsibleTrigger>
            <CollapsibleContent>Hidden content</CollapsibleContent>
        </Collapsible>
    );
}

describe('Collapsible', () => {
    it('renders trigger', () => {
        render(<TestCollapsible />);
        expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    it('content is not visible by default', () => {
        render(<TestCollapsible />);
        expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('content is visible when defaultOpen is true', () => {
        render(<TestCollapsible defaultOpen />);
        expect(screen.getByText('Hidden content')).toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
        const user = userEvent.setup();
        render(<TestCollapsible />);
        await user.click(screen.getByText('Toggle'));
        expect(screen.getByText('Hidden content')).toBeInTheDocument();
    });

    it('closes on second trigger click', async () => {
        const user = userEvent.setup();
        render(<TestCollapsible />);
        await user.click(screen.getByText('Toggle'));
        await user.click(screen.getByText('Toggle'));
        // CollapsibleContent uses AnimatePresence which keeps the node briefly;
        // check the root data-state instead
        const root = screen
            .getByText('Toggle')
            .closest('[data-slot="collapsible"]');
        expect(root).toHaveAttribute('data-state', 'closed');
    });

    it('calls onOpenChange with true when opened', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(<TestCollapsible onOpenChange={onOpenChange} />);
        await user.click(screen.getByText('Toggle'));
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange with false when closed', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(<TestCollapsible defaultOpen onOpenChange={onOpenChange} />);
        await user.click(screen.getByText('Toggle'));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('respects controlled open=true', () => {
        render(<TestCollapsible open={true} />);
        expect(screen.getByText('Hidden content')).toBeInTheDocument();
    });

    it('respects controlled open=false', () => {
        render(<TestCollapsible open={false} />);
        expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('has data-slot="collapsible" on the root', () => {
        const { container } = render(<TestCollapsible />);
        expect(
            container.querySelector('[data-slot="collapsible"]'),
        ).toBeInTheDocument();
    });

    it('has data-slot="collapsible-trigger" on the trigger', () => {
        const { container } = render(<TestCollapsible />);
        expect(
            container.querySelector('[data-slot="collapsible-trigger"]'),
        ).toBeInTheDocument();
    });
});
