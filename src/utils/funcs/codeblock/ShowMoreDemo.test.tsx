import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShowMoreDemo from './ShowMoreDemo';

const content = (container: HTMLElement) =>
    container.querySelector('[data-slot="code-block-content"]');

describe('ShowMoreDemo', () => {
    it('starts collapsed and points the button at the content', () => {
        const { container } = render(<ShowMoreDemo />);
        const button = screen.getByRole('button', { name: 'Show more' });

        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(button).toHaveAttribute('aria-controls', content(container)?.id);
        expect(content(container)).toHaveClass('max-h-64');
    });

    it('expands and collapses again', async () => {
        const user = userEvent.setup();
        const { container } = render(<ShowMoreDemo />);

        await user.click(screen.getByRole('button', { name: 'Show more' }));
        expect(
            screen.getByRole('button', { name: 'Show less' }),
        ).toHaveAttribute('aria-expanded', 'true');
        expect(content(container)).not.toHaveClass('max-h-64');

        await user.click(screen.getByRole('button', { name: 'Show less' }));
        expect(content(container)).toHaveClass('max-h-64');
    });

    it('applies the expanded class when one is given', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ShowMoreDemo expandedClassName="max-h-96" />,
        );

        await user.click(screen.getByRole('button', { name: 'Show more' }));
        expect(content(container)).toHaveClass('max-h-96');
    });
});
