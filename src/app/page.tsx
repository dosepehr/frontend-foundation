'use client';
import ThemeChange from '@/components/common/ThemeChange';
import { Button } from '@/components/ui/Button';
import CardGroup from '@/components/ui/Card';
import { DatePickerDemo } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/Input';

const Page = () => {
    return (
        <>
            <ThemeChange />
            <DatePickerDemo />
        </>
    );
};

export default Page;

