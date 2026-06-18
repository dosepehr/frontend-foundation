import { render, screen } from '@testing-library/react';
import { Kbd, KbdGroup } from './components';

describe('Kbd', () => {
    it('renders as a kbd element', () => {
        const { container } = render(<Kbd>⌘</Kbd>);
        expect(container.querySelector('kbd')).toBeInTheDocument();
    });

    it('has data-slot="kbd"', () => {
        const { container } = render(<Kbd>K</Kbd>);
        expect(container.querySelector('[data-slot="kbd"]')).toBeInTheDocument();
    });

    it('renders text content', () => {
        render(<Kbd>Ctrl</Kbd>);
        expect(screen.getByText('Ctrl')).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(<Kbd className='custom-kbd'>K</Kbd>);
        expect(container.querySelector('[data-slot="kbd"]')).toHaveClass('custom-kbd');
    });

    it('renders children nodes', () => {
        render(<Kbd><span data-testid='icon' /></Kbd>);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
});

describe('KbdGroup', () => {
    it('has data-slot="kbd-group"', () => {
        const { container } = render(
            <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
            </KbdGroup>,
        );
        expect(container.querySelector('[data-slot="kbd-group"]')).toBeInTheDocument();
    });

    it('renders multiple Kbd children', () => {
        render(
            <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>Shift</Kbd>
                <Kbd>P</Kbd>
            </KbdGroup>,
        );
        expect(screen.getByText('Ctrl')).toBeInTheDocument();
        expect(screen.getByText('Shift')).toBeInTheDocument();
        expect(screen.getByText('P')).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(
            <KbdGroup className='custom-group'>
                <Kbd>K</Kbd>
            </KbdGroup>,
        );
        expect(container.querySelector('[data-slot="kbd-group"]')).toHaveClass('custom-group');
    });
});
