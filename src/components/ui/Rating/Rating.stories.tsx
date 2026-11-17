import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeartIcon } from 'lucide-react';
import { useState } from 'react';
import Rating from '.';

const meta: Meta<typeof Rating> = {
    title: 'UI/Rating',
    component: Rating,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        error: { control: 'text' },
        max: { control: 'number' },
        size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
        allowHalf: { control: 'boolean' },
        allowClear: { control: 'boolean' },
        readOnly: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    args: { label: 'Rating' },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {};

export const WithValue: Story = {
    args: { defaultValue: 3 },
};

export const HalfStars: Story = {
    args: {
        allowHalf: true,
        defaultValue: 3.5,
        description: 'Point at the left half of a star for a half value.',
    },
};

export const ReadOnly: Story = {
    args: { label: 'Average rating', readOnly: true, defaultValue: 4.3 },
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <Rating size="sm" defaultValue={4} aria-label="Small" />
            <Rating defaultValue={4} aria-label="Default" />
            <Rating size="lg" defaultValue={4} aria-label="Large" />
        </div>
    ),
};

export const CustomIcon: Story = {
    args: { label: 'Love it?', icon: <HeartIcon />, defaultValue: 2 },
};

export const TenStars: Story = {
    args: { max: 10, defaultValue: 7 },
};

export const Invalid: Story = {
    args: { error: 'Please rate your stay.', required: true },
};

export const Disabled: Story = {
    args: { defaultValue: 2, disabled: true },
};

const ControlledDemo = () => {
    const [value, setValue] = useState(2);
    return (
        <div className="flex flex-col gap-2">
            <Rating
                label="Controlled"
                allowHalf
                value={value}
                onValueChange={setValue}
            />
            <p className="text-sm text-muted-foreground">Value: {value}</p>
        </div>
    );
};

export const Controlled: Story = {
    render: () => <ControlledDemo />,
};

export const RightToLeft: Story = {
    // Persian page: lang sets the Estedad font, dir the direction (also for portals).
    globals: { i18n: 'fa-IR' },
    render: (args) => (
        <div dir="rtl">
            <Rating {...args} />
        </div>
    ),
    args: { label: 'امتیاز', allowHalf: true, defaultValue: 2.5 },
};
