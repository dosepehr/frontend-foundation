import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleListKeyDown, moveFocus } from '.';

function list(disabledIndex?: number) {
    const container = document.createElement('div');
    for (let index = 0; index < 4; index += 1) {
        const button = document.createElement('button');
        button.dataset.item = '';
        button.textContent = String(index);
        if (index === disabledIndex) button.disabled = true;
        container.append(button);
    }
    document.body.append(container);
    return container;
}

const buttons = (container: HTMLElement) => [
    ...container.querySelectorAll('button'),
];

afterEach(() => {
    document.body.innerHTML = '';
});

describe('moveFocus', () => {
    it('moves to the next and previous item, stopping at the ends', () => {
        const container = list();
        const items = buttons(container);
        items[0].focus();

        moveFocus(container, '[data-item]', 'next');
        expect(items[1]).toHaveFocus();
        moveFocus(container, '[data-item]', 'previous');
        moveFocus(container, '[data-item]', 'previous');
        expect(items[0]).toHaveFocus();
    });

    it('jumps to the first and last item', () => {
        const container = list();
        const items = buttons(container);
        items[1].focus();

        moveFocus(container, '[data-item]', 'last');
        expect(items[3]).toHaveFocus();
        moveFocus(container, '[data-item]', 'first');
        expect(items[0]).toHaveFocus();
    });

    it('starts at the first item when nothing inside is focused', () => {
        const container = list();
        moveFocus(container, '[data-item]', 'next');
        expect(buttons(container)[0]).toHaveFocus();
    });

    it('skips disabled items', () => {
        const container = list(1);
        const items = buttons(container);
        items[0].focus();

        moveFocus(container, '[data-item]', 'next');

        expect(items[2]).toHaveFocus();
    });

    it('skips aria-disabled items', () => {
        const container = list();
        const items = buttons(container);
        items[3].setAttribute('aria-disabled', 'true');
        items[0].focus();

        moveFocus(container, '[data-item]', 'last');

        expect(items[2]).toHaveFocus();
    });

    it('returns null for an empty list', () => {
        expect(
            moveFocus(document.createElement('div'), 'button', 'next'),
        ).toBeNull();
    });
});

describe('handleListKeyDown', () => {
    it('handles arrow, Home and End keys', () => {
        const container = list();
        const items = buttons(container);
        items[0].focus();
        const preventDefault = vi.fn();

        expect(
            handleListKeyDown(
                { key: 'ArrowDown', currentTarget: container, preventDefault },
                '[data-item]',
            ),
        ).toBe(true);
        expect(items[1]).toHaveFocus();
        handleListKeyDown(
            { key: 'End', currentTarget: container, preventDefault },
            '[data-item]',
        );
        expect(items[3]).toHaveFocus();
        expect(preventDefault).toHaveBeenCalledTimes(2);
    });

    it('ignores other keys', () => {
        const preventDefault = vi.fn();
        expect(
            handleListKeyDown(
                { key: 'a', currentTarget: list(), preventDefault },
                '[data-item]',
            ),
        ).toBe(false);
        expect(preventDefault).not.toHaveBeenCalled();
    });
});
