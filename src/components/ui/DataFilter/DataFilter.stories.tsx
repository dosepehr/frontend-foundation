import DataTable from '@/components/ui/DataTable';
import { useQueryFilter } from '@/hooks/useQueryFilter';
import { dateRangeParams } from '@/utils/funcs/filterParsers';
import type { NumberRange } from '@/utils/funcs/filters';
import { faIR, getDateLib } from '@daypicker/persian';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import DataFilter from '.';

const SORT_OPTIONS = [
    { value: '-created_at', label: 'Newest' },
    { value: 'created_at', label: 'Oldest' },
    { value: 'name', label: 'Name (A–Z)' },
    { value: '-name', label: 'Name (Z–A)' },
];

const STATUS = [
    { value: 'active', label: 'Active' },
    { value: 'invited', label: 'Invited' },
    { value: 'suspended', label: 'Suspended' },
];

const fontOf = (element: Element) => getComputedStyle(element).fontFamily;

const meta: Meta<typeof DataFilter> = {
    title: 'UI/DataFilter',
    component: DataFilter,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof DataFilter>;

/** Toolbar state; in an app it lives in the URL (e.g. nuqs) or a list hook. */
function useToolbar() {
    const [search, setSearch] = useState('');
    const [ordering, setOrdering] = useState<string | null>('-created_at');
    const [status, setStatus] = useState<string[] | null>(null);
    const [seats, setSeats] = useState<NumberRange | null>(null);
    return {
        values: { search, ordering, status, seats },
        props: {
            search: {
                value: search,
                onChange: setSearch,
                placeholder: 'Search name, email...',
            },
            sort: {
                value: ordering,
                onChange: setOrdering,
                options: SORT_OPTIONS,
            },
            filters: {
                status: {
                    type: 'multiselect',
                    label: 'Status',
                    options: STATUS,
                    value: status,
                    onChange: setStatus,
                },
                seats: {
                    type: 'number-range',
                    label: 'Seats',
                    max: 300,
                    value: seats,
                    onChange: setSeats,
                },
            },
        } as const,
    };
}

const FullDemo = () => {
    const toolbar = useToolbar();
    return (
        <div className="flex flex-col gap-4">
            <DataFilter {...toolbar.props} />
            <pre className="rounded-md bg-muted p-3 text-xs">
                {JSON.stringify(toolbar.values, null, 2)}
            </pre>
        </div>
    );
};

export const Default: Story = {
    render: () => <FullDemo />,
};

const SearchAndSortDemo = () => {
    const [search, setSearch] = useState('');
    const [ordering, setOrdering] = useState<string | null>(null);
    return (
        <DataFilter
            search={{
                value: search,
                onChange: setSearch,
                placeholder: 'Search folders...',
            }}
            sort={{
                value: ordering,
                onChange: setOrdering,
                options: SORT_OPTIONS,
            }}
        />
    );
};

export const SearchAndSortOnly: Story = {
    render: () => <SearchAndSortDemo />,
};

export const SearchDisabled: Story = {
    args: {
        search: {
            value: '',
            onChange: () => {},
            disabled: true,
            placeholder: 'This list has no search',
        },
        sort: {
            value: '-created_at',
            onChange: () => {},
            options: SORT_OPTIONS,
        },
    },
};

const PersianDemo = () => {
    const [search, setSearch] = useState<string | null>(null);
    const [ordering, setOrdering] = useState<string | null>(null);
    const [status, setStatus] = useState<string[] | null>(null);
    const [registered, setRegistered] = useState<DateRange | null>(null);
    return (
        <DataFilter
            locale="fa"
            search={{
                value: search,
                onChange: setSearch,
                placeholder: 'جستجو نام، شماره تلفن و...',
            }}
            sort={{
                value: ordering,
                onChange: setOrdering,
                options: [
                    { value: '-created_at', label: 'جدیدترین' },
                    { value: 'created_at', label: 'قدیمی‌ترین' },
                ],
            }}
            filters={{
                status: {
                    type: 'multiselect',
                    label: 'وضعیت',
                    options: [
                        { value: 'open', label: 'باز' },
                        { value: 'closed', label: 'بسته' },
                    ],
                    value: status,
                    onChange: setStatus,
                },
                registered: {
                    type: 'date',
                    label: 'تاریخ ثبت',
                    value: registered,
                    onChange: setRegistered,
                },
            }}
            filterBox={{
                calendarProps: {
                    dateLib: getDateLib({ locale: faIR, numerals: 'arabext' }),
                    locale: faIR,
                    dir: 'rtl',
                    numerals: 'arabext',
                },
            }}
        />
    );
};

export const PersianRtl: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: () => <PersianDemo />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);

        await waitFor(() =>
            expect(fontOf(canvas.getByRole('searchbox'))).toContain('Estedad'),
        );
        // The filter panel is portaled to <body>, outside the story's markup.
        await userEvent.click(canvas.getByRole('button', { name: /^فیلتر/ }));
        const panel = await body.findByRole('dialog', { name: 'فیلترها' });
        await expect(fontOf(panel)).toContain('Estedad');
    },
};

