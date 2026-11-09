import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popover, {
    PopoverAnchor,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '.';

const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);

describe('Popover', () => {
    it('renders trigger without errors', () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Content</PopoverContent>
            </Popover>,
        );
        expect(screen.getByText('Open')).toHaveAttribute(
            'data-slot',
            'popover-trigger',
        );
    });

    it('content is not visible when closed', () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Popover content</PopoverContent>
            </Popover>,
        );
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });

    it('opens content when trigger is clicked', async () => {
        const user = userEvent.setup();
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Popover content</PopoverContent>
            </Popover>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('renders with open prop set to true', () => {
        render(
            <Popover open>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Always visible</PopoverContent>
            </Popover>,
        );
        expect(screen.getByText('Always visible')).toBeInTheDocument();
    });
});

describe('PopoverContent', () => {
    it('has padding, a gap and a ring by default', () => {
        render(
            <Popover open>
                <PopoverContent>Body</PopoverContent>
            </Popover>,
        );
        expect(slot('popover-content')).toHaveClass(
            'p-2.5',
            'gap-2.5',
            'ring-1',
            'rounded-lg',
        );
    });

    it('lets callers remove the padding for content with its own', () => {
        render(
            <Popover open>
                <PopoverContent className="p-0">Body</PopoverContent>
            </Popover>,
        );
        const content = slot('popover-content');
        expect(content).toHaveClass('p-0');
        expect(content).not.toHaveClass('p-2.5');
    });

    it('renders against an anchor', () => {
        render(
            <Popover open>
                <PopoverAnchor>Anchor</PopoverAnchor>
                <PopoverContent>Body</PopoverContent>
            </Popover>,
        );
        expect(screen.getByText('Anchor')).toHaveAttribute(
            'data-slot',
            'popover-anchor',
        );
    });
});

describe('PopoverHeader', () => {
    it('renders a title and description', () => {
        render(
            <Popover open>
                <PopoverContent>
                    <PopoverHeader className="custom">
                        <PopoverTitle>Dimensions</PopoverTitle>
                        <PopoverDescription>
                            Set the dimensions for the layer.
                        </PopoverDescription>
                    </PopoverHeader>
                </PopoverContent>
            </Popover>,
        );
        expect(slot('popover-header')).toHaveClass('custom');
        expect(screen.getByText('Dimensions')).toHaveAttribute(
            'data-slot',
            'popover-title',
        );
        expect(
            screen.getByText('Set the dimensions for the layer.'),
        ).toHaveClass('text-muted-foreground');
    });
});
