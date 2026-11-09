import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WrapToggleDemo from './WrapToggleDemo';

const content = (container: HTMLElement) =>
    container.querySelector('[data-slot="code-block-content"]');

describe('WrapToggleDemo', () => {
    it('starts unwrapped', () => {
        const { container } = render(<WrapToggleDemo />);
        expect(
            screen.getByRole('button', { name: 'Wrap lines' }),
        ).toHaveAttribute('aria-pressed', 'false');
        expect(content(container)).not.toHaveAttribute('data-wrap');
    });

    it('toggles wrapping and reports it with aria-pressed', async () => {
        const user = userEvent.setup();
        const { container } = render(<WrapToggleDemo />);
        const toggle = screen.getByRole('button', { name: 'Wrap lines' });

        await user.click(toggle);
        expect(toggle).toHaveAttribute('aria-pressed', 'true');
        expect(content(container)).toHaveAttribute('data-wrap', 'true');

        await user.click(toggle);
        expect(toggle).toHaveAttribute('aria-pressed', 'false');
        expect(content(container)).not.toHaveAttribute('data-wrap');
    });

    it('has a copy button for the output', () => {
        render(<WrapToggleDemo />);
        expect(
            screen.getByRole('button', { name: 'Copy' }),
        ).toBeInTheDocument();
    });
});
