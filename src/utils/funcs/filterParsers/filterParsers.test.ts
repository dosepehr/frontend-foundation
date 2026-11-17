import { describe, expect, it } from 'vitest';
import {
    dateRangeParams,
    fromIsoDay,
    numberRangeParams,
    parseAsDateRange,
    parseAsNumberRange,
    toIsoDay,
} from '.';

const JAN_5 = new Date(2026, 0, 5);
const JAN_9 = new Date(2026, 0, 9);

describe('iso days', () => {
    it('writes local days', () => {
        expect(toIsoDay(JAN_5)).toBe('2026-01-05');
        expect(toIsoDay(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
    });

    it('reads local days and rejects invalid ones', () => {
        expect(fromIsoDay('2026-01-05')).toEqual(JAN_5);
        for (const value of [undefined, '', '2026-1-5', '2026-02-31', 'nope']) {
            expect(fromIsoDay(value)).toBeUndefined();
        }
    });
});

describe('parseAsDateRange', () => {
    it('round-trips a range', () => {
        expect(parseAsDateRange.serialize({ from: JAN_5, to: JAN_9 })).toBe(
            '2026-01-05,2026-01-09',
        );
        expect(parseAsDateRange.parse('2026-01-05,2026-01-09')).toEqual({
            from: JAN_5,
            to: JAN_9,
        });
    });

    it('allows an open end', () => {
        expect(parseAsDateRange.serialize({ from: JAN_5 })).toBe('2026-01-05,');
        expect(parseAsDateRange.parse('2026-01-05,')).toEqual({
            from: JAN_5,
            to: undefined,
        });
        expect(parseAsDateRange.serialize({ from: undefined })).toBe('');
    });

    it('rejects a missing or invalid start', () => {
        expect(parseAsDateRange.parse(',2026-01-09')).toBeNull();
        expect(parseAsDateRange.parse('garbage')).toBeNull();
    });

    it('compares by day', () => {
        const later = new Date(2026, 0, 5, 18);
        expect(
            parseAsDateRange.eq(
                { from: JAN_5, to: JAN_9 },
                { from: later, to: JAN_9 },
            ),
        ).toBe(true);
        expect(parseAsDateRange.eq({ from: JAN_5 }, { from: JAN_9 })).toBe(
            false,
        );
    });
});

describe('parseAsNumberRange', () => {
    it('round-trips a range with open ends', () => {
        expect(parseAsNumberRange.serialize({ from: 10, to: 200 })).toBe(
            '10,200',
        );
        expect(parseAsNumberRange.serialize({ to: 200 })).toBe(',200');
        expect(parseAsNumberRange.parse('10,200')).toEqual({
            from: 10,
            to: 200,
        });
        expect(parseAsNumberRange.parse('10,')).toEqual({
            from: 10,
            to: undefined,
        });
        expect(parseAsNumberRange.parse('0,5')).toEqual({ from: 0, to: 5 });
    });

    it('rejects empty and invalid values', () => {
        expect(parseAsNumberRange.parse(',')).toBeNull();
        expect(parseAsNumberRange.parse('a,b')).toBeNull();
    });

    it('compares both ends', () => {
        expect(
            parseAsNumberRange.eq({ from: 1, to: 2 }, { from: 1, to: 2 }),
        ).toBe(true);
        expect(parseAsNumberRange.eq({ from: 1 }, { from: 1, to: 2 })).toBe(
            false,
        );
    });
});

describe('API params', () => {
    it('flattens a date range', () => {
        expect(
            dateRangeParams({ from: JAN_5, to: JAN_9 }, 'start', 'end'),
        ).toEqual({
            start: '2026-01-05',
            end: '2026-01-09',
        });
        expect(dateRangeParams({ from: JAN_5 }, 'start', 'end')).toEqual({
            start: '2026-01-05',
        });
        expect(dateRangeParams(null, 'start', 'end')).toEqual({});
    });

    it('flattens a number range, keeping zero', () => {
        expect(numberRangeParams({ from: 0, to: 50 }, 'min', 'max')).toEqual({
            min: 0,
            max: 50,
        });
        expect(numberRangeParams({ to: 50 }, 'min', 'max')).toEqual({
            max: 50,
        });
        expect(numberRangeParams(undefined, 'min', 'max')).toEqual({});
    });
});
