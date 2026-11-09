import { loadHighlighter } from '@/utils/funcs/highlighter';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

type Highlighter = NonNullable<Awaited<ReturnType<typeof loadHighlighter>>>;
type GrammarState = Parameters<Highlighter['highlight']>[1];

interface Highlighted {
    highlighter: Highlighter | null;
    text: string;
    lines: ReactNode[];
    state?: GrammarState;
}

/**
 * Highlights code with Shiki and returns one React node per line, for
 * `CodeBlockLine`. Returns plain lines until the language has loaded, and for
 * a language the highlighter doesn't list. While the code streams, only the
 * new lines are tokenized.
 */
export function useHighlightedCode(
    value: string,
    language: string,
): ReactNode[] {
    // A trailing newline would render as an extra empty line.
    const code = value.endsWith('\n') ? value.slice(0, -1) : value;
    const [loaded, setLoaded] = useState<{
        language: string;
        highlighter: Highlighter | null;
    } | null>(null);
    const highlighter =
        loaded?.language === language ? loaded.highlighter : null;

    useEffect(() => {
        let cancelled = false;
        loadHighlighter(language)
            .then((next) => {
                if (!cancelled) setLoaded({ language, highlighter: next });
            })
            .catch(() => {
                // Highlighting is optional: on failure the code stays plain.
            });
        return () => {
            cancelled = true;
        };
    }, [language]);

    // The complete lines, highlighted. While the code streams, only the new
    // lines are tokenized, starting from the grammar state of the last one.
    const [done, setDone] = useState<Highlighted>({
        highlighter: null,
        text: '',
        lines: [],
    });

    let next = done;
    if (next.highlighter !== highlighter || !code.startsWith(next.text)) {
        next = { highlighter, text: '', lines: [] };
    }

    const end = code.lastIndexOf('\n') + 1;
    if (highlighter && end > next.text.length) {
        const result = highlighter.highlight(
            code.slice(next.text.length, end - 1),
            next.state,
        );
        next = {
            highlighter,
            text: code.slice(0, end),
            lines: [...next.lines, ...result.lines],
            state: result.state,
        };
    }

    // Derived state stored during render (React's "previous renders" pattern).
    if (next !== done) setDone(next);

    // The last line is still being written, so it is tokenized on every render.
    const tail = code.slice(end);

    return useMemo(() => {
        if (!highlighter) return code.split('\n');
        return [
            ...next.lines,
            highlighter.highlight(tail, next.state).lines[0],
        ];
    }, [code, highlighter, next, tail]);
}
