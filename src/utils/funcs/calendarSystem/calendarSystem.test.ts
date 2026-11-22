import { faIR } from '@daypicker/persian';
import { DateLib } from 'react-day-picker';
import {
    formatJalali,
    getDateFormatter,
    JALALI_CALENDAR_PROPS,
    JALALI_DATE_FORMAT,
    JALALI_FORMATTERS,
} from '.';

// 1 Azar 1405, a Sunday.
const AZAR_1 = new Date(2026, 10, 22);

describe('calendarSystem', () => {
    it('formats a Jalali date with Persian month names and digits', () => {
        expect(formatJalali(AZAR_1, JALALI_DATE_FORMAT)).toBe('۱ آذر ۱۴۰۵');
        expect(formatJalali(AZAR_1, 'yyyy/MM/dd')).toBe('۱۴۰۵/۰۹/۰۱');
    });

    it('picks the formatter of each calendar', () => {
        expect(getDateFormatter()(AZAR_1, 'yyyy-MM-dd')).toBe('2026-11-22');
        expect(getDateFormatter('gregorian')(AZAR_1, 'yyyy-MM-dd')).toBe(
            '2026-11-22',
        );
        expect(getDateFormatter('jalali')(AZAR_1, 'd LLLL y')).toBe(
            '۱ آذر ۱۴۰۵',
        );
    });

    it('keeps DayPicker options when used as dateLib overrides', () => {
        const lib = new DateLib(
            { locale: faIR, weekStartsOn: 0 },
            JALALI_CALENDAR_PROPS.dateLib,
        );
        // Sunday start from the options, not the locale's Saturday.
        expect(lib.startOfWeek(AZAR_1).getDay()).toBe(0);
        expect(lib.startOfMonth(AZAR_1)).toEqual(AZAR_1);
    });

    it('labels months and weekdays the Persian way', () => {
        expect(JALALI_FORMATTERS.formatMonthDropdown?.(AZAR_1)).toBe('آذر');
        expect(JALALI_FORMATTERS.formatWeekdayName?.(AZAR_1)).toBe('ی');
    });

    it('keeps two-letter weekdays for a non-Persian locale', () => {
        const lib = new DateLib({}, JALALI_CALENDAR_PROPS.dateLib);
        expect(JALALI_FORMATTERS.formatWeekdayName?.(AZAR_1, {}, lib)).toBe(
            'Su',
        );
    });
});
