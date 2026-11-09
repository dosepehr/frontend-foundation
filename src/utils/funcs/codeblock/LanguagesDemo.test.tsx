import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { languageSamples } from './codeSamples';
import LanguagesDemo from './LanguagesDemo';

const title = (container: HTMLElement) =>
    container.querySelector('[data-slot="code-block-title"]');

describe('LanguagesDemo', () => {
    it('shows a tab for every sample language', () => {
        render(<LanguagesDemo />);
        for (const language of Object.keys(languageSamples)) {
            expect(
                screen.getByRole('tab', { name: language }),
            ).toBeInTheDocument();
        }
    });

    it('starts on the tsx sample', () => {
        const { container } = render(<LanguagesDemo />);
        expect(title(container)).toHaveTextContent('tsx');
        expect(screen.getByRole('tab', { name: 'tsx' })).toHaveAttribute(
            'aria-selected',
            'true',
        );
    });

    it('switches the code when another language is picked', async () => {
        const user = userEvent.setup();
        const { container } = render(<LanguagesDemo />);

        await user.click(screen.getByRole('tab', { name: 'json' }));

        expect(title(container)).toHaveTextContent('json');
        expect(
            container.querySelector('[data-slot="code-block-code"]'),
        ).toHaveTextContent('"name"');
    });
});
