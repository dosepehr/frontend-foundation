import { render } from '@testing-library/react';
import { Toaster } from './components';

vi.mock('next-themes', () => ({
    useTheme: () => ({ theme: 'light' }),
}));

describe('Toaster', () => {
    it('renders without errors', () => {
        expect(() => render(<Toaster />)).not.toThrow();
    });

    it('accepts position prop without errors', () => {
        expect(() => render(<Toaster position='bottom-right' />)).not.toThrow();
    });

    it('accepts richColors prop without errors', () => {
        expect(() => render(<Toaster richColors />)).not.toThrow();
    });
});
