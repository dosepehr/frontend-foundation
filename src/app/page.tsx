'use client';

import { useTheme } from 'next-themes';
import { useDirection } from '../components/ui/direction';
import ThemeChanger from '../components/ui/ThemeChanger';

export default function Page() {
    const direction = useDirection();
    const { theme } = useTheme();

    return (
        <div className="flex min-h-svh p-6">
            <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
                <div className="flex items-center gap-2">
                    <ThemeChanger />
                    <p className="shimmer text-sm text-muted-foreground">
                        Generating response&hellip;
                    </p>
                    <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                        <p className="shimmer-color-blue-500/60 shimmer">
                            Generating response&hellip;
                        </p>
                        <p className="shimmer-color-[#378ADD] shimmer">
                            Generating response&hellip;
                        </p>
                    </div>

                    <span className="text-xs text-muted-foreground">
                        Theme: {theme ?? '—'} · Direction: {direction}
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
