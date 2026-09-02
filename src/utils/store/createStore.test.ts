import { createStore } from './createStore';

type CounterState = {
    count: number;
    inc: () => void;
};

describe('createStore', () => {
    it('creates a zustand store with the given initializer', () => {
        const useStore = createStore<CounterState>(
            (set) => ({
                count: 0,
                inc: () => set((s) => ({ count: s.count + 1 })),
            }),
            'test-store',
        );

        expect(useStore.getState().count).toBe(0);

        useStore.getState().inc();

        expect(useStore.getState().count).toBe(1);
    });

    it('supports multiple independent state updates', () => {
        const useStore = createStore<CounterState>(
            (set) => ({
                count: 10,
                inc: () => set((s) => ({ count: s.count + 1 })),
            }),
            'another-store',
        );

        useStore.getState().inc();
        useStore.getState().inc();
        useStore.getState().inc();

        expect(useStore.getState().count).toBe(13);
    });
});
