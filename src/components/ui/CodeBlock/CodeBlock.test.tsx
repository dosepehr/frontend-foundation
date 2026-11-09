import { act, fireEvent, render, screen } from '@testing-library/react';
import CodeBlock, {
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockFooter,
    CodeBlockHeader,
    CodeBlockLine,
    CodeBlockTitle,
} from '.';

const slot = (container: HTMLElement, name: string) =>
    container.querySelector(`[data-slot="${name}"]`);

describe('CodeBlock', () => {
    it('renders every part with its data-slot', () => {
        const { container } = render(
            <CodeBlock>
                <CodeBlockHeader>
                    <CodeBlockTitle>Terminal</CodeBlockTitle>
                    <CodeBlockActions>
                        <CodeBlockCopyButton value="npm test" />
                    </CodeBlockActions>
                </CodeBlockHeader>
                <CodeBlockContent>npm test</CodeBlockContent>
                <CodeBlockFooter>Footer</CodeBlockFooter>
            </CodeBlock>,
        );
        for (const name of [
            'code-block',
            'code-block-header',
            'code-block-title',
            'code-block-actions',
            'code-block-copy-button',
            'code-block-content',
            'code-block-code',
            'code-block-footer',
        ]) {
            expect(slot(container, name)).toBeInTheDocument();
        }
    });

    it('defaults to the default variant and size', () => {
        const { container } = render(<CodeBlock />);
        const root = slot(container, 'code-block');
        expect(root).toHaveAttribute('data-variant', 'default');
        expect(root).toHaveAttribute('data-size', 'default');
    });

    it('applies the destructive variant and the sm size', () => {
        const { container } = render(
            <CodeBlock variant="destructive" size="sm" />,
        );
        const root = slot(container, 'code-block');
        expect(root).toHaveAttribute('data-variant', 'destructive');
        expect(root).toHaveAttribute('data-size', 'sm');
        expect(root).toHaveClass('border-destructive/30');
    });

    it('merges a custom className', () => {
        const { container } = render(<CodeBlock className="custom" />);
        expect(slot(container, 'code-block')).toHaveClass('custom');
    });
});

describe('CodeBlockContent', () => {
    it('renders a string child as one text node', () => {
        const { container } = render(
            <CodeBlockContent>{'a\nb'}</CodeBlockContent>,
        );
        const code = slot(container, 'code-block-code');
        expect(code?.childNodes).toHaveLength(1);
        expect(code).toHaveTextContent('a b');
        expect(slot(container, 'code-block-line')).not.toBeInTheDocument();
    });

    it('always reads left to right and is keyboard focusable', () => {
        const { container } = render(<CodeBlockContent>x</CodeBlockContent>);
        const pre = slot(container, 'code-block-content');
        expect(pre).toHaveAttribute('dir', 'ltr');
        expect(pre).toHaveAttribute('tabindex', '0');
    });

    it('lets the tab stop be removed', () => {
        const { container } = render(
            <CodeBlockContent tabIndex={-1}>x</CodeBlockContent>,
        );
        expect(slot(container, 'code-block-content')).toHaveAttribute(
            'tabindex',
            '-1',
        );
    });

    it('splits a string into numbered lines, ignoring a trailing newline', () => {
        const { container } = render(
            <CodeBlockContent lineNumbers>
                {'one\ntwo\nthree\n'}
            </CodeBlockContent>,
        );
        expect(slot(container, 'code-block-content')).toHaveAttribute(
            'data-numbered',
            'true',
        );
        expect(
            container.querySelectorAll('[data-slot="code-block-line"]'),
        ).toHaveLength(3);
    });

    it('starts the line counter at startLine', () => {
        const { container } = render(
            <CodeBlockContent lineNumbers startLine={42}>
                x
            </CodeBlockContent>,
        );
        expect(slot(container, 'code-block-content')).toHaveStyle({
            counterReset: 'line 41',
        });
    });

    it('marks wrapped content', () => {
        const { container } = render(
            <CodeBlockContent wrap>x</CodeBlockContent>,
        );
        expect(slot(container, 'code-block-content')).toHaveAttribute(
            'data-wrap',
            'true',
        );
    });

    it('leaves wrap and numbering off by default', () => {
        const { container } = render(<CodeBlockContent>x</CodeBlockContent>);
        const pre = slot(container, 'code-block-content');
        expect(pre).not.toHaveAttribute('data-wrap');
        expect(pre).not.toHaveAttribute('data-numbered');
    });
});

describe('CodeBlockLine', () => {
    it.each(['default', 'added', 'removed', 'highlighted'] as const)(
        'sets data-variant="%s"',
        (variant) => {
            const { container } = render(
                <CodeBlockLine variant={variant}>x</CodeBlockLine>,
            );
            expect(slot(container, 'code-block-line')).toHaveAttribute(
                'data-variant',
                variant,
            );
        },
    );

    it.each([undefined, null, '', []])(
        'keeps an empty line (%s) as a newline',
        (children) => {
            const { container } = render(
                <CodeBlockLine>{children}</CodeBlockLine>,
            );
            expect(
                slot(container, 'code-block-line-content')?.textContent,
            ).toBe('\n');
        },
    );
});

describe('CodeBlockCopyButton', () => {
    const writeText = vi.fn(async () => {});

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            configurable: true,
        });
        writeText.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
        Reflect.deleteProperty(navigator, 'clipboard');
    });

    it('copies its value and announces it', async () => {
        const onClick = vi.fn();
        render(<CodeBlockCopyButton value="npm install" onClick={onClick} />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
        });

        expect(writeText).toHaveBeenCalledWith('npm install');
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Copied' })).toHaveAttribute(
            'data-copied',
            'true',
        );
        expect(
            screen.getByText('Copied', { selector: '[aria-live="polite"]' }),
        ).toBeInTheDocument();
    });

    it('returns to the copy state after two seconds', async () => {
        render(<CodeBlockCopyButton value="x" />);
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
        });
        act(() => {
            vi.advanceTimersByTime(2000);
        });
        expect(
            screen.getByRole('button', { name: 'Copy' }),
        ).not.toHaveAttribute('data-copied');
    });

    it('stays in the copy state when the clipboard rejects', async () => {
        writeText.mockRejectedValueOnce(new Error('blocked'));
        render(<CodeBlockCopyButton value="x" />);
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
        });
        expect(
            screen.getByRole('button', { name: 'Copy' }),
        ).toBeInTheDocument();
    });
});
