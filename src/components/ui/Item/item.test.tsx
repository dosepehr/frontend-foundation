import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemEnd } from './components';
import ItemWrapper from '.';

describe('Item', () => {
    it('has data-slot="item"', () => {
        const { container } = render(<Item />);
        expect(container.querySelector('[data-slot="item"]')).toBeInTheDocument();
    });

    it('reflects size via data-size', () => {
        const { container } = render(<Item size='sm' />);
        expect(container.querySelector('[data-slot="item"]')).toHaveAttribute('data-size', 'sm');
    });

    it('sets data-active when active is true', () => {
        const { container } = render(<Item active />);
        expect(container.querySelector('[data-slot="item"]')).toHaveAttribute('data-active', 'true');
    });

    it('does not set data-active when active is false', () => {
        const { container } = render(<Item />);
        expect(container.querySelector('[data-slot="item"]')).not.toHaveAttribute('data-active');
    });

    it('sets data-disabled when disabled is true', () => {
        const { container } = render(<Item disabled />);
        expect(container.querySelector('[data-slot="item"]')).toHaveAttribute('data-disabled', 'true');
    });

    it('has role="button" when onClick is provided', () => {
        render(<Item onClick={vi.fn()}>Content</Item>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has no role when onClick is not provided', () => {
        render(<Item>Content</Item>);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Item onClick={onClick}>Click me</Item>);
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Item onClick={onClick} disabled>Click me</Item>);
        await user.click(screen.getByText('Click me'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('renders children', () => {
        render(<Item><span>Child</span></Item>);
        expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(<Item className='custom-item' />);
        expect(container.querySelector('[data-slot="item"]')).toHaveClass('custom-item');
    });

    it('renders as child element when asChild is true', () => {
        render(
            <Item asChild>
                <button>Button item</button>
            </Item>,
        );
        expect(screen.getByRole('button', { name: 'Button item' })).toBeInTheDocument();
    });
});

describe('ItemMedia', () => {
    it('has data-slot="item-media"', () => {
        const { container } = render(<ItemMedia />);
        expect(container.querySelector('[data-slot="item-media"]')).toBeInTheDocument();
    });

    it('reflects variant via data-variant', () => {
        const { container } = render(<ItemMedia variant='avatar' />);
        expect(container.querySelector('[data-slot="item-media"]')).toHaveAttribute('data-variant', 'avatar');
    });

    it('renders children', () => {
        render(<ItemMedia><span data-testid='icon' /></ItemMedia>);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
});

describe('ItemContent', () => {
    it('has data-slot="item-content"', () => {
        const { container } = render(<ItemContent />);
        expect(container.querySelector('[data-slot="item-content"]')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(<ItemContent><span>Content</span></ItemContent>);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});

describe('ItemTitle', () => {
    it('has data-slot="item-title"', () => {
        const { container } = render(<ItemTitle />);
        expect(container.querySelector('[data-slot="item-title"]')).toBeInTheDocument();
    });

    it('renders text', () => {
        render(<ItemTitle>My title</ItemTitle>);
        expect(screen.getByText('My title')).toBeInTheDocument();
    });
});

describe('ItemDescription', () => {
    it('has data-slot="item-description"', () => {
        const { container } = render(<ItemDescription />);
        expect(container.querySelector('[data-slot="item-description"]')).toBeInTheDocument();
    });

    it('renders text', () => {
        render(<ItemDescription>Some description</ItemDescription>);
        expect(screen.getByText('Some description')).toBeInTheDocument();
    });
});

describe('ItemEnd', () => {
    it('has data-slot="item-end"', () => {
        const { container } = render(<ItemEnd />);
        expect(container.querySelector('[data-slot="item-end"]')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(<ItemEnd><span data-testid='end-content' /></ItemEnd>);
        expect(screen.getByTestId('end-content')).toBeInTheDocument();
    });
});

describe('ItemWrapper', () => {
    it('renders without errors', () => {
        expect(() => render(<ItemWrapper />)).not.toThrow();
    });

    it('renders title when provided', () => {
        render(<ItemWrapper title='Alice' />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('does not render title element when omitted', () => {
        const { container } = render(<ItemWrapper />);
        expect(container.querySelector('[data-slot="item-title"]')).not.toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(<ItemWrapper description='Some detail' />);
        expect(screen.getByText('Some detail')).toBeInTheDocument();
    });

    it('does not render description element when omitted', () => {
        const { container } = render(<ItemWrapper />);
        expect(container.querySelector('[data-slot="item-description"]')).not.toBeInTheDocument();
    });

    it('renders media when provided', () => {
        render(<ItemWrapper media={<span data-testid='media' />} />);
        expect(screen.getByTestId('media')).toBeInTheDocument();
    });

    it('does not render media element when omitted', () => {
        const { container } = render(<ItemWrapper />);
        expect(container.querySelector('[data-slot="item-media"]')).not.toBeInTheDocument();
    });

    it('renders end when provided', () => {
        render(<ItemWrapper end={<span data-testid='end' />} />);
        expect(screen.getByTestId('end')).toBeInTheDocument();
    });

    it('does not render end element when omitted', () => {
        const { container } = render(<ItemWrapper />);
        expect(container.querySelector('[data-slot="item-end"]')).not.toBeInTheDocument();
    });

    it('renders children', () => {
        render(<ItemWrapper><span>Child content</span></ItemWrapper>);
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('passes variant and size to Item', () => {
        const { container } = render(<ItemWrapper variant='outline' size='sm' />);
        expect(container.querySelector('[data-slot="item"]')).toHaveAttribute('data-size', 'sm');
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<ItemWrapper onClick={onClick} title='Click me' />);
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });
});

describe('Item outline + interactive', () => {
    it('renders as button when variant="outline" and onClick is provided', () => {
        render(<Item variant='outline' onClick={vi.fn()}>Click</Item>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
