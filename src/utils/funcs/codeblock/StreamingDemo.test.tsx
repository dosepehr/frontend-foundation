import { act, render } from '@testing-library/react';
import { componentCode } from './codeSamples';
import StreamingDemo from './StreamingDemo';

// Line text without the newlines that keep empty lines copyable.
const shownCode = (container: HTMLElement) =>
    (
        container.querySelector('[data-slot="code-block-code"]')?.textContent ??
        ''
    ).replaceAll('\n', '');

describe('StreamingDemo', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('starts empty and types the code out four characters at a time', () => {
        const { container } = render(<StreamingDemo />);
        expect(shownCode(container)).toBe('');

        act(() => {
            vi.advanceTimersByTime(40 * 10);
        });

        expect(shownCode(container)).toBe(
            componentCode.slice(0, 40).replaceAll('\n', ''),
        );
    });

    it('starts over once the whole sample has been shown', () => {
        const { container } = render(<StreamingDemo />);
        const ticksToEnd = Math.ceil(componentCode.length / 4);

        act(() => {
            vi.advanceTimersByTime(40 * ticksToEnd);
        });
        expect(shownCode(container)).toBe(componentCode.replaceAll('\n', ''));

        act(() => {
            vi.advanceTimersByTime(40);
        });
        expect(shownCode(container)).toBe('');
    });

    it('labels the block as streaming', () => {
        const { container } = render(<StreamingDemo />);
        expect(
            container.querySelector('[data-slot="code-block-title"]'),
        ).toHaveTextContent('Streaming…');
    });
});
