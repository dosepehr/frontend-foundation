import { render, screen } from '@testing-library/react';
import { Asteriks } from './components';

describe('Asteriks', () => {
    it('renders an asterisk character', () => {
        render(<Asteriks />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('is aria-hidden', () => {
        render(<Asteriks />);
        expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders as a span element', () => {
        const { container } = render(<Asteriks />);
        expect(container.querySelector('span')).toBeInTheDocument();
    });
});
