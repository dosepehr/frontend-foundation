import { render, screen, waitFor } from '@testing-library/react';
import { MockProvider } from './MockProvider';

vi.mock('../../../mocks/browser', () => ({
    worker: { start: vi.fn().mockResolvedValue() },
}));

describe('MockProvider', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('renders children immediately outside development', () => {
        vi.stubEnv('NODE_ENV', 'production');

        render(
            <MockProvider>
                <div>child</div>
            </MockProvider>,
        );

        expect(screen.getByText('child')).toBeInTheDocument();
    });

    it('renders nothing until the mock worker starts, then renders children', async () => {
        vi.stubEnv('NODE_ENV', 'development');

        const { container } = render(
            <MockProvider>
                <div>child</div>
            </MockProvider>,
        );

        expect(container).toBeEmptyDOMElement();

        await waitFor(() =>
            expect(screen.getByText('child')).toBeInTheDocument(),
        );
    });
});
