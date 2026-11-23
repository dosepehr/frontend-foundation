'use client';

import { createContext, useContext } from 'react';
import type { ChartConfig } from '../../Chart.types';

export const ChartContext = createContext<{ config: ChartConfig } | null>(null);

/** The config of the surrounding ChartContainer. */
export function useChart() {
    const context = useContext(ChartContext);
    if (!context) {
        throw new Error('useChart must be used within a <ChartContainer />');
    }
    return context;
}
