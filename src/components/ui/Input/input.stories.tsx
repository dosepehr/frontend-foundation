import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SearchIcon, MailIcon, InfoIcon } from 'lucide-react'
import Button from '../Button'
import InputWrapper from '.'

const meta: Meta<typeof InputWrapper> = {
    title: 'UI/Input',
    component: InputWrapper,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'search', 'url', 'tel'],
        },
    },
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className='w-80'>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof InputWrapper>

export const Default: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
    },
}

export const WithDescription: Story = {
    args: {
        label: 'Email',
        description: 'We will never share your email with anyone.',
        placeholder: 'you@example.com',
        type: 'email',
    },
}

export const Invalid: Story = {
    args: {
        label: 'Email',
        placeholder: 'you@example.com',
        type: 'email',
        error: 'Please enter a valid email address.',
    },
}

export const Required: Story = {
    args: {
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true,
    },
}

export const Disabled: Story = {
    args: {
        label: 'Username',
        placeholder: 'This field is disabled',
        disabled: true,
    },
}

export const WithStartIcon: Story = {
    args: {
        label: 'Search',
        placeholder: 'Search...',
        startAddon: <SearchIcon className='size-4' />,
    },
}

export const WithEndIcon: Story = {
    args: {
        label: 'Info',
        placeholder: 'Enter value...',
        endAddon: <InfoIcon className='size-4' />,
    },
}

export const WithStartText: Story = {
    args: {
        label: 'Website URL',
        placeholder: 'example.com',
        startAddon: 'https://',
    },
}

export const WithBothAddons: Story = {
    args: {
        label: 'Website URL',
        placeholder: 'example.com',
        startAddon: 'https://',
        endAddon: <InfoIcon className='size-4' />,
    },
}

export const WithAddonEmail: Story = {
    args: {
        label: 'Email',
        placeholder: 'you@example.com',
        type: 'email',
        startAddon: <MailIcon className='size-4' />,
    },
}

export const WithAddonInvalid: Story = {
    args: {
        label: 'Email',
        placeholder: 'you@example.com',
        type: 'email',
        startAddon: <MailIcon className='size-4' />,
        error: 'Please enter a valid email address.',
    },
}

export const WithActionButton: Story = {
    render: (args) => (
        <InputWrapper
            {...args}
            action={<Button variant='outline'>Search</Button>}
        />
    ),
    args: {
        label: 'Search',
        placeholder: 'Type to search...',
    },
}

export const WithActionButtonPrefix: Story = {
    render: (args) => (
        <InputWrapper
            {...args}
            startAddon={<Button variant='outline' className='rounded-e-none border-0'>https://</Button>}
        />
    ),
    args: {
        label: 'Domain',
        placeholder: 'example.com',
    },
}
