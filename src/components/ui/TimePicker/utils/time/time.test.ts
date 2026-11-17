import { describe, expect, it } from 'vitest';
import {
    formatTime,
    formatTimeLabel,
    from12Hour,
    pad,
    parseTime,
    timeSteps,
    to12Hour,
    updateTime,
} from './time';

describe('parseTime', () => {
    it('parses hours and minutes, with optional seconds', () => {
        expect(parseTime('09:05')).toEqual({
            hours: 9,
            minutes: 5,
            seconds: 0,
        });
        expect(parseTime('9:05')).toEqual({ hours: 9, minutes: 5, seconds: 0 });
        expect(parseTime('23:59:58')).toEqual({
            hours: 23,
            minutes: 59,
            seconds: 58,
        });
        expect(parseTime(' 10:00 ')).toEqual({
            hours: 10,
            minutes: 0,
            seconds: 0,
        });
    });

    it('rejects invalid values', () => {
        for (const value of [
            '',
            '24:00',
            '12:60',
            '12:00:60',
            '1200',
            'ab:cd',
            '1:5',
        ]) {
            expect(parseTime(value)).toBeNull();
        }
        expect(parseTime(null)).toBeNull();
        expect(parseTime()).toBeNull();
    });
});

describe('formatTime', () => {
    it('zero-pads hours and minutes', () => {
        expect(formatTime({ hours: 7, minutes: 3, seconds: 9 })).toBe('07:03');
    });

    it('adds seconds on request', () => {
        expect(
            formatTime(
                { hours: 7, minutes: 3, seconds: 9 },
                { showSeconds: true },
            ),
        ).toBe('07:03:09');
    });
});

describe('12-hour conversion', () => {
    it('converts to a 12-hour clock', () => {
        expect(to12Hour(0)).toEqual({ hour: 12, period: 'AM' });
        expect(to12Hour(9)).toEqual({ hour: 9, period: 'AM' });
        expect(to12Hour(12)).toEqual({ hour: 12, period: 'PM' });
        expect(to12Hour(23)).toEqual({ hour: 11, period: 'PM' });
    });

    it('converts back to 24 hours', () => {
        expect(from12Hour(12, 'AM')).toBe(0);
        expect(from12Hour(9, 'AM')).toBe(9);
        expect(from12Hour(12, 'PM')).toBe(12);
        expect(from12Hour(11, 'PM')).toBe(23);
    });
});

describe('formatTimeLabel', () => {
    it('formats on a 24-hour clock by default', () => {
        expect(formatTimeLabel('14:05')).toBe('14:05');
        expect(formatTimeLabel('14:05:30', { showSeconds: true })).toBe(
            '14:05:30',
        );
    });

    it('formats on a 12-hour clock', () => {
        expect(formatTimeLabel('14:05', { hourCycle: 12 })).toBe('2:05 PM');
        expect(formatTimeLabel('00:30', { hourCycle: 12 })).toBe('12:30 AM');
        expect(
            formatTimeLabel('00:30:15', { hourCycle: 12, showSeconds: true }),
        ).toBe('12:30:15 AM');
    });

    it('returns an empty string for invalid values', () => {
        expect(formatTimeLabel('nope')).toBe('');
        expect(formatTimeLabel()).toBe('');
    });
});

describe('timeSteps', () => {
    it('lists values a step apart', () => {
        expect(timeSteps(60, 15)).toEqual([0, 15, 30, 45]);
        expect(timeSteps(24)).toHaveLength(24);
        expect(timeSteps(60, 7).at(-1)).toBe(56);
    });

    it('treats steps below 1 as 1', () => {
        expect(timeSteps(3, 0)).toEqual([0, 1, 2]);
    });
});

describe('updateTime', () => {
    it('patches a part of an existing value', () => {
        expect(updateTime('10:30', { minutes: 45 })).toBe('10:45');
    });

    it('starts an empty value at midnight', () => {
        expect(updateTime(undefined, { hours: 8 })).toBe('08:00');
        expect(updateTime('', { seconds: 5 }, { showSeconds: true })).toBe(
            '00:00:05',
        );
    });

    it('pads', () => {
        expect(pad(5)).toBe('05');
        expect(pad(12)).toBe('12');
    });
});
