/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Calendar from '@/components/ui/Calendar';
import ComboBox from '@/components/ui/ComboBox';
import Input from '@/components/ui/Input';
import MultiComboBox from '@/components/ui/MultiComboBox';
import Popover, {
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import RangeInput from '@/components/ui/RangeInput';
import Select from '@/components/ui/Select';
import { useDateRangePicker } from '@/hooks/useDateRangePicker';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils/funcs/cn';
import { isSearchableSelect, remoteOptionProps } from '@/utils/funcs/filters';
import { toLatinDigits } from '@/utils/funcs/numberFormat';
import { CalendarIcon } from 'lucide-react';
import type {
    DateInputProps,
    MultiSelectInputProps,
    NumberRangeInputProps,
    SelectInputProps,
    TextInputProps,
} from './FilterInput.types';

/** A plain select, or a searchable combo box for long or remote lists. */
const SelectFilterInput = ({ filter, labels }: SelectInputProps) =>
    isSearchableSelect(filter) ? (
        <ComboBox
            {...remoteOptionProps(filter)}
            aria-label={filter.label}
            value={filter.value ?? ''}
            onChange={(value) => filter.onChange(value || null)}
            placeholder={labels.selectPlaceholder(filter.label)}
            searchPlaceholder={labels.searchPlaceholder(filter.label)}
            loadingMoreText={labels.loading}
        />
    ) : (
        <Select
            aria-label={filter.label}
            options={filter.options}
            value={filter.value ?? ''}
            onValueChange={(value) => filter.onChange(value || null)}
            placeholder={labels.selectPlaceholder(filter.label)}
            isLoading={filter.isPending}
            isError={filter.isError}
        />
    );

const MultiSelectFilterInput = ({ filter, labels }: MultiSelectInputProps) => (
    <MultiComboBox
        {...remoteOptionProps(filter)}
        aria-label={filter.label}
        selected={filter.value ?? []}
        onChange={(values) =>
            filter.onChange(values.length > 0 ? values : null)
        }
        placeholder={labels.selectPlaceholder(filter.label)}
        searchPlaceholder={labels.searchPlaceholder(filter.label)}
        loadingMoreText={labels.loading}
    />
);

const TextFilterInput = ({ filter, labels }: TextInputProps) => (
    <Input
        aria-label={filter.label}
        value={filter.value ?? ''}
        onChange={(event) => filter.onChange(toLatinDigits(event.target.value))}
        placeholder={
            filter.placeholder ?? labels.searchPlaceholder(filter.label)
        }
    />
);

const DateField = ({
    date,
    format,
}: {
    date?: Date;
    format: (date: Date) => string;
}) => (
    <span
        data-slot="date-filter-field"
        className="inline-block min-h-6 min-w-16 border-b border-input pb-0.5 text-sm font-semibold text-foreground"
    >
        {date && format(date)}
    </span>
);

/**
 * A compact "from … to …" row; the calendar opens in its own popover beside
 * the filter menu (below it on small screens).
 */
const DateFilterInput = ({
    filter,
    calendar,
    calendarProps,
    formatDate,
    labels,
}: DateInputProps) => {
    const range = filter.value ?? undefined;
    const isMobile = useIsMobile(768);
    const picker = useDateRangePicker({
        value: range,
        onChange: (next) => filter.onChange(next ?? null),
    });
    const single = filter.mode === 'single';

    return (
        <Popover open={picker.open} onOpenChange={picker.setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    aria-label={filter.label}
                    className="group flex w-full items-center gap-2.5 rounded-md text-start outline-none"
                >
                    <span
                        data-slot="date-filter-icon"
                        className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-md border border-input/50 text-muted-foreground shadow-xs transition-[color,box-shadow,border]',
                            'group-hover:border-primary group-hover:text-foreground',
                            'group-aria-expanded:border-primary group-aria-expanded:text-foreground',
                            'group-focus-visible:border-primary group-focus-visible:ring-3 group-focus-visible:ring-primary/50',
                        )}
                    >
                        <CalendarIcon aria-hidden className="size-4" />
                    </span>
                    {single ? (
                        <DateField date={range?.from} format={formatDate} />
                    ) : (
                        <>
                            <span className="text-sm font-semibold">
                                {labels.from}
                            </span>
                            <DateField date={range?.from} format={formatDate} />
                            <span className="text-sm font-semibold">
                                {labels.to}
                            </span>
                            <DateField date={range?.to} format={formatDate} />
                        </>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                aria-label={filter.label}
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'center' : 'start'}
                sideOffset={isMobile ? 8 : 28}
                collisionPadding={8}
                className="w-auto p-1"
            >
                {single ? (
                    <Calendar
                        calendar={calendar}
                        {...calendarProps}
                        mode="single"
                        selected={range?.from}
                        defaultMonth={range?.from}
                        onSelect={(day) => {
                            filter.onChange(
                                day ? { from: day, to: day } : null,
                            );
                            picker.setOpen(false);
                        }}
                    />
                ) : (
                    <Calendar
                        calendar={calendar}
                        {...calendarProps}
                        mode="range"
                        selected={range}
                        defaultMonth={range?.from}
                        onSelect={picker.select}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
};

const NumberRangeFilterInput = ({ filter, labels }: NumberRangeInputProps) => {
    const { from, to } = filter.value ?? {};
    return (
        <RangeInput
            min={filter.min ?? 0}
            max={filter.max ?? 1_000_000}
            step={filter.step ?? 1}
            showSlider
            thousandSeparator=","
            fromPlaceholder={labels.from}
            toPlaceholder={labels.to}
            fromLabel={`${filter.label}: ${labels.from}`}
            toLabel={`${filter.label}: ${labels.to}`}
            value={[from ?? null, to ?? null]}
            onValueChange={([nextFrom, nextTo]) =>
                filter.onChange({
                    from: nextFrom ?? undefined,
                    to: nextTo ?? undefined,
                })
            }
        />
    );
};

export {
    DateFilterInput,
    MultiSelectFilterInput,
    NumberRangeFilterInput,
    SelectFilterInput,
    TextFilterInput,
};
