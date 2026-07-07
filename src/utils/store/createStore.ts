import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

export function createStore<T>(
    initializer: StateCreator<T, [['zustand/devtools', never]]>,
    name: string,
) {
    return create<T>()(
        devtools(initializer, {
            name,
            enabled: process.env.NODE_ENV === 'development',
        }),
    );
}
