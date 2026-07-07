import { createStore } from '@/src/utils/store/createStore';

interface SidebarState {
    isOpen: boolean;
    toggle: () => void;
}

export const useSidebarStore = createStore<SidebarState>(
    (set) => ({
        isOpen: false,
        toggle: () => set((s) => ({ isOpen: !s.isOpen }), false, 'sidebar/toggle'),
    }),
    'SidebarStore',
);
