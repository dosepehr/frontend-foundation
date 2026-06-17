import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTableRoot, DataTableSkeleton, DataTablePagination } from './components';
import DataTable from './index';

type Person = { name: string; age: number };

const COLUMNS: ColumnDef<Person, unknown>[] = [
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
        render(<DataTableRoot columns={COLUMNS} data={[]} emptyTitle='No records' />);
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
        render(<DataTableRoot columns={COLUMNS} data={DATA} filterColumn='name' filterPlaceholder='Search names' />);
        expect(screen.getByPlaceholderText('Search names')).toBeInTheDocument();
    });

    it('filters rows based on search input', async () => {
        const user = userEvent.setup();
        render(<DataTableRoot columns={COLUMNS} data={DATA} filterColumn='name' />);
        await user.type(screen.getByPlaceholderText('Search...'), 'Alice');
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });

    it('renders footer row when footerRow is provided', () => {
        render(
            <DataTableRoot
                columns={COLUMNS}
                data={DATA}
                footerRow={[<span key='total'>Total</span>, <span key='sum'>90</span>]}
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
        const [headerCheckbox, ...rowCheckboxes] = screen.getAllByRole('checkbox');
        await user.click(headerCheckbox);
        rowCheckboxes.forEach((cb) => expect(cb).toBeChecked());
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
        render(<DataTablePagination current={2} total={5} setPage={vi.fn()} limit={20} setLimit={vi.fn()} />);
        expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
        expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    });

    it('renders page numbers', () => {
        render(<DataTablePagination current={1} total={3} setPage={vi.fn()} limit={20} setLimit={vi.fn()} />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('calls setPage when a page number is clicked', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(<DataTablePagination current={1} total={3} setPage={setPage} limit={20} setLimit={vi.fn()} />);
        await user.click(screen.getByText('2'));
        expect(setPage).toHaveBeenCalledWith(2);
    });

    it('calls setPage with current-1 when prev is clicked', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(<DataTablePagination current={3} total={5} setPage={setPage} limit={20} setLimit={vi.fn()} />);
        await user.click(screen.getByLabelText('Go to previous page'));
        expect(setPage).toHaveBeenCalledWith(2);
    });

    it('calls setPage with current+1 when next is clicked', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(<DataTablePagination current={3} total={5} setPage={setPage} limit={20} setLimit={vi.fn()} />);
        await user.click(screen.getByLabelText('Go to next page'));
        expect(setPage).toHaveBeenCalledWith(4);
    });

    it('does not call setPage when prev is clicked on first page', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(<DataTablePagination current={1} total={5} setPage={setPage} limit={20} setLimit={vi.fn()} />);
        await user.click(screen.getByLabelText('Go to previous page'));
        expect(setPage).not.toHaveBeenCalled();
    });

    it('does not call setPage when next is clicked on last page', async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        render(<DataTablePagination current={5} total={5} setPage={setPage} limit={20} setLimit={vi.fn()} />);
        await user.click(screen.getByLabelText('Go to next page'));
        expect(setPage).not.toHaveBeenCalled();
    });

    it('shows ellipsis for large page counts', () => {
        const { container } = render(<DataTablePagination current={5} total={10} setPage={vi.fn()} limit={20} setLimit={vi.fn()} />);
        // PaginationEllipsis renders a span with aria-hidden content
        expect(container.querySelector('[data-slot="pagination-ellipsis"]')).toBeInTheDocument();
    });

    it('renders rows-per-page select', () => {
        render(<DataTablePagination current={1} total={5} setPage={vi.fn()} limit={20} setLimit={vi.fn()} />);
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
        const { container } = render(<DataTableSkeleton columns={3} rows={2} />);
        expect(container.querySelectorAll('th').length).toBe(3);
    });

    it('renders the correct number of rows', () => {
        const { container } = render(<DataTableSkeleton columns={2} rows={4} />);
        // tbody rows only
        expect(container.querySelectorAll('tbody tr').length).toBe(4);
    });
});
