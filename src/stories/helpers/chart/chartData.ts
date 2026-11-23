// Sample data and configs for the chart stories.
import type { ChartConfig } from '@/components/ui/Chart/Chart.types';

export type VisitorsRow = { month: string; desktop: number; mobile: number };

export const VISITORS: VisitorsRow[] = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];

export const VISITORS_CONFIG = {
    desktop: { label: 'Desktop' },
    mobile: { label: 'Mobile' },
} satisfies ChartConfig;

export const shortMonth = (value: unknown) => String(value).slice(0, 3);

export type TrafficRow = {
    date: string;
    organic: number;
    paid: number;
    referral: number;
};

/** 90 days of traffic, deterministic so stories don't change per render. */
export const TRAFFIC: TrafficRow[] = Array.from({ length: 90 }, (_, day) => {
    const date = new Date(2026, 5, 1 + day);
    const wave = Math.sin(day / 6);
    return {
        date: date.toISOString().slice(0, 10),
        organic: Math.round(420 + 140 * wave + day * 2),
        paid: Math.round(240 + 90 * Math.cos(day / 5)),
        referral: Math.round(110 + 40 * Math.sin(day / 9 + 1)),
    };
});

export const TRAFFIC_CONFIG = {
    organic: { label: 'Organic' },
    paid: { label: 'Paid' },
    referral: { label: 'Referral' },
} satisfies ChartConfig;

export const dayMonth = (value: unknown) =>
    new Date(String(value)).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

export type RevenueRow = {
    week: string;
    actual: number | null;
    forecast: number | null;
};

export const REVENUE: RevenueRow[] = [
    { week: 'W1', actual: 12_400, forecast: null },
    { week: 'W2', actual: 13_900, forecast: null },
    { week: 'W3', actual: null, forecast: null },
    { week: 'W4', actual: 15_200, forecast: null },
    { week: 'W5', actual: 16_800, forecast: 16_800 },
    { week: 'W6', actual: null, forecast: 17_600 },
    { week: 'W7', actual: null, forecast: 18_900 },
];

export const REVENUE_CONFIG = {
    actual: { label: 'Revenue' },
    forecast: { label: 'Forecast' },
} satisfies ChartConfig;

export const usd = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);

export type BrowserRow = { browser: string; visitors: number };

export const BROWSERS: BrowserRow[] = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 },
    { browser: 'edge', visitors: 173 },
    { browser: 'opera', visitors: 90 },
    { browser: 'brave', visitors: 45 },
    { browser: 'arc', visitors: 30 },
];

export const BROWSERS_CONFIG = {
    chrome: { label: 'Chrome' },
    safari: { label: 'Safari' },
    firefox: { label: 'Firefox' },
    edge: { label: 'Edge' },
    opera: { label: 'Opera' },
    brave: { label: 'Brave' },
    arc: { label: 'Arc' },
} satisfies ChartConfig;

export type SkillRow = { skill: string; frontend: number; backend: number };

export const SKILLS: SkillRow[] = [
    { skill: 'Speed', frontend: 80, backend: 60 },
    { skill: 'Quality', frontend: 70, backend: 90 },
    { skill: 'Testing', frontend: 55, backend: 80 },
    { skill: 'Design', frontend: 90, backend: 40 },
    { skill: 'Docs', frontend: 60, backend: 70 },
];

export const SKILLS_CONFIG = {
    frontend: { label: 'Frontend' },
    backend: { label: 'Backend' },
} satisfies ChartConfig;

export const GOALS = [
    { goal: 'steps', done: 72 },
    { goal: 'sleep', done: 54 },
    { goal: 'water', done: 88 },
];

export const GOALS_CONFIG = {
    steps: { label: 'Steps' },
    sleep: { label: 'Sleep' },
    water: { label: 'Water' },
} satisfies ChartConfig;

export type SalesFaRow = { month: string; online: number; store: number };

/** Persian months for the RTL stories. */
export const SALES_FA: SalesFaRow[] = [
    { month: 'فروردین', online: 1240, store: 860 },
    { month: 'اردیبهشت', online: 1580, store: 920 },
    { month: 'خرداد', online: 1320, store: 1100 },
    { month: 'تیر', online: 1910, store: 980 },
    { month: 'مرداد', online: 1760, store: 1240 },
    { month: 'شهریور', online: 2140, store: 1310 },
];

export const SALES_FA_CONFIG = {
    online: { label: 'فروش آنلاین' },
    store: { label: 'فروش حضوری' },
} satisfies ChartConfig;
