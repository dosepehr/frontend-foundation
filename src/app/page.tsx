'use client';
import ThemeChange from '@/components/common/ThemeChange';
import { Button } from '@/components/ui/Button';
import CardGroup from '@/components/ui/Card';
import { DatePickerDemo } from '@/components/ui/DatePicker';
import EmptyGroup from '@/components/ui/Empty';
import { Input } from '@/components/ui/Input';
import PaginationGroup from '@/components/ui/Pagination';

const Page = () => {
    return (
        <>
            <ThemeChange />
            <PaginationGroup />
        </>
    );
};

export default Page;

