import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import  Slider  from '.'

const meta: Meta<typeof Slider> = {
    title: 'UI/Slider',
    component: Slider,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'destructive', 'info'],
        },
        disabled: { control: 'boolean' },
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
    },
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className='w-80 py-4'>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
    args: { defaultValue: [60] },
}

export const Success: Story = {
    args: { defaultValue: [100], variant: 'success' },
}

export const Warning: Story = {
    args: { defaultValue: [45], variant: 'warning' },
}

export const Destructive: Story = {
    args: { defaultValue: [20], variant: 'destructive' },
}

export const Info: Story = {
    args: { defaultValue: [70], variant: 'info' },
}

export const Disabled: Story = {
    args: { defaultValue: [40], disabled: true },
}

export const Range: Story = {
    args: { defaultValue: [25, 75] },
}

export const WithSteps: Story = {
    args: { defaultValue: [40], step: 10 },
}

export const AllVariants: Story = {
    render: () => (
        <div className='flex w-80 flex-col gap-5'>
            <Slider defaultValue={[60]} variant='default' />
            <Slider defaultValue={[100]} variant='success' />
            <Slider defaultValue={[45]} variant='warning' />
            <Slider defaultValue={[20]} variant='destructive' />
            <Slider defaultValue={[70]} variant='info' />
        </div>
    ),
}
