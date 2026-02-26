'use client';
import ThemeChange from '@/components/common/ThemeChange';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { useState } from 'react';
import { toast } from 'sonner';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

const Page = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 12),
        to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
    });
    return (
        <>
            <ThemeChange />

            <Calendar mode='single' selected={date} onSelect={setDate} />

            <Calendar
                mode='range'
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                }
                captionLayout='dropdown'
            />
        </>
    );
};

export default Page;

