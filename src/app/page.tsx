'use client';
import ThemeChange from '@/components/common/ThemeChange';
import { Button } from '@/components/ui/Button';
import CardGroup from '@/components/ui/Card';
import { DatePickerDemo } from '@/components/ui/DatePicker';
import EmptyGroup from '@/components/ui/Empty';
import { Input } from '@/components/ui/Input';
import PaginationGroup from '@/components/ui/Pagination';
import TabsGroup from '@/components/ui/Tabs';

const Page = () => {
    return (
        <>
            <ThemeChange />
            <PaginationGroup />
            <TabsGroup
                defaultValue='account'
                tabs={[
                    {
                        value: 'account',
                        label: 'Account',
                        content: <p>Make changes to your account here.</p>,
                    },
                    {
                        value: 'password',
                        label: 'Password',
                        content: <p>Change your password here.</p>,
                    },
                ]}
            />{' '}
        </>
    );
};

export default Page;

