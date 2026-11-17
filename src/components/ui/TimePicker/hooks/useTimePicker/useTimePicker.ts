'use client';

import {
    from12Hour,
    pad,
    parseTime,
    timeSteps,
    to12Hour,
    updateTime,
    type DayPeriod,
    type HourCycle,
} from '../../utils/time/time';

export type TimeColumnOption = { value: number | string; label: string };

export type TimeColumn = {
    id: 'hours' | 'minutes' | 'seconds' | 'period';
    label: string;
    options: TimeColumnOption[];
    selected: number | string | undefined;
    onSelect: (value: number | string) => void;
};

export type UseTimePickerOptions = {
    value?: string;
    onChange?: (value?: string) => void;
    hourCycle?: HourCycle;
    showSeconds?: boolean;
    minuteStep?: number;
    secondStep?: number;
};

const toOptions = (values: number[]) =>
    values.map((value) => ({ value, label: pad(value) }));

/** The columns (hours, minutes, seconds, AM/PM) of a time picker. */
export function useTimePicker({
    value,
    onChange,
    hourCycle = 24,
    showSeconds = false,
    minuteStep = 1,
    secondStep = 1,
}: UseTimePickerOptions) {
    const parts = parseTime(value);
    const clock = parts ? to12Hour(parts.hours) : undefined;

    const update = (patch: Parameters<typeof updateTime>[1]) =>
        onChange?.(updateTime(value, patch, { showSeconds }));

    const hours: TimeColumn =
        hourCycle === 24
            ? {
                  id: 'hours',
                  label: 'Hours',
                  options: toOptions(timeSteps(24)),
                  selected: parts?.hours,
                  onSelect: (hour) => update({ hours: Number(hour) }),
              }
            : {
                  id: 'hours',
                  label: 'Hours',
                  options: Array.from({ length: 12 }, (_, index) => ({
                      value: index + 1,
                      label: String(index + 1),
                  })),
                  selected: clock?.hour,
                  onSelect: (hour) =>
                      update({
                          hours: from12Hour(
                              Number(hour),
                              clock?.period ?? 'AM',
                          ),
                      }),
              };

    const columns: TimeColumn[] = [
        hours,
        {
            id: 'minutes',
            label: 'Minutes',
            options: toOptions(timeSteps(60, minuteStep)),
            selected: parts?.minutes,
            onSelect: (minute) => update({ minutes: Number(minute) }),
        },
    ];

    if (showSeconds) {
        columns.push({
            id: 'seconds',
            label: 'Seconds',
            options: toOptions(timeSteps(60, secondStep)),
            selected: parts?.seconds,
            onSelect: (second) => update({ seconds: Number(second) }),
        });
    }

    if (hourCycle === 12) {
        columns.push({
            id: 'period',
            label: 'AM/PM',
            options: [
                { value: 'AM', label: 'AM' },
                { value: 'PM', label: 'PM' },
            ],
            selected: clock?.period,
            onSelect: (period) =>
                update({
                    hours: from12Hour(clock?.hour ?? 12, period as DayPeriod),
                }),
        });
    }

    return { columns, hasValue: parts !== null };
}
