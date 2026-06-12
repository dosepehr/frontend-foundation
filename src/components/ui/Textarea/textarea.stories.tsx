import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { TextareaWrapper } from '.'

const meta: Meta<typeof TextareaWrapper> = {
    title: 'UI/Textarea',
    component: TextareaWrapper,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        rows: { control: 'number' },
        maxLength: { control: 'number' },
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
type Story = StoryObj<typeof TextareaWrapper>

export const Default: Story = {
    args: {
        label: 'Message',
        placeholder: 'Type your message here.',
    },
}

export const WithDescription: Story = {
    args: {
        label: 'Feedback',
        description: 'Share your thoughts about our service.',
        placeholder: 'Your feedback helps us improve...',
        rows: 4,
    },
}

export const Invalid: Story = {
    args: {
        label: 'Message',
        placeholder: 'Type your message here.',
        error: 'This field is required.',
    },
}

export const InvalidWithDescription: Story = {
    args: {
        label: 'Message',
        description: 'Please enter a valid message.',
        placeholder: 'Type your message here.',
        error: 'Message must be at least 10 characters.',
    },
}

export const Required: Story = {
    args: {
        label: 'Description',
        placeholder: 'This field is required...',
        required: true,
    },
}

export const Disabled: Story = {
    args: {
        label: 'Notes',
        placeholder: 'This field is disabled.',
        disabled: true,
    },
}

export const WithCharacterCounter: Story = {
    render: (args) => {
        const [value, setValue] = useState('')
        const max = 200
        return (
            <TextareaWrapper
                {...args}
                value={value}
                description={`${value.length} / ${max} characters`}
                maxLength={max}
                onChange={(e) => setValue(e.target.value)}
            />
        )
    },
    args: {
        label: 'Bio',
        placeholder: 'Tell us about yourself...',
    },
}

export const WithCounterAndError: Story = {
    render: (args) => {
        const max = 30
        const [value, setValue] = useState('This text is already too long for the limit')
        const isOver = value.length > max
        return (
            <TextareaWrapper
                {...args}
                value={value}
                description={`${value.length} / ${max} characters`}
                error={isOver ? 'Text exceeds the maximum length.' : undefined}
                onChange={(e) => setValue(e.target.value)}
            />
        )
    },
    args: {
        label: 'Summary',
        placeholder: 'Keep it short...',
    },
}
