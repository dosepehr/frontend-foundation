import { describe, expect, it } from 'vitest';
import { cn } from '.';

describe('cn', () => {
    it('joins class names', () => {
        expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    });

    it('drops falsy values and applies conditional objects', () => {
        expect(
            cn('base', false, null, undefined, { active: true, hidden: false }),
        ).toBe('base active');
    });

    it('flattens arrays', () => {
        expect(cn(['a', ['b', 'c']])).toBe('a b c');
    });

    it('lets a later Tailwind class override a conflicting earlier one', () => {
        expect(cn('px-2 text-sm', 'px-4')).toBe('text-sm px-4');
        expect(cn('bg-red-500', undefined, 'bg-primary')).toBe('bg-primary');
    });

    it('returns an empty string for no input', () => {
        expect(cn()).toBe('');
    });
});
