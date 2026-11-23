import { getChartFrameState } from './chartFrameState';

describe('getChartFrameState', () => {
    it('orders loading, error, empty, ready', () => {
        expect(
            getChartFrameState({ isLoading: true, error: 'x', isEmpty: true }),
        ).toBe('loading');
        expect(getChartFrameState({ error: new Error(), isEmpty: true })).toBe(
            'error',
        );
        expect(getChartFrameState({ isEmpty: true })).toBe('empty');
        expect(getChartFrameState({ isEmpty: false })).toBe('ready');
    });
});
