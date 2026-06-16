import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PasswordInput } from './password-input'

const meta: Meta<typeof PasswordInput> = {
    title: 'UI/PasswordInput',
    component: PasswordInput,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className='w-72'>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        label: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
}

export default meta
type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {
    args: {
        label: 'Password',
        placeholder: 'Enter your password',
    },
}

export const Required: Story = {
    args: {
        label: 'Password',
        placeholder: 'Enter your password',
        required: true,
    },
}

export const WithError: Story = {
    args: {
        label: 'Password',
        placeholder: 'Enter your password',
        error: 'Password must be at least 8 characters.',
        required: true,
    },
}

export const Disabled: Story = {
    args: {
        label: 'Password',
        placeholder: 'Enter your password',
        disabled: true,
    },
}
