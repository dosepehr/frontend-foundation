'use client';

import { useDirection } from '@/components/ui/Direction';
import ThemeChanger from '@/components/ui/ThemeChanger';
import { useTheme } from 'next-themes';

const ThemeStatus = () => {
    const direction = useDirection();
    const { theme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <ThemeChanger />
            <span className="text-xs text-muted-foreground">
                Theme: {theme ?? '—'} · Direction: {direction}
            </span>
        </div>
    );
};

export default ThemeStatus;
