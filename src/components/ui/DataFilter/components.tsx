/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Select from '@/components/ui/Select';
import { ArrowUpDownIcon } from 'lucide-react';
import type { SortSelectProps } from './DataFilter.types';

/** Ordering select: an icon, then "Sort:" before the chosen option. */
const SortSelect = ({ options, value, onChange, labels }: SortSelectProps) => (
    <div data-slot="sort-select" className="w-fit shrink-0">
        <Select
            aria-label={labels.sort}
            options={options}
            value={value || undefined}
            onValueChange={onChange}
            placeholder={labels.sort}
            className="pb-0"
            triggerClassName="w-fit gap-2"
            startAddon={
                <span className="flex items-center gap-2">
                    <ArrowUpDownIcon
                        aria-hidden
                        className="size-4 text-foreground"
                    />
                    {value && (
                        <span className="hidden text-sm sm:inline">
                            {labels.sortPrefix}
                        </span>
                    )}
                </span>
            }
        />
    </div>
);

export { SortSelect };
