import { isValidElement, type ReactElement } from 'react';
import { highlightCode, loadHighlighter } from '.';

type TokenProps = { children: string; style: Record<string, string> };

const lineText = (line: unknown) =>
    (line as ReactElement<TokenProps>[])
        .map((token) => token.props.children)
        .join('');

describe('highlighter', () => {
    it('returns null for a language that is not listed', async () => {
        await expect(loadHighlighter('cobol')).resolves.toBeNull();
        await expect(highlightCode('x', 'cobol')).resolves.toBeNull();
    });

    it('highlights code into one node list per line', async () => {
        const lines = await highlightCode(
            'const a = 1;\nconst b = 2;',
            'typescript',
        );

        expect(lines).toHaveLength(2);
        expect(lineText(lines?.[0])).toBe('const a = 1;');
        const [first] = lines?.[0] as ReactElement<TokenProps>[];
        expect(isValidElement(first)).toBe(true);
        expect(first.props.style).toHaveProperty('--shiki-light');
        expect(first.props.style).toHaveProperty('--shiki-dark');
    });

    it('resolves aliases and ignores case', async () => {
        const lines = await highlightCode('echo hi', 'SH');
        expect(lineText(lines?.[0])).toBe('echo hi');
    });

    it('continues from a grammar state across calls', async () => {
        const loaded = await loadHighlighter('ts');
        const first = loaded?.highlight('/* open');
        const second = loaded?.highlight('still a comment */', first?.state);
        const [token] = second?.lines[0] as ReactElement<TokenProps>[];
        expect(token.props.children).toContain('still a comment');
        expect(first?.state).toBeDefined();
    });

    it('renders ANSI colours instead of escape codes', async () => {
        const lines = await highlightCode('\u001B[32mpass\u001B[0m', 'ansi');
        expect(lineText(lines?.[0])).toBe('pass');
    });
});
