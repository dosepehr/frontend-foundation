'use client';

import { useTheme } from 'next-themes';
import { useDirection } from '../components/ui/direction';
import ThemeChanger from '../components/ui/ThemeChanger';
import { useSidebarStore } from '../store/useSidebarStore';

export default function Page() {
    const direction = useDirection();
    const { theme } = useTheme();
    const { isOpen, toggle } = useSidebarStore();

    return (
        <div className="flex min-h-svh p-6">
            <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
                <div className="flex items-center gap-2">
                    <ThemeChanger />
                    <span className="text-xs text-muted-foreground">
                        Theme: {theme ?? '—'} · Direction: {direction}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggle}
                        className="rounded-md border px-3 py-1.5 text-xs"
                    >
                        Toggle sidebar
                    </button>
                    <span className="text-xs text-muted-foreground">
                        Sidebar is {isOpen ? 'open' : 'closed'}
                    </span>
                </div>
                <div>
                    <h1 className="font-medium">Project ready!</h1>
                    <p>You may now add components and start building.</p>
                </div>
            </div>
        </div>
    );
}
