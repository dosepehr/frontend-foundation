export type FocusMove = 'next' | 'previous' | 'first' | 'last';

const KEY_MOVES: Record<string, FocusMove> = {
    ArrowDown: 'next',
    ArrowUp: 'previous',
    Home: 'first',
    End: 'last',
};

/**
 * Moves focus among the elements matching `selector` inside `container`,
 * relative to the focused one. Returns the newly focused element.
 */
export function moveFocus(
    container: HTMLElement,
    selector: string,
    move: FocusMove,
) {
    const items = [...container.querySelectorAll<HTMLElement>(selector)].filter(
        (item) =>
            !item.hasAttribute('disabled') &&
            item.getAttribute('aria-disabled') !== 'true',
    );
    if (items.length === 0) return null;

    const current = items.indexOf(document.activeElement as HTMLElement);
    const index = {
        first: 0,
        last: items.length - 1,
        next: Math.min(current + 1, items.length - 1),
        previous: Math.max(current - 1, 0),
    }[move];

    items[index].focus();
    return items[index];
}

/**
 * Keyboard handler for a vertical list: Arrow Up/Down and Home/End move
 * focus among `selector` items. Returns true when it handled the key.
 */
export function handleListKeyDown(
    event: {
        key: string;
        currentTarget: HTMLElement;
        preventDefault: () => void;
    },
    selector: string,
) {
    const move = KEY_MOVES[event.key];
    if (!move) return false;
    event.preventDefault();
    moveFocus(event.currentTarget, selector, move);
    return true;
}
