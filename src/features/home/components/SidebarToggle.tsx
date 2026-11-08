'use client';

import { useSidebarStore } from '@/store/useSidebarStore';

const SidebarToggle = () => {
    const { isOpen, toggle } = useSidebarStore();

    return (
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
    );
};

export default SidebarToggle;
