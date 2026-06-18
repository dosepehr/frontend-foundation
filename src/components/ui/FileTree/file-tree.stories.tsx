import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FileTreeItem } from './file-tree.types'
import { FileTree } from './components'

const meta = {
    title: 'UI/FileTree',
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const projectTree: FileTreeItem[] = [
    {
        name: 'components',
        items: [
            {
                name: 'ui',
                items: [
                    { name: 'button.tsx' },
                    { name: 'card.tsx' },
                    { name: 'dialog.tsx' },
                    { name: 'input.tsx' },
                    { name: 'select.tsx' },
                ],
            },
            { name: 'login-form.tsx' },
            { name: 'register-form.tsx' },
        ],
    },
    {
        name: 'lib',
        items: [
            { name: 'utils.ts' },
            { name: 'cn.ts' },
            { name: 'api.ts' },
        ],
    },
    {
        name: 'hooks',
        items: [
            { name: 'use-media-query.ts' },
            { name: 'use-debounce.ts' },
            { name: 'use-local-storage.ts' },
        ],
    },
    {
        name: 'public',
        items: [
            { name: 'favicon.ico' },
            { name: 'logo.svg' },
        ],
    },
    { name: 'app.tsx' },
    { name: 'layout.tsx' },
    { name: 'globals.css' },
    { name: 'package.json' },
    { name: 'tsconfig.json' },
    { name: 'README.md' },
]

export const Default: Story = {
    render: () => (
        <div className='w-56 rounded-xl border border-border bg-card p-2'>
            <FileTree items={projectTree} />
        </div>
    ),
}

export const Shallow: Story = {
    render: () => (
        <div className='w-48 rounded-xl border border-border bg-card p-2'>
            <FileTree
                items={[
                    {
                        name: 'src',
                        items: [
                            { name: 'index.ts' },
                            { name: 'types.ts' },
                            { name: 'utils.ts' },
                        ],
                    },
                    { name: 'package.json' },
                    { name: 'README.md' },
                ]}
            />
        </div>
    ),
}
