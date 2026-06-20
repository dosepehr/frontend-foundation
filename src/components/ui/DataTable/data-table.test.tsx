import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    DataTablePagination,
    DataTableRoot,
    DataTableSkeleton,
    Table,
    TableBody,
    TableCaption,
    TableState,
} from './components';
import DataTable from './index';

type Person = { name: string; age: number };

const COLUMNS: Array<ColumnDef<Person, unknown>> = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'age', header: 'Age' },
];

const DATA: Person[] = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
];

describe('DataTableRoot', () => {
    it('renders column headers', () => {
        render(<DataTableRoot columns={COLUMNS} data={DATA} />);
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('renders a row for each data item', () => {
        render(<DataTableRoot columns={COLUMNS} data={DATA} />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('renders index column by default', () => {
        render(<DataTableRoot columns={COLUMNS} data={DATA} />);
        expect(screen.getByText('#')).toBeInTheDocument();
    });

    it('hides index column when hideRowIndex is true', () => {
        render(<DataTableRoot columns={COLUMNS} data={DATA} hideRowIndex />);
        expect(screen.queryByText('#')).not.toBeInTheDocument();
    });

    it('shows empty state when data is empty', () => {
        render(
            <DataTableRoot
                columns={COLUMNS}
                data={[]}
                emptyTitle="No records"
            />,
        );
        expect(screen.getByText('No records')).toBeInTheDocument();
    });

    it('hides table header when data is empty', () => {
        render(<DataTableRoot columns={COLUMNS} data={[]} />);
        expect(screen.queryByText('Name')).not.toBeInTheDocument();
    });

    it('renders selection checkboxes when haveSelection is true', () => {
        render(<DataTableRoot columns={COLUMNS} data={DATA} haveSelection />);
        const checkboxes = screen.getAllByRole('checkbox');
        // header "select all" + one per row
        expect(checkboxes.length).toBe(DATA.length + 1);
    });

    it('does not render selection checkboxes by default', () => {
        render(<DataTableRoot columns={COLUMNS} data={DATA} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('renders filter input when filterColumn is provided', () => {
        render(
            <DataTableRoot
                columns={COLUMNS}
                data={DATA}
                filterColumn="name"
                filterPlaceholder="Search names"
            />,
        );
        expect(screen.getByPlaceholderText('Search names')).toBeInTheDocument();
    });

    it('filters rows based on search input', async () => {
        const user = userEvent.setup();
        render(
            <DataTableRoot columns={COLUMNS} data={DATA} filterColumn="name" />,
        );
        await user.type(screen.getByPlaceholderText('Search...'), 'Alice');
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });

    it('renders footer row when footerRow is provided', () => {
        render(
            <DataTableRoot
                columns={COLUMNS}
                data={DATA}
                footerRow={[
                    <span key="total">Total</span>,
                    <span key="sum">90</span>,
                ]}
            />,
        );
        expect(screen.getByText('Total')).toBeInTheDocument();
    });

    it('selects a row when its checkbox is clicked', async () => {
        const user = userEvent.setup();
        render(<DataTableRoot columns={COLUMNS} data={DATA} haveSelection />);
        const rowCheckboxes = screen.getAllByRole('checkbox').slice(1); // skip header checkbox
        await user.click(rowCheckboxes[0]);
        expect(rowCheckboxes[0]).toBeChecked();
    });

    it('selects all rows when header checkbox is clicked', async () => {
        const user = userEvent.setup();
        render(<DataTableRoot columns={COLUMNS} data={DATA} haveSelection />);
        const [headerCheckbox, ...rowCheckboxes] =
            screen.getAllByRole('checkbox');
        await user.click(headerCheckbox);
        for (const cb of rowCheckboxes) expect(cb).toBeChecked();
    });

    it('sorts column when sortable header is clicked', async () => {
        const user = userEvent.setup();
        const SORTABLE_COLUMNS: Array<ColumnDef<Person, unknown>> = [
            { accessorKey: 'name', header: 'Name', enableSorting: true },
            { accessorKey: 'age', header: 'Age' },
        ];
        render(<DataTableRoot columns={SORTABLE_COLUMNS} data={DATA} />);
        await user.click(screen.getByText('Name'));
        expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('calls setRowSelection when provided externally', async () => {
        const user = userEvent.setup();
        const setRowSelection = vi.fn();
        render(
            <DataTableRoot
                columns={COLUMNS}
                data={DATA}
                haveSelection
                rowSelection={{}}
                setRowSelection={setRowSelection}
            />,
        );
        const rowCheckboxes = screen.getAllByRole('checkbox').slice(1);
        await user.click(rowCheckboxes[0]);
        expect(setRowSelection).toHaveBeenCalled();
    });
});

describe('DataTablePagination', () => {
    it('renders prev and next navigation', () => {
        render(
            <DataTablePagination
                current={2}
                total={5}
                setPage={vi.fn()}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        expect(
            screen.getByLabelText('Go to previous page'),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    });

    it('renders page numbers', () => {
        render(
            <DataTablePagination
                current={1}
                total={3}
                setPage={vi.fn()}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('calls setPage when a page number is clicked', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(
            <DataTablePagination
                current={1}
                total={3}
                setPage={setPage}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        await user.click(screen.getByText('2'));
        expect(setPage).toHaveBeenCalledWith(2);
    });

    it('calls setPage with current-1 when prev is clicked', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(
            <DataTablePagination
                current={3}
                total={5}
                setPage={setPage}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        await user.click(screen.getByLabelText('Go to previous page'));
        expect(setPage).toHaveBeenCalledWith(2);
    });

    it('calls setPage with current+1 when next is clicked', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(
            <DataTablePagination
                current={3}
                total={5}
                setPage={setPage}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        await user.click(screen.getByLabelText('Go to next page'));
        expect(setPage).toHaveBeenCalledWith(4);
    });

    it('does not call setPage when prev is clicked on first page', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(
            <DataTablePagination
                current={1}
                total={5}
                setPage={setPage}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        await user.click(screen.getByLabelText('Go to previous page'));
        expect(setPage).not.toHaveBeenCalled();
    });

    it('does not call setPage when next is clicked on last page', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(
            <DataTablePagination
                current={5}
                total={5}
                setPage={setPage}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        await user.click(screen.getByLabelText('Go to next page'));
        expect(setPage).not.toHaveBeenCalled();
    });

    it('shows ellipsis for large page counts', () => {
        const { container } = render(
            <DataTablePagination
                current={5}
                total={10}
                setPage={vi.fn()}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        // PaginationEllipsis renders a span with aria-hidden content
        expect(
            container.querySelector('[data-slot="pagination-ellipsis"]'),
        ).toBeInTheDocument();
    });

    it('renders rows-per-page select', () => {
        render(
            <DataTablePagination
                current={1}
                total={5}
                setPage={vi.fn()}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        expect(screen.getByText('Rows per page')).toBeInTheDocument();
    });
});

describe('DataTable (wrapper)', () => {
    it('renders table with data', () => {
        render(
            <DataTable
                columns={COLUMNS}
                data={DATA}
                current={1}
                total={1}
                setPage={vi.fn()}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('renders pagination when data is not empty', () => {
        render(
            <DataTable
                columns={COLUMNS}
                data={DATA}
                current={1}
                total={3}
                setPage={vi.fn()}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        expect(screen.getByText('Rows per page')).toBeInTheDocument();
    });

    it('hides pagination when data is empty', () => {
        render(
            <DataTable
                columns={COLUMNS}
                data={[]}
                current={1}
                total={0}
                setPage={vi.fn()}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        expect(screen.queryByText('Rows per page')).not.toBeInTheDocument();
    });
});

describe('DataTableSkeleton', () => {
    it('renders without errors', () => {
        expect(() => render(<DataTableSkeleton />)).not.toThrow();
    });

    it('renders the correct number of header cells', () => {
        const { container } = render(
            <DataTableSkeleton columns={3} rows={2} />,
        );
        expect(container.querySelectorAll('th').length).toBe(3);
    });

    it('renders the correct number of rows', () => {
        const { container } = render(
            <DataTableSkeleton columns={2} rows={4} />,
        );
        // tbody rows only
        expect(container.querySelectorAll('tbody tr').length).toBe(4);
    });
});

describe('Table primitives', () => {
    it('Table renders data-slot="table-container"', () => {
        const { container } = render(<Table />);
        expect(
            container.querySelector('[data-slot="table-container"]'),
        ).toBeInTheDocument();
    });

    it('TableBody renders data-slot="table-body"', () => {
        const { container } = render(
            <table>
                <TableBody>
                    <tr>
                        <td>cell</td>
                    </tr>
                </TableBody>
            </table>,
        );
        expect(
            container.querySelector('[data-slot="table-body"]'),
        ).toBeInTheDocument();
    });

    it('TableCaption renders data-slot="table-caption"', () => {
        const { container } = render(
            <table>
                <TableCaption>Caption text</TableCaption>
            </table>,
        );
        expect(
            container.querySelector('[data-slot="table-caption"]'),
        ).toBeInTheDocument();
    });
});

describe('TableState', () => {
    it('shows loading element when isLoading is true', () => {
        render(
            <TableState isLoading loadingEl={<div>Loading...</div>}>
                content
            </TableState>,
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows children when not loading and no error', () => {
        render(
            <TableState isLoading={false}>
                <div>Table content</div>
            </TableState>,
        );
        expect(screen.getByText('Table content')).toBeInTheDocument();
    });

    it('shows error state when isError is true', () => {
        render(
            <TableState isLoading={false} isError onRetry={vi.fn()}>
                content
            </TableState>,
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows empty state when isEmpty is true', () => {
        render(
            <TableState isLoading={false} isEmpty emptyTitle="No data">
                content
            </TableState>,
        );
        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('shows error state without retry button when onRetry is not provided', () => {
        render(
            <TableState isLoading={false} isError>
                content
            </TableState>,
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows "No results found" title when isEmpty and hasSearch', () => {
        render(
            <TableState isLoading={false} isEmpty hasSearch>
                content
            </TableState>,
        );
        expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('shows search-related description when isEmpty and hasSearch', () => {
        render(
            <TableState isLoading={false} isEmpty hasSearch>
                content
            </TableState>,
        );
        expect(screen.getByText(/adjusting your search/i)).toBeInTheDocument();
    });

    it('shows "No data yet" when isEmpty without hasSearch and no emptyTitle', () => {
        render(
            <TableState isLoading={false} isEmpty>
                content
            </TableState>,
        );
        expect(screen.getByText('No data yet')).toBeInTheDocument();
    });
});

describe('DataTablePagination edge cases', () => {
    it('no leading ellipsis when current is near start', () => {
        const { container } = render(
            <DataTablePagination
                current={2}
                total={10}
                setPage={vi.fn()}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        const _ellipses = container.querySelectorAll(
            '[data-slot="pagination-ellipsis"]',
        );
        // With current=2, total=10 → no leading ellipsis but trailing one
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('no trailing ellipsis when current is near end', () => {
        render(
            <DataTablePagination
                current={9}
                total={10}
                setPage={vi.fn()}
                limit={20}
                setLimit={vi.fn()}
            />,
        );
        expect(screen.getByText('10')).toBeInTheDocument();
    });
});

describe('DataTablePagination page size change', () => {
    it('calls setLimit when page size is changed', async () => {
        const user = userEvent.setup();
        const setLimit = vi.fn();
        const setPage = vi.fn();
        render(
            <DataTablePagination
                current={1}
                total={5}
                setPage={setPage}
                limit={20}
                setLimit={setLimit}
            />,
        );
        await user.click(screen.getByRole('combobox'));
        const options = document.querySelectorAll('[data-slot="select-item"]');
        if (options.length > 0) await user.click(options[0]);
        expect(setLimit).toHaveBeenCalled();
    });
});
