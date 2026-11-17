'use client';

import { useControllableState } from '@/hooks/useControllableState';
import { format as formatWithDateFns } from 'date-fns';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

export type UseDateRangePickerOptions = {
    value?: DateRange;
    onChange?: (range?: DateRange) => void;
    format?: string;
    /** Formats each end; defaults to date-fns (Gregorian). */
    formatDate?: (date: Date, format: string) => string;
    closeOnSelect?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

/** "Jan 1, 2026 – Jan 9, 2026", or "Jan 1, 2026 – …" while the end is open. */
export function formatDateRange(
    range: DateRange | undefined,
    format: string,
    formatDate: (date: Date, format: string) => string = formatWithDateFns,
) {
    if (!range?.from) return '';
    const from = formatDate(range.from, format);
    return `${from} – ${range.to ? formatDate(range.to, format) : '…'}`;
}

/**
 * Open state and selection for a date range popover. Counts picks while
 * open, since the first pick already sets both ends to the same day.
 */
export function useDateRangePicker({
    value,
    onChange,
    format = 'LLL d, y',
    formatDate,
    closeOnSelect = true,
    open: externalOpen,
    onOpenChange,
}: UseDateRangePickerOptions) {
    const [open, setOpenState] = useControllableState({
        value: externalOpen,
        defaultValue: false,
        onChange: onOpenChange,
    });
    const [picks, setPicks] = useState(0);

    const setOpen = (next: boolean) => {
        if (next) setPicks(0);
        setOpenState(next);
    };

    const select = (range?: DateRange) => {
        onChange?.(range);
        const nextPicks = picks + 1;
        setPicks(nextPicks);
        if (closeOnSelect && nextPicks >= 2 && range?.from && range.to) {
            setOpen(false);
        }
    };

    return {
        open,
        setOpen,
        select,
        label: formatDateRange(value, format, formatDate),
    };
}
