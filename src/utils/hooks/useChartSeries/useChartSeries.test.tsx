import { DirectionProvider } from '@/components/ui/Direction';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useChartSeries } from '.';

const config = { sales: { label: 'Sales' }, visits: { label: 'Visits' } };

describe('useChartSeries', () => {
    it('colors the config and plots every series', () => {
        const { result } = renderHook(() => useChartSeries({ config }));
        expect(result.current.config.visits.color).toBe('var(--chart-2)');
        expect(result.current.keys).toEqual(['sales', 'visits']);
        expect(result.current.formatValue(1200)).toBe('1,200');
        expect(result.current.isRtl).toBe(false);
    });

    it('keeps colors by config position when series are picked', () => {
        const { result } = renderHook(() =>
            useChartSeries({ config, series: ['visits'] }),
        );
        expect(result.current.keys).toEqual(['visits']);
        expect(result.current.config.visits.color).toBe('var(--chart-2)');
    });

    it('starts with hidden series and toggles them', () => {
        const { result } = renderHook(() =>
            useChartSeries({ config, hiddenSeries: ['visits'] }),
        );
        expect(result.current.visibleKeys).toEqual(['sales']);
        act(() => result.current.toggle('visits'));
        expect(result.current.visibleKeys).toEqual(['sales', 'visits']);
    });

    it('formats Persian values and reads the direction', () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
            <DirectionProvider dir="rtl">{children}</DirectionProvider>
        );
        const { result } = renderHook(
            () => useChartSeries({ config, locale: 'fa' }),
            { wrapper },
        );
        expect(result.current.formatValue(1200)).toBe('۱٬۲۰۰');
        expect(result.current.isRtl).toBe(true);
    });

    it('takes a custom formatter', () => {
        const { result } = renderHook(() =>
            useChartSeries({ config, valueFormatter: (v) => `$${v}` }),
        );
        expect(result.current.formatValue(5)).toBe('$5');
    });
});
