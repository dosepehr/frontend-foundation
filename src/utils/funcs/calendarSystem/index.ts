// Switches DayPicker between the Gregorian and Jalali (Persian) calendars.
// Only the display changes: selected values stay plain `Date`s, so forms
// still send Gregorian dates (see `toIsoDay` in filterParsers).
import { faIR } from '@daypicker/persian';
import { format as formatGregorian } from 'date-fns';
import * as dateFnsJalali from 'date-fns-jalali';
import {
    DateLib,
    type DayPickerProps,
    type Formatters,
} from 'react-day-picker';

export type CalendarSystem = 'gregorian' | 'jalali';

/** Formats a date with a date-fns pattern, e.g. `(date, 'd LLLL y')`. */
export type DateFormatter = (date: Date, format: string) => string;

/**
 * DayPicker props for the Jalali calendar. `dateLib` holds the raw
 * date-fns-jalali functions, not a prebuilt `DateLib`, so DayPicker still
 * applies its own `weekStartsOn`, `timeZone` and `numerals` props.
 */
export const JALALI_CALENDAR_PROPS = {
    dateLib: dateFnsJalali,
    locale: faIR,
    dir: 'rtl',
    numerals: 'arabext',
} satisfies Pick<DayPickerProps, 'dateLib' | 'locale' | 'dir' | 'numerals'>;

/** Trigger format of Jalali pickers; "PPP" reads as "۱-ام آذر ۱۴۰۵". */
export const JALALI_DATE_FORMAT = 'd LLLL y';

const jalaliDateLib = new DateLib(
    { locale: faIR, numerals: 'arabext' },
    dateFnsJalali,
);

/** Jalali date with Persian month names and digits: "۱ آذر ۱۴۰۵". */
export const formatJalali: DateFormatter = (date, format) =>
    jalaliDateLib.format(date, format);

export const getDateFormatter = (
    calendar: CalendarSystem = 'gregorian',
): DateFormatter => (calendar === 'jalali' ? formatJalali : formatGregorian);

/**
 * Caption and weekday labels of the Jalali grid. The default weekday
 * pattern renders "۱ش"; the narrow one renders "ی" like Persian calendars.
 */
export const JALALI_FORMATTERS: Partial<Formatters> = {
    formatMonthDropdown: (month, dateLib = jalaliDateLib) =>
        dateLib.format(month, 'LLLL'),
    formatWeekdayName: (weekday, _options, dateLib = jalaliDateLib) =>
        dateLib.format(
            weekday,
            dateLib.options.locale?.code?.startsWith('fa') ? 'ccccc' : 'cccccc',
        ),
};
