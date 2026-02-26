'use client';
import ThemeChange from '@/components/common/ThemeChange';
import { Toggle } from '@/components/ui/Toggle';
import { Book, Italic } from 'lucide-react';

const Page = () => {
    return (
        <>
            <ThemeChange />
            <Toggle variant='outline' aria-label='outline variant'>
                <Italic />
            </Toggle>
        </>
    );
};

export default Page;

