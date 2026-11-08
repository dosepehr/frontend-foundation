import { render, screen } from '@testing-library/react';
import Asterisk from '.';

describe('Asterisk', () => {
    it('renders an asterisk character', () => {
        render(<Asterisk />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('is aria-hidden', () => {
        render(<Asterisk />);
        expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders as a span element', () => {
        const { container } = render(<Asterisk />);
        expect(container.querySelector('span')).toBeInTheDocument();
    });
});
