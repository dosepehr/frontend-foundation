export const semanticGroups: {
    group: string;
    pairs: { name: string; bg: string; fg?: string; isFg?: boolean }[];
}[] = [
    {
        group: 'Base',
        pairs: [
            { name: 'background', bg: '--background', fg: '--foreground' },
            {
                name: 'foreground',
                bg: '--foreground',
                fg: '--background',
                isFg: true,
            },
            { name: 'border', bg: '--border', fg: '--foreground' },
            { name: 'input', bg: '--input', fg: '--foreground' },
            { name: 'ring', bg: '--ring', fg: '--background' },
        ],
    },
    {
        group: 'Card',
        pairs: [
            { name: 'card', bg: '--card', fg: '--card-foreground' },
            {
                name: 'card-foreground',
                bg: '--card-foreground',
                fg: '--card',
                isFg: true,
            },
        ],
    },
    {
        group: 'Popover',
        pairs: [
            { name: 'popover', bg: '--popover', fg: '--popover-foreground' },
            {
                name: 'popover-foreground',
                bg: '--popover-foreground',
                fg: '--popover',
                isFg: true,
            },
        ],
    },
    {
        group: 'Primary',
        pairs: [
            { name: 'primary', bg: '--primary', fg: '--primary-foreground' },
            {
                name: 'primary-foreground',
                bg: '--primary-foreground',
                fg: '--primary',
                isFg: true,
            },
        ],
    },
    {
        group: 'Secondary',
        pairs: [
            {
                name: 'secondary',
                bg: '--secondary',
                fg: '--secondary-foreground',
            },
            {
                name: 'secondary-foreground',
                bg: '--secondary-foreground',
                fg: '--secondary',
                isFg: true,
            },
        ],
    },
    {
        group: 'Muted',
        pairs: [
            { name: 'muted', bg: '--muted', fg: '--muted-foreground' },
            {
                name: 'muted-foreground',
                bg: '--muted-foreground',
                fg: '--muted',
                isFg: true,
            },
        ],
    },
    {
        group: 'Accent',
        pairs: [
            { name: 'accent', bg: '--accent', fg: '--accent-foreground' },
            {
                name: 'accent-foreground',
                bg: '--accent-foreground',
                fg: '--accent',
                isFg: true,
            },
        ],
    },
    {
        group: 'Destructive',
        pairs: [
            { name: 'destructive', bg: '--destructive', fg: '--background' },
        ],
    },
    {
        group: 'Charts',
        pairs: [
            { name: 'chart-1', bg: '--chart-1', fg: '--background' },
            { name: 'chart-2', bg: '--chart-2', fg: '--background' },
            { name: 'chart-3', bg: '--chart-3', fg: '--background' },
            { name: 'chart-4', bg: '--chart-4', fg: '--background' },
            { name: 'chart-5', bg: '--chart-5', fg: '--background' },
        ],
    },
    {
        group: 'Sidebar',
        pairs: [
            { name: 'sidebar', bg: '--sidebar', fg: '--sidebar-foreground' },
            {
                name: 'sidebar-foreground',
                bg: '--sidebar-foreground',
                fg: '--sidebar',
                isFg: true,
            },
            {
                name: 'sidebar-primary',
                bg: '--sidebar-primary',
                fg: '--sidebar-primary-foreground',
            },
            {
                name: 'sidebar-primary-foreground',
                bg: '--sidebar-primary-foreground',
                fg: '--sidebar-primary',
                isFg: true,
            },
            {
                name: 'sidebar-accent',
                bg: '--sidebar-accent',
                fg: '--sidebar-accent-foreground',
            },
            {
                name: 'sidebar-accent-foreground',
                bg: '--sidebar-accent-foreground',
                fg: '--sidebar-accent',
                isFg: true,
            },
            {
                name: 'sidebar-border',
                bg: '--sidebar-border',
                fg: '--foreground',
            },
            { name: 'sidebar-ring', bg: '--sidebar-ring', fg: '--background' },
        ],
    },
];
