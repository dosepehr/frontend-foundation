import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ChartContext, useChart } from './useChart';

describe('useChart', () => {
    it('reads the config of the container', () => {
        const config = { sales: { label: 'Sales' } };
        const wrapper = ({ children }: { children: ReactNode }) => (
            <ChartContext.Provider value={{ config }}>
                {children}
            </ChartContext.Provider>
        );
        expect(renderHook(useChart, { wrapper }).result.current.config).toBe(
            config,
        );
    });

    it('throws outside a container', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(useChart)).toThrow(
            'useChart must be used within a <ChartContainer />',
        );
    });
});
