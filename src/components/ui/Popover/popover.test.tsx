import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverContent, PopoverTrigger } from './components';

describe('Popover', () => {
    it('renders trigger without errors', () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Content</PopoverContent>
            </Popover>,
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
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
