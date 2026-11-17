import { render, screen, waitFor } from '@testing-library/react';
import HighlightedBlock from './HighlightedBlock';

const lines = (container: HTMLElement) =>
    container.querySelectorAll('[data-slot="code-block-line"]');

describe('HighlightedBlock', () => {
    it('uses the language as the title by default', () => {
        render(<HighlightedBlock code="let a = 1;" language="ts" />);
        expect(screen.getByText('ts')).toHaveAttribute(
            'data-slot',
            'code-block-title',
        );
    });

    it('shows a custom title and a copy button', () => {
        render(
            <HighlightedBlock
                code="let a = 1;"
                language="ts"
                title="example.ts"
            />,
        );
        expect(screen.getByText('example.ts')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Copy' }),
        ).toBeInTheDocument();
    });

    it('renders one numbered line per line of code', () => {
        const { container } = render(
            <HighlightedBlock code={'a\nb\nc'} language="cobol" />,
        );
        expect(lines(container)).toHaveLength(3);
        expect(
            container.querySelector('[data-slot="code-block-content"]'),
        ).toHaveAttribute('data-numbered', 'true');
    });

    it('highlights the code once the language loads', async () => {
        const { container } = render(
            <HighlightedBlock code="const a = 1;" language="ts" />,
        );
        await waitFor(() =>
            expect(
                container.querySelector(
                    '[data-slot="code-block-line-content"] span[style]',
                ),
            ).toBeInTheDocument(),
        );
    });
});
