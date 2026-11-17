import { describe, expect, it, vi } from 'vitest';
import { assignRef } from '.';

describe('assignRef', () => {
    it('calls a callback ref', () => {
        const ref = vi.fn();
        assignRef(ref, 'node');
        expect(ref).toHaveBeenCalledWith('node');
    });

    it('sets an object ref', () => {
        const ref = { current: null as string | null };
        assignRef(ref, 'node');
        expect(ref.current).toBe('node');
    });

    it('ignores a missing ref', () => {
        expect(() => assignRef(undefined, 'node')).not.toThrow();
        expect(() => assignRef(null, 'node')).not.toThrow();
    });
});
