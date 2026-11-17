import DataTable from '@/components/ui/DataTable';
import { useQueryFilter } from '@/hooks/useQueryFilter';
import type { FilterOption, Filters, NumberRange } from '@/utils/funcs/filters';
import { faIR, getDateLib } from '@daypicker/persian';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import FilterBox from '.';

const STATUS: FilterOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'invited', label: 'Invited' },
    { value: 'suspended', label: 'Suspended' },
];
const ROLES: FilterOption[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
];
const PEOPLE: FilterOption[] = Array.from({ length: 80 }, (_, index) => ({
    value: `user-${index + 1}`,
    label: `User ${index + 1}`,
}));

/** Pages through PEOPLE as if it were a server endpoint. */
function useFakeServerOptions(pageSize = 20) {
    const [search, setSearch] = useState('');
    const [pages, setPages] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const matches = PEOPLE.filter((person) =>
        person.label.toLowerCase().includes(search.toLowerCase()),
    );
    return {
        options: matches.slice(0, pages * pageSize),
        hasNextPage: pages * pageSize < matches.length,
        isFetchingNextPage: isFetching,
        onFetchNextPage: () => {
            setIsFetching(true);
            setTimeout(() => {
                setPages((count) => count + 1);
                setIsFetching(false);
            }, 500);
        },
        onSearchChange: (next: string) => {
            setSearch(next);
            setPages(1);
        },
    };
}

/** Every filter type, in local state (use the URL, e.g. nuqs, in an app). */
function useDemoFilters(
    initial: { status?: string; roles?: string[] } = {},
): Filters {
    const [status, setStatus] = useState<string | null>(initial.status ?? null);
    const [roles, setRoles] = useState<string[] | null>(initial.roles ?? null);
    const [owner, setOwner] = useState<string | null>(null);
    const [members, setMembers] = useState<string[] | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [created, setCreated] = useState<DateRange | null>(null);
    const [seats, setSeats] = useState<NumberRange | null>(null);
    const server = useFakeServerOptions();

    return {
        status: {
            type: 'select',
            label: 'Status',
            options: STATUS,
            value: status,
            onChange: setStatus,
        },
        roles: {
            type: 'multiselect',
            label: 'Role',
            options: ROLES,
            value: roles,
            onChange: setRoles,
        },
        owner: {
            type: 'select',
            label: 'Owner',
            ...server,
            value: owner,
            onChange: setOwner,
        },
        members: {
            type: 'multiselect',
            label: 'Members',
            ...server,
            value: members,
            onChange: setMembers,
        },
        name: { type: 'text', label: 'Name', value: name, onChange: setName },
        created: {
            type: 'date',
            label: 'Created',
            value: created,
            onChange: setCreated,
        },
        seats: {
            type: 'number-range',
            label: 'Seats',
            max: 500,
            value: seats,
            onChange: setSeats,
        },
    };
}

const valuesOf = (filters: Filters) =>
    Object.fromEntries(
        Object.entries(filters).map(([id, filter]) => [id, filter.value]),
    );

const meta: Meta<typeof FilterBox> = {
    title: 'UI/FilterBox',
    component: FilterBox,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof FilterBox>;

const AllTypesDemo = ({ prefilled = false }: { prefilled?: boolean }) => {
    const filters = useDemoFilters(
        prefilled ? { status: 'active', roles: ['admin', 'editor'] } : {},
    );
    return (
        <div className="flex flex-col gap-4">
            <FilterBox filters={filters} />
            <pre className="rounded-md bg-muted p-3 text-xs">
                {JSON.stringify(valuesOf(filters), null, 2)}
            </pre>
        </div>
    );
};

export const Default: Story = {
    render: () => <AllTypesDemo />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);
        await userEvent.click(canvas.getByRole('button', { name: /^Filter/ }));
        await userEvent.click(
            await body.findByRole('button', { name: /^Role/ }),
        );
        // Pick from the combo box's own popover; the filter popover must stay open.
        await userEvent.click(
            await body.findByRole('combobox', { name: 'Role' }),
        );
        await userEvent.click(
            await body.findByRole('option', { name: 'Editor' }),
        );
        const dialog = await body.findByRole('dialog', { name: 'Filters' });
        await waitFor(() => expect(dialog).toBeVisible());
        await expect(
            canvas.getByRole('button', { name: 'Clear all filters' }),
        ).toBeVisible();
    },
};

export const WithActiveFilters: Story = {
    render: () => <AllTypesDemo prefilled />,
};

const LoadingDemo = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 2000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <FilterBox
            filters={{
                role: {
                    type: 'select',
                    label: 'Role',
                    options: isLoaded ? ROLES : [],
                    isPending: !isLoaded,
                    value: role,
                    onChange: setRole,
                },
            }}
        />
    );
};

export const LoadingOptions: Story = {
    render: () => <LoadingDemo />,
};

