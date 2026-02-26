'use client';
import ThemeChange from '@/components/common/ThemeChange';
import { AppSidebar } from '@/components/ui/Sidebar';
import { SidebarTrigger } from '@/components/ui/Sidebar/components';
import { Toggle } from '@/components/ui/Toggle';
import { Book, Italic } from 'lucide-react';

const Page = () => {
    return (
        <>
            <ThemeChange />
            <AppSidebar />
            <Toggle variant='outline' aria-label='outline variant'>
                <Italic />
            </Toggle>
            <SidebarTrigger />
        </>
    );
};

export default Page;