type Member = {
    name: string;
    status: string;
    seats: number;
    createdAt: number;
};

const MEMBERS: Member[] = [
    { name: 'Ada Lovelace', status: 'active', seats: 12, createdAt: 5 },
    { name: 'Alan Turing', status: 'active', seats: 40, createdAt: 3 },
    { name: 'Grace Hopper', status: 'invited', seats: 3, createdAt: 4 },
    { name: 'Linus Torvalds', status: 'suspended', seats: 250, createdAt: 1 },
    { name: 'Margaret Hamilton', status: 'active', seats: 75, createdAt: 2 },
];

const columns: ColumnDef<Member, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'seats', header: 'Seats' },
];

const compare = (ordering: string | null) => (a: Member, b: Member) => {
    if (!ordering) return 0;
    const descending = ordering.startsWith('-');
    const result =
        ordering.replace(/^-/, '') === 'name'
            ? a.name.localeCompare(b.name)
            : a.createdAt - b.createdAt;
    return descending ? -result : result;
};

const TableDemo = () => {
    const toolbar = useToolbar();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { search, ordering, status, seats } = toolbar.values;

    const rows = MEMBERS.filter(
        (member) =>
            member.name.toLowerCase().includes(search.toLowerCase()) &&
            (!status || status.includes(member.status)) &&
            (seats?.from === undefined || member.seats >= seats.from) &&
            (seats?.to === undefined || member.seats <= seats.to),
    ).sort(compare(ordering));

    return (
        <div className="flex flex-col gap-4">
            <DataFilter {...toolbar.props} />
            <DataTable
                columns={columns}
                data={rows}
                current={page}
                total={rows.length}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
            />
        </div>
    );
};

export const WithDataTable: Story = {
    render: () => <TableDemo />,
};

const UrlStateDemo = () => {
    // Search, ordering and filters all live in the query string.
    const search = useQueryFilter('search', 'text');
    const ordering = useQueryFilter('ordering', 'select');
    const status = useQueryFilter('status', 'multiselect');
    const created = useQueryFilter('created', 'date');

    // What a list page would send to its API.
    const params = {
        ...(search.value ? { search: search.value } : {}),
        ...(ordering.value ? { ordering: ordering.value } : {}),
        ...(status.value ? { status: status.value } : {}),
        ...dateRangeParams(created.value, 'created_from', 'created_to'),
    };

    return (
        <div className="flex flex-col gap-4">
            <DataFilter
                search={{ ...search, placeholder: 'Search name, email...' }}
                sort={{ ...ordering, options: SORT_OPTIONS }}
                filters={{
                    status: {
                        type: 'multiselect',
                        label: 'Status',
                        options: STATUS,
                        ...status,
                    },
                    created: { type: 'date', label: 'Created', ...created },
                }}
            />
            <pre className="rounded-md bg-muted p-3 text-xs">
                {`API params: ${JSON.stringify(params, null, 2)}`}
            </pre>
        </div>
    );
};

export const UrlState: Story = {
    render: () => <UrlStateDemo />,
};
