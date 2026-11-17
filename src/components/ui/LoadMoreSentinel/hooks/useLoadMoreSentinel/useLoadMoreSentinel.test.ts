import { renderHook } from '@testing-library/react';
import {
    useLoadMoreSentinel,
    type UseLoadMoreSentinelOptions,
} from './useLoadMoreSentinel';

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

let observers: {
    callback: ObserverCallback;
    disconnect: ReturnType<typeof vi.fn>;
}[] = [];

beforeEach(() => {
    observers = [];
    vi.stubGlobal(
        'IntersectionObserver',
        class {
            disconnect = vi.fn();
            observe = vi.fn();
            constructor(callback: ObserverCallback) {
                observers.push({ callback, disconnect: this.disconnect });
            }
        },
    );
});

afterEach(() => vi.unstubAllGlobals());

const attach = (options: UseLoadMoreSentinelOptions) => {
    const { result } = renderHook(() => useLoadMoreSentinel(options));
    return result.current(document.createElement('div'));
};

describe('useLoadMoreSentinel', () => {
    it('fetches the next page when the sentinel comes into view', () => {
        const onFetchNextPage = vi.fn();
        attach({ hasNextPage: true, onFetchNextPage });

        observers[0].callback([{ isIntersecting: false }]);
        expect(onFetchNextPage).not.toHaveBeenCalled();

        observers[0].callback([{ isIntersecting: true }]);
        expect(onFetchNextPage).toHaveBeenCalledTimes(1);
    });

    it('does not observe without a next page or while fetching', () => {
        attach({ hasNextPage: false, onFetchNextPage: vi.fn() });
        attach({
            hasNextPage: true,
            isFetchingNextPage: true,
            onFetchNextPage: vi.fn(),
        });
        expect(observers).toHaveLength(0);
    });

    it('disconnects on cleanup', () => {
        const cleanup = attach({ hasNextPage: true, onFetchNextPage: vi.fn() });
        expect(typeof cleanup).toBe('function');
        (cleanup as () => void)();
        expect(observers[0].disconnect).toHaveBeenCalled();
    });

    it('ignores a missing node and browsers without IntersectionObserver', () => {
        const { result } = renderHook(() =>
            useLoadMoreSentinel({
                hasNextPage: true,
                onFetchNextPage: vi.fn(),
            }),
        );
        expect(result.current(null)).toBeUndefined();

        vi.unstubAllGlobals();
        // eslint-disable-next-line unicorn/no-useless-undefined -- simulates a browser without the API
        vi.stubGlobal('IntersectionObserver', undefined);
        expect(result.current(document.createElement('div'))).toBeUndefined();
    });
});