const jalaliCalendar = {
    dateLib: getDateLib({ locale: faIR, numerals: 'arabext' }),
    locale: faIR,
    dir: 'rtl' as const,
    numerals: 'arabext' as const,
};

const PersianDemo = () => {
    const [operators, setOperators] = useState<string[] | null>(['1', '2']);
    const [registered, setRegistered] = useState<DateRange | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    return (
        <div dir="rtl">
            <FilterBox
                locale="fa"
                calendarProps={jalaliCalendar}
                filters={{
                    operators: {
                        type: 'multiselect',
                        label: 'اپراتور',
                        options: [
                            { value: '1', label: 'علی' },
                            { value: '2', label: 'سارا' },
                            { value: '3', label: 'رضا' },
                        ],
                        value: operators,
                        onChange: setOperators,
                    },
                    registered: {
                        type: 'date',
                        label: 'تاریخ ثبت',
                        value: registered,
                        onChange: setRegistered,
                    },
                    phone: {
                        type: 'text',
                        label: 'شماره تماس',
                        value: phone,
                        onChange: setPhone,
                    },
                }}
            />
        </div>
    );
};

export const PersianWithJalali: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: () => <PersianDemo />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);
        await userEvent.click(canvas.getByRole('button', { name: /^فیلتر/ }));
        await userEvent.click(
            await body.findByRole('button', { name: /^تاریخ ثبت/ }),
        );
        await userEvent.click(
            await body.findByRole('button', { name: 'تاریخ ثبت' }),
        );
        const calendar = await body.findByRole('grid');
        await waitFor(() => expect(calendar).toBeVisible());
    },
};

type Member = { name: string; status: string; role: string; seats: number };

const MEMBERS: Member[] = [
    { name: 'Ada Lovelace', status: 'active', role: 'admin', seats: 12 },
    { name: 'Alan Turing', status: 'active', role: 'editor', seats: 40 },
    { name: 'Grace Hopper', status: 'invited', role: 'editor', seats: 3 },
    { name: 'Linus Torvalds', status: 'suspended', role: 'viewer', seats: 250 },
    { name: 'Margaret Hamilton', status: 'active', role: 'viewer', seats: 75 },
];

const columns: ColumnDef<Member, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'seats', header: 'Seats' },
];

const TableDemo = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[] | null>(null);
    const [seats, setSeats] = useState<NumberRange | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const rows = MEMBERS.filter(
        (member) =>
            (!status || member.status === status) &&
            (!roles || roles.includes(member.role)) &&
            (seats?.from === undefined || member.seats >= seats.from) &&
            (seats?.to === undefined || member.seats <= seats.to),
    );

    return (
        <div className="flex flex-col gap-4">
            <FilterBox
                filters={{
                    status: {
                        type: 'select',
                        label: 'Status',
                        options: STATUS,
                        value: status,
                        onChange: setStatus,
                    },
                    roles: {
                        type: 'multiselect',
                        label: 'Role',
                        options: ROLES,
                        value: roles,
                        onChange: setRoles,
                    },
                    seats: {
                        type: 'number-range',
                        label: 'Seats',
                        max: 300,
                        value: seats,
                        onChange: setSeats,
                    },
                }}
            />
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

export const Disabled: Story = {
    args: {
        disabled: true,
        filters: {
            status: {
                type: 'select',
                label: 'Status',
                options: STATUS,
                value: 'active',
                onChange: () => {},
            },
        },
    },
};

const UrlStateDemo = () => {
    // Each filter's value lives in the query string, e.g.
    // ?status=active&roles=admin,editor&created=2026-01-05,2026-01-09&seats=10,200
    const status = useQueryFilter('status', 'select');
    const roles = useQueryFilter('roles', 'multiselect');
    const name = useQueryFilter('name', 'text');
    const created = useQueryFilter('created', 'date');
    const seats = useQueryFilter('seats', 'number-range');

    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
                Filters are kept in the URL with nuqs: reload or share the page
                to keep them.
            </p>
            <FilterBox
                filters={{
                    status: {
                        type: 'select',
                        label: 'Status',
                        options: STATUS,
                        ...status,
                    },
                    roles: {
                        type: 'multiselect',
                        label: 'Role',
                        options: ROLES,
                        ...roles,
                    },
                    name: { type: 'text', label: 'Name', ...name },
                    created: { type: 'date', label: 'Created', ...created },
                    seats: {
                        type: 'number-range',
                        label: 'Seats',
                        max: 500,
                        ...seats,
                    },
                }}
            />
            <pre className="rounded-md bg-muted p-3 text-xs">
                {JSON.stringify(
                    {
                        status: status.value,
                        roles: roles.value,
                        name: name.value,
                        created: created.value,
                        seats: seats.value,
                    },
                    null,
                    2,
                )}
            </pre>
        </div>
    );
};

export const UrlState: Story = {
    render: () => <UrlStateDemo />,
};
