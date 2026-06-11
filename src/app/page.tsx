'use client';

import { useTheme } from "next-themes";
import { useDirection } from "../components/ui/direction";
import { ThemeChanger } from "../components/ui/ThemeChanger";

export default function Page() {
    const direction = useDirection();
    const { theme } = useTheme();

    return (
        <div className='flex min-h-svh p-6'>
            <div className='flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose'>
                <div className='flex items-center gap-2'>
                    <ThemeChanger />
                    <span className='text-muted-foreground text-xs'>
                        Theme: {theme ?? '—'} · Direction: {direction}
                    </span>
                </div>
                <div>
                    <h1 className='font-medium'>Project ready!</h1>
                    <p>You may now add components and start building.</p>
                </div>
            </div>
        </div>
    );
}

