import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableSkeleton, TableState } from '.'
import { Badge } from '../Badge'

const meta = {
    title: 'UI/DataTable',
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── Sample data ──────────────────────────────────────────────────────────────

type User = {
    id: string
    name: string
    email: string
    role: 'Admin' | 'Editor' | 'Viewer'
    status: 'Active' | 'Inactive' | 'Pending'
    joined: string
}

const USERS: User[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: '2023-01-15' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', joined: '2023-03-22' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', joined: '2023-05-10' },
    { id: '4', name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Pending', joined: '2023-07-01' },
    { id: '5', name: 'Eva Green', email: 'eva@example.com', role: 'Viewer', status: 'Active', joined: '2023-09-18' },
    { id: '6', name: 'Frank Lee', email: 'frank@example.com', role: 'Admin', status: 'Active', joined: '2023-11-04' },
    { id: '7', name: 'Grace Kim', email: 'grace@example.com', role: 'Editor', status: 'Inactive', joined: '2024-01-29' },
    { id: '8', name: 'Henry Park', email: 'henry@example.com', role: 'Viewer', status: 'Active', joined: '2024-03-12' },
]

const statusVariant: Record<User['status'], 'success' | 'destructive' | 'warning'> = {
    Active: 'success',
    Inactive: 'destructive',
    Pending: 'warning',
}

const columns: ColumnDef<User, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={statusVariant[row.original.status]} appearance='soft'>
                {row.original.status}
            </Badge>
        ),
    },
    { accessorKey: 'joined', header: 'Joined' },
]

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
    render: () => {
        const [page, setPage] = React.useState(1)
        const [limit, setLimit] = React.useState(20)
        const start = (page - 1) * limit
        const total = Math.ceil(USERS.length / limit)
        return (
            <DataTable
                columns={columns}
                data={USERS.slice(start, start + limit)}
                current={page}
                total={total}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
            />
        )
    },
}

export const StickyHeader: Story = {
    render: () => {
        const [page, setPage] = React.useState(1)
        const [limit, setLimit] = React.useState(20)
        const total = Math.ceil(USERS.length / limit)
        return (
            <DataTable
                columns={columns}
                data={USERS}
                current={page}
                total={total}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                maxHeight={260}
            />
        )
    },
}

export const Loading: Story = {
    render: () => (
        <TableState
            isLoading={true}
            loadingEl={<DataTableSkeleton columns={5} rows={8} />}
        >
            <DataTable
                columns={columns}
                data={USERS}
                current={1}
                total={1}
                setPage={() => {}}
                limit={10}
                setLimit={() => {}}
            />
        </TableState>
    ),
}

export const Errored: Story = {
    render: () => {
        const [key, setKey] = React.useState(0)
        return (
            <TableState
                isLoading={false}
                isError={true}
                onRetry={() => setKey((k) => k + 1)}
                loadingEl={<DataTableSkeleton columns={5} rows={8} />}
            >
                <DataTable
                    key={key}
                    columns={columns}
                    data={USERS}
                    current={1}
                    total={1}
                    setPage={() => {}}
                    limit={10}
                    setLimit={() => {}}
                />
            </TableState>
        )
    },
}

export const Empty: Story = {
    render: () => (
        <DataTable
            columns={columns}
            data={[]}
            current={1}
            total={1}
            setPage={() => {}}
            limit={10}
            setLimit={() => {}}
            emptyTitle='No users found'
            emptyDescription='Try adjusting your filters or add a new user.'
        />
    ),
}
