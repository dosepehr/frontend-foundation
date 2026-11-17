import { describe, expect, it } from 'vitest';
import { addTags, splitTags } from './tags';

describe('splitTags', () => {
    it('splits on commas by default and trims', () => {
        expect(splitTags('a, b ,c')).toEqual(['a', 'b', 'c']);
    });

    it('splits on new lines', () => {
        expect(splitTags('a\nb\r\nc')).toEqual(['a', 'b', 'c']);
    });

    it('drops empty parts', () => {
        expect(splitTags(',a,, ,b,')).toEqual(['a', 'b']);
    });

    it('uses custom separators and ignores key names', () => {
        expect(splitTags('a;b|c,d', ['Enter', ';', '|'])).toEqual([
            'a',
            'b',
            'c,d',
        ]);
    });

    it('escapes separators that are special in regular expressions', () => {
        expect(splitTags('a]b^c', [']', '^'])).toEqual(['a', 'b', 'c']);
    });

    it('returns one tag when there is no separator', () => {
        expect(splitTags(' hello ')).toEqual(['hello']);
    });
});

describe('addTags', () => {
    it('appends new tags', () => {
        expect(addTags(['a'], ['b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('skips duplicates, also within the candidates', () => {
        expect(addTags(['a'], ['a', 'b', 'b'])).toEqual(['a', 'b']);
    });

    it('trims and skips empty candidates', () => {
        expect(addTags([], ['  x ', '   '])).toEqual(['x']);
    });

    it('skips tags longer than maxLength', () => {
        expect(addTags([], ['ok', 'too long'], { maxLength: 3 })).toEqual([
            'ok',
        ]);
    });

    it('stops at maxItems', () => {
        expect(addTags(['a'], ['b', 'c', 'd'], { maxItems: 3 })).toEqual([
            'a',
            'b',
            'c',
        ]);
    });

    it('does not mutate the original list', () => {
        const tags = ['a'];
        addTags(tags, ['b']);
        expect(tags).toEqual(['a']);
    });
});
