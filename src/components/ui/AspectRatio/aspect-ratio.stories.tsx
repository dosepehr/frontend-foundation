import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Image from 'next/image';
import { AspectRatio } from './components';
const meta: Meta<typeof AspectRatio> = {
    title: 'UI/AspectRatio',
    component: AspectRatio,
    tags: ['autodocs'],
    argTypes: {
        ratio: {
            control: 'number',
            description: 'Width-to-height ratio (e.g. 16/9, 4/3, 1)',
        },
        className: {
            control: 'text',
            description: 'Additional class names applied to the container',
        },
    },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
    render: (args) => (
        <div className="w-80">
            <AspectRatio {...args}>
                <Image
                    src="https://picsum.photos/seed/landscape/800/450"
                    alt="A wide landscape"
                    fill
                    className="rounded-md object-cover"
                />
            </AspectRatio>
        </div>
    ),
    args: {
        ratio: 16 / 9,
    },
};

export const Square: Story = {
    render: (args) => (
        <div className="w-64">
            <AspectRatio {...args}>
                <Image
                    src="https://picsum.photos/seed/square/600/600"
                    alt="Square image"
                    fill
                    className="rounded-md object-cover"
                />
            </AspectRatio>
        </div>
    ),
    args: {
        ratio: 1,
    },
};

export const Portrait: Story = {
    render: (args) => (
        <div className="w-48">
            <AspectRatio {...args}>
                <Image
                    src="https://picsum.photos/seed/portrait/600/800"
                    alt="Portrait image"
                    fill
                    className="rounded-md object-cover"
                />
            </AspectRatio>
        </div>
    ),
    args: {
        ratio: 3 / 4,
    },
};

export const WithPlaceholder: Story = {
    render: (args) => (
        <div className="w-80">
            <AspectRatio
                {...args}
                className="flex items-center justify-center rounded-md bg-muted"
            >
                <span className="text-sm text-muted-foreground">16 / 9</span>
            </AspectRatio>
        </div>
    ),
    args: {
        ratio: 16 / 9,
    },
};

export const AllRatios: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-6">
            {(
                [
                    { label: '16 / 9', ratio: 16 / 9 },
                    { label: '4 / 3', ratio: 4 / 3 },
                    { label: '1 / 1', ratio: 1 },
                    { label: '3 / 4', ratio: 3 / 4 },
                    { label: '9 / 16', ratio: 9 / 16 },
                ] as const
            ).map(({ label, ratio }) => (
                <div key={label} className="w-32">
                    <AspectRatio
                        ratio={ratio}
                        className="flex items-center justify-center rounded-md bg-muted"
                    >
                        <span className="text-xs text-muted-foreground">
                            {label}
                        </span>
                    </AspectRatio>
                </div>
            ))}
        </div>
    ),
    args: {},
};
