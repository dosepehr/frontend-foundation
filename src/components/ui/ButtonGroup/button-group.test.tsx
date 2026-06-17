import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './components';
import ButtonGroupWrapper from './index';

describe('ButtonGroup primitives', () => {
    it('renders with role="group"', () => {
        render(
            <ButtonGroup>
                <button>A</button>
            </ButtonGroup>,
        );
        expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('has data-slot="button-group"', () => {
        const { container } = render(<ButtonGroup><button>A</button></ButtonGroup>);
        expect(container.querySelector('[data-slot="button-group"]')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <ButtonGroup>
                <button>First</button>
                <button>Second</button>
            </ButtonGroup>,
        );
        expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument();
    });

    it('reflects orientation via data-orientation', () => {
        const { container } = render(
            <ButtonGroup orientation='vertical'><button>A</button></ButtonGroup>,
        );
        expect(container.querySelector('[data-slot="button-group"]')).toHaveAttribute(
            'data-orientation', 'vertical',
        );
    });

    it('forwards className', () => {
        const { container } = render(
            <ButtonGroup className='custom-class'><button>A</button></ButtonGroup>,
        );
        expect(container.querySelector('[data-slot="button-group"]')).toHaveClass('custom-class');
    });

    it('ButtonGroupText renders its content', () => {
        render(<ButtonGroupText>Label text</ButtonGroupText>);
        expect(screen.getByText('Label text')).toBeInTheDocument();
    });

    it('ButtonGroupText renders as child element when asChild is true', () => {
        render(
            <ButtonGroupText asChild>
                <span>Slot text</span>
            </ButtonGroupText>,
        );
        expect(screen.getByText('Slot text').tagName).toBe('SPAN');
    });

    it('ButtonGroupSeparator renders with data-slot', () => {
        const { container } = render(<ButtonGroup><ButtonGroupSeparator /></ButtonGroup>);
        expect(container.querySelector('[data-slot="button-group-separator"]')).toBeInTheDocument();
    });
});

describe('ButtonGroupWrapper', () => {
    const items = [
        { children: 'Save', variant: 'default' as const },
        { children: 'Cancel', variant: 'outline' as const },
        { children: 'Delete', variant: 'destructive' as const },
    ];

    it('renders all button labels', () => {
        render(<ButtonGroupWrapper items={items} />);
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('wraps buttons in a group', () => {
        render(<ButtonGroupWrapper items={items} />);
        expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('does not render separators by default', () => {
        const { container } = render(<ButtonGroupWrapper items={items} />);
        expect(container.querySelectorAll('[data-slot="button-group-separator"]')).toHaveLength(0);
    });

    it('renders separators between buttons when separator=true', () => {
        const { container } = render(<ButtonGroupWrapper items={items} separator />);
        // 3 buttons → 2 separators
        expect(container.querySelectorAll('[data-slot="button-group-separator"]')).toHaveLength(2);
    });

    it('calls item onClick when button is clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<ButtonGroupWrapper items={[{ children: 'Click me', onClick }]} />);
        await user.click(screen.getByRole('button', { name: 'Click me' }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes orientation to ButtonGroup', () => {
        const { container } = render(
            <ButtonGroupWrapper items={items} orientation='vertical' />,
        );
        expect(container.querySelector('[data-slot="button-group"]')).toHaveAttribute(
            'data-orientation', 'vertical',
        );
    });

    it('forwards className to ButtonGroup', () => {
        const { container } = render(
            <ButtonGroupWrapper items={items} className='custom-group' />,
        );
        expect(container.querySelector('[data-slot="button-group"]')).toHaveClass('custom-group');
    });

    it('renders a single button without separators', () => {
        const { container } = render(
            <ButtonGroupWrapper items={[{ children: 'Only' }]} separator />,
        );
        expect(container.querySelectorAll('[data-slot="button-group-separator"]')).toHaveLength(0);
    });
});
