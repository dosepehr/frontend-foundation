import {
    buildChartCss,
    formatTooltipValue,
    getPayloadConfig,
} from './chartConfig';

describe('buildChartCss', () => {
    it('declares colors per theme', () => {
        const css = buildChartCss('chart-1', {
            sales: { color: 'var(--chart-1)' },
            visits: { theme: { light: '#000', dark: '#fff' } },
            plain: { label: 'Plain' },
        });
        expect(css).toContain(
            ' [data-chart=chart-1] {\n  --color-sales: var(--chart-1);\n  --color-visits: #000;\n}',
        );
        expect(css).toContain(
            '.dark [data-chart=chart-1] {\n  --color-sales: var(--chart-1);\n  --color-visits: #fff;\n}',
        );
        expect(css).not.toContain('plain');
    });

    it('drops keys and colors that could break out of the CSS', () => {
        const css = buildChartCss('chart-1', {
            ok: { color: 'oklch(0.5 0.2 240)' },
            bad: { color: 'red}</style><script>alert(1)</script>' },
            'a b{': { color: 'blue' },
        });
        expect(css).toContain('--color-ok: oklch(0.5 0.2 240);');
        expect(css).not.toContain('script');
        expect(css).not.toContain('bad');
        expect(css).not.toContain('blue');
    });

    it('is empty without colors', () => {
        expect(buildChartCss('chart-1', { a: { label: 'A' } })).toBe('');
    });
});

describe('getPayloadConfig', () => {
    const config = { sales: { label: 'Sales' }, chrome: { label: 'Chrome' } };

    it('finds the entry by key', () => {
        expect(getPayloadConfig(config, { dataKey: 'sales' }, 'sales')).toBe(
            config.sales,
        );
    });

    it('follows a field whose value is a config key', () => {
        expect(
            getPayloadConfig(
                config,
                { payload: { browser: 'chrome' } },
                'browser',
            ),
        ).toBe(config.chrome);
        expect(getPayloadConfig(config, { name: 'chrome' }, 'name')).toBe(
            config.chrome,
        );
    });

    it('ignores non-objects', () => {
        expect(getPayloadConfig(config, null, 'sales')).toBeUndefined();
    });
});

describe('formatTooltipValue', () => {
    it('formats numbers and passes other values through', () => {
        expect(formatTooltipValue(1284, 'sales')).toBe('1,284');
        expect(formatTooltipValue(5, 'sales', (v, n) => `${n}:${v}`)).toBe(
            'sales:5',
        );
        expect(formatTooltipValue('n/a', 'sales')).toBe('n/a');
        expect(formatTooltipValue(null, 'sales')).toBeNull();
    });
});
