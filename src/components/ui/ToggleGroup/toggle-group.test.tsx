import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleGroup, ToggleGroupItem } from './components';
import ToggleGroupWrapper from '.';

describe('ToggleGroup', () => {
    it('has data-slot="toggle-group"', () => {
        const { container } = render(
            <ToggleGroup type='single'>
                <ToggleGroupItem value='a'>A</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(container.querySelector('[data-slot="toggle-group"]')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <ToggleGroup type='single'>
                <ToggleGroupItem value='a'>Option A</ToggleGroupItem>
                <ToggleGroupItem value='b'>Option B</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
    });

    it('reflects orientation via data-orientation', () => {
        const { container } = render(
            <ToggleGroup type='single' orientation='vertical'>
                <ToggleGroupItem value='a'>A</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(container.querySelector('[data-slot="toggle-group"]')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('reflects variant via data-variant', () => {
        const { container } = render(
            <ToggleGroup type='single' variant='outline'>
                <ToggleGroupItem value='a'>A</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(container.querySelector('[data-slot="toggle-group"]')).toHaveAttribute('data-variant', 'outline');
    });

    it('forwards className', () => {
        const { container } = render(
            <ToggleGroup type='single' className='custom-group'>
                <ToggleGroupItem value='a'>A</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(container.querySelector('[data-slot="toggle-group"]')).toHaveClass('custom-group');
    });
});

describe('ToggleGroupItem', () => {
    it('has data-slot="toggle-group-item"', () => {
        const { container } = render(
            <ToggleGroup type='single'>
                <ToggleGroupItem value='a'>A</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(container.querySelector('[data-slot="toggle-group-item"]')).toBeInTheDocument();
    });

    it('is off by default', () => {
        const { container } = render(
            <ToggleGroup type='single'>
                <ToggleGroupItem value='a'>A</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(container.querySelector('[data-slot="toggle-group-item"]')).toHaveAttribute('data-state', 'off');
    });

    it('becomes active when clicked', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ToggleGroup type='single'>
                <ToggleGroupItem value='a'>A</ToggleGroupItem>
            </ToggleGroup>,
        );
        await user.click(screen.getByText('A'));
        expect(container.querySelector('[data-slot="toggle-group-item"]')).toHaveAttribute('data-state', 'on');
    });

    it('calls onValueChange when item is clicked', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(
            <ToggleGroup type='single' onValueChange={onValueChange}>
                <ToggleGroupItem value='bold'>Bold</ToggleGroupItem>
            </ToggleGroup>,
        );
        await user.click(screen.getByText('Bold'));
        expect(onValueChange).toHaveBeenCalledWith('bold');
    });

    it('multiple items can both be active in multiple mode', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ToggleGroup type='multiple'>
                <ToggleGroupItem value='a'>A</ToggleGroupItem>
                <ToggleGroupItem value='b'>B</ToggleGroupItem>
            </ToggleGroup>,
        );
        await user.click(screen.getByText('A'));
        await user.click(screen.getByText('B'));
        const items = container.querySelectorAll('[data-slot="toggle-group-item"]');
        expect(items[0]).toHaveAttribute('data-state', 'on');
        expect(items[1]).toHaveAttribute('data-state', 'on');
    });

    it('renders children text', () => {
        render(
            <ToggleGroup type='single'>
                <ToggleGroupItem value='x'>Label</ToggleGroupItem>
            </ToggleGroup>,
        );
        expect(screen.getByText('Label')).toBeInTheDocument();
    });
});

describe('ToggleGroupWrapper', () => {
    const items = [
        { value: 'bold', label: 'Bold' },
        { value: 'italic', label: 'Italic' },
        { value: 'underline', label: 'Underline' },
    ];

    it('renders all items', () => {
        render(<ToggleGroupWrapper type='multiple' items={items} />);
        expect(screen.getByText('Bold')).toBeInTheDocument();
        expect(screen.getByText('Italic')).toBeInTheDocument();
        expect(screen.getByText('Underline')).toBeInTheDocument();
    });

    it('uses value as label when label is omitted', () => {
        render(<ToggleGroupWrapper type='multiple' items={[{ value: 'center' }]} />);
        expect(screen.getByText('center')).toBeInTheDocument();
    });

    it('calls onValueChange when an item is clicked', async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        render(<ToggleGroupWrapper type='multiple' items={items} onValueChange={onValueChange} />);
        await user.click(screen.getByText('Bold'));
        expect(onValueChange).toHaveBeenCalledWith(['bold']);
    });

    it('renders without errors when items is empty', () => {
        expect(() => render(<ToggleGroupWrapper type='multiple' items={[]} />)).not.toThrow();
    });
});
