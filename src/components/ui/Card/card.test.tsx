import { render, screen } from '@testing-library/react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
    CardContent,
    CardFooter,
} from './components';
import CardWrapper from './index';

describe('Card primitives', () => {
    it('renders with data-slot="card"', () => {
        const { container } = render(<Card />);
        expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    });

    it('defaults to size="default"', () => {
        const { container } = render(<Card />);
        expect(container.querySelector('[data-slot="card"]')).toHaveAttribute('data-size', 'default');
    });

    it('reflects size via data-size', () => {
        const { container } = render(<Card size='sm' />);
        expect(container.querySelector('[data-slot="card"]')).toHaveAttribute('data-size', 'sm');
    });

    it('forwards className', () => {
        const { container } = render(<Card className='custom-card' />);
        expect(container.querySelector('[data-slot="card"]')).toHaveClass('custom-card');
    });

    it('CardHeader renders with data-slot', () => {
        const { container } = render(<Card><CardHeader /></Card>);
        expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
    });

    it('CardTitle renders text content', () => {
        render(<Card><CardHeader><CardTitle>My title</CardTitle></CardHeader></Card>);
        expect(screen.getByText('My title')).toBeInTheDocument();
    });

    it('CardDescription renders text content', () => {
        render(<Card><CardHeader><CardDescription>Desc text</CardDescription></CardHeader></Card>);
        expect(screen.getByText('Desc text')).toBeInTheDocument();
    });

    it('CardAction renders children', () => {
        render(
            <Card>
                <CardHeader>
                    <CardAction><button>Action</button></CardAction>
                </CardHeader>
            </Card>,
        );
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('CardContent renders with data-slot', () => {
        const { container } = render(<Card><CardContent>Content</CardContent></Card>);
        expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument();
    });

    it('CardFooter renders with data-slot', () => {
        const { container } = render(<Card><CardFooter>Footer</CardFooter></Card>);
        expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument();
    });
});

describe('CardWrapper', () => {
    it('renders children in CardContent', () => {
        render(<CardWrapper>Body text</CardWrapper>);
        expect(screen.getByText('Body text')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
        render(<CardWrapper title='Card title'>Content</CardWrapper>);
        expect(screen.getByText('Card title')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(<CardWrapper description='Card description'>Content</CardWrapper>);
        expect(screen.getByText('Card description')).toBeInTheDocument();
    });

    it('renders action when provided', () => {
        render(
            <CardWrapper action={<button>Action btn</button>}>Content</CardWrapper>,
        );
        expect(screen.getByRole('button', { name: 'Action btn' })).toBeInTheDocument();
    });

    it('renders footer when provided', () => {
        render(<CardWrapper footer='Footer content'>Content</CardWrapper>);
        expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('does not render CardHeader when title/description/action are all omitted', () => {
        const { container } = render(<CardWrapper>Content</CardWrapper>);
        expect(container.querySelector('[data-slot="card-header"]')).not.toBeInTheDocument();
    });

    it('does not render CardContent when children are omitted', () => {
        const { container } = render(<CardWrapper title='Title' />);
        expect(container.querySelector('[data-slot="card-content"]')).not.toBeInTheDocument();
    });

    it('does not render CardFooter when footer is omitted', () => {
        const { container } = render(<CardWrapper>Content</CardWrapper>);
        expect(container.querySelector('[data-slot="card-footer"]')).not.toBeInTheDocument();
    });

    it('forwards size to Card', () => {
        const { container } = render(<CardWrapper size='sm'>Content</CardWrapper>);
        expect(container.querySelector('[data-slot="card"]')).toHaveAttribute('data-size', 'sm');
    });

    it('forwards className to Card', () => {
        const { container } = render(<CardWrapper className='custom-wrapper'>Content</CardWrapper>);
        expect(container.querySelector('[data-slot="card"]')).toHaveClass('custom-wrapper');
    });
});
