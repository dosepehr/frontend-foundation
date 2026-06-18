import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CommandIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, DeleteIcon } from 'lucide-react'
import { Kbd, KbdGroup } from './components'

const meta: Meta<typeof Kbd> = {
    title: 'UI/Kbd',
    component: Kbd,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = {
    render: () => <Kbd>K</Kbd>,
}

export const WithText: Story = {
    render: () => <Kbd>Enter</Kbd>,
}

export const WithIcon: Story = {
    render: () => <Kbd><CommandIcon /></Kbd>,
}

export const Shortcut: Story = {
    render: () => (
        <KbdGroup>
            <Kbd><CommandIcon /></Kbd>
            <Kbd>K</Kbd>
        </KbdGroup>
    ),
}

export const CommonShortcuts: Story = {
    render: () => (
        <div className='flex flex-col gap-3'>
            {[
                { label: 'Command palette', keys: [<CommandIcon key='cmd' />, 'K'] },
                { label: 'Save', keys: [<CommandIcon key='cmd' />, 'S'] },
                { label: 'Undo', keys: [<CommandIcon key='cmd' />, 'Z'] },
                { label: 'Copy', keys: [<CommandIcon key='cmd' />, 'C'] },
                { label: 'Paste', keys: [<CommandIcon key='cmd' />, 'V'] },
                { label: 'Select all', keys: [<CommandIcon key='cmd' />, 'A'] },
            ].map(({ label, keys }) => (
                <div key={label} className='flex items-center justify-between gap-8'>
                    <span className='text-sm text-muted-foreground'>{label}</span>
                    <KbdGroup>
                        {keys.map((k, i) => <Kbd key={i}>{k}</Kbd>)}
                    </KbdGroup>
                </div>
            ))}
        </div>
    ),
}

export const ArrowKeys: Story = {
    render: () => (
        <div className='flex flex-col items-center gap-1'>
            <KbdGroup>
                <Kbd><ArrowUpIcon /></Kbd>
            </KbdGroup>
            <KbdGroup>
                <Kbd><ArrowLeftIcon /></Kbd>
                <Kbd><ArrowDownIcon /></Kbd>
                <Kbd><ArrowRightIcon /></Kbd>
            </KbdGroup>
        </div>
    ),
}

export const SpecialKeys: Story = {
    render: () => (
        <div className='flex flex-wrap gap-2'>
            <Kbd>Enter</Kbd>
            <Kbd>Escape</Kbd>
            <Kbd>Tab</Kbd>
            <Kbd>Space</Kbd>
            <Kbd><DeleteIcon /></Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>Alt</Kbd>
            <Kbd>Ctrl</Kbd>
            <Kbd><CommandIcon /></Kbd>
        </div>
    ),
}

export const InlineUsage: Story = {
    render: () => (
        <p className='text-sm text-muted-foreground'>
            Press <Kbd><CommandIcon /></Kbd> <Kbd>K</Kbd> to open the command palette, or <Kbd>Escape</Kbd> to close it.
        </p>
    ),
}
