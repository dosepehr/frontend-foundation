'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { Button } from '../Button';
import { Calendar } from '../Calendar';

export function DatePickerDemo() {
    const [date, setDate] = React.useState<Date>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    data-empty={!date}
                    className='
                        data-[empty=true]:text-muted-foreground
                        w-full justify-start text-left font-normal active:scale-100
                        hover:border-ring!
                        data-[state=open]:border-primary!
                        data-[state=open]:outline
                        data-[state=open]:outline-primary/40!
                        transition-[color,box-shadow,border-color]
                    '
                >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar mode='single' selected={date} onSelect={setDate} />
            </PopoverContent>
        </Popover>
    );
}

