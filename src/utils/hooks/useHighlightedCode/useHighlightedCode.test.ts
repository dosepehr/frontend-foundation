import { renderHook, waitFor } from '@testing-library/react';
import { isValidElement } from 'react';
import { useHighlightedCode } from '.';

const isHighlighted = (line: unknown) =>
    Array.isArray(line) && line.length > 0 && isValidElement(line[0]);

describe('useHighlightedCode', () => {
    it('returns plain lines until the highlighter loads, then highlighted ones', async () => {
        const { result } = renderHook(() =>
            useHighlightedCode('const a = 1;\nlet b;', 'ts'),
        );

        expect(result.current).toEqual(['const a = 1;', 'let b;']);
        await waitFor(() =>
            expect(result.current.every(isHighlighted)).toBe(true),
        );
        expect(result.current).toHaveLength(2);
    });

    it('ignores a trailing newline', async () => {
        const { result } = renderHook(() =>
            useHighlightedCode('a\nb\n', 'unknown-lang'),
        );
        expect(result.current).toEqual(['a', 'b']);
    });

    it('keeps plain lines for a language that is not listed', async () => {
        const { result } = renderHook(() =>
            useHighlightedCode('x = 1', 'cobol'),
        );
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(result.current).toEqual(['x = 1']);
    });

    it('keeps the finished lines when more code streams in', async () => {
        const { result, rerender } = renderHook(
            ({ code }) => useHighlightedCode(code, 'ts'),
            {
                initialProps: { code: 'const a = 1;\nconst b' },
            },
        );
        await waitFor(() =>
            expect(isHighlighted(result.current[0])).toBe(true),
        );
        const firstLine = result.current[0];

        rerender({ code: 'const a = 1;\nconst b = 2;\nconst c' });

        expect(result.current).toHaveLength(3);
        expect(result.current[0]).toBe(firstLine);
    });

    it('starts over when the code is replaced', async () => {
        const { result, rerender } = renderHook(
            ({ code }) => useHighlightedCode(code, 'ts'),
            {
                initialProps: { code: 'let a;\nlet b;' },
            },
        );
        await waitFor(() =>
            expect(isHighlighted(result.current[0])).toBe(true),
        );

        rerender({ code: 'let z;' });

        expect(result.current).toHaveLength(1);
    });
});
