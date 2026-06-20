import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CardWrapper from '.';

const meta: Meta<typeof CardWrapper> = {
    title: 'UI/Card',
    component: CardWrapper,
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Card title rendered in the header',
        },
        description: {
            control: 'text',
            description: 'Card description rendered below the title',
        },
        children: {
            control: 'text',
            description: 'Content rendered inside the card body',
        },
        footer: {
            control: 'text',
            description: 'Content rendered in the card footer',
        },
        size: {
            control: 'radio',
            options: ['default', 'sm'],
            description: 'Controls spacing and font size of the card',
        },
        className: {
            control: 'text',
            description: 'Additional class names applied to the card',
        },
        headerProps: {
            control: 'object',
            description: 'Props passed to the header element',
        },
        contentProps: {
            control: 'object',
            description: 'Props passed to the content element',
        },
        footerProps: {
            control: 'object',
            description: 'Props passed to the footer element',
        },
    },
};

export default meta;
type Story = StoryObj<typeof CardWrapper>;

export const Default: Story = {
    args: {
        size: 'default',
        title: 'Card Title',
        description: 'Card description goes here.',
        children: 'This is the card content area.',
        footer: 'Card footer',
        className: 'w-80',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        title: 'Small Card',
        description: 'Compact spacing variant.',
        children: 'Tighter padding and smaller font size.',
        footer: 'Footer',
        className: 'w-80',
    },
};

export const WithAction: Story = {
    render: () => (
        <CardWrapper
            className="w-80"
            title="With Action"
            description="An action slot in the header."
            action={
                <button className="text-xs text-primary underline">Edit</button>
            }
        >
            The action is positioned in the top-right of the header.
        </CardWrapper>
    ),
    args: {},
};

export const ContentOnly: Story = {
    args: {
        className: 'w-80',
        children: 'A card with only content and no header or footer.',
    },
};

export const WithFooter: Story = {
    render: () => (
        <CardWrapper
            className="w-80"
            title="Terms of Service"
            description="Please read before continuing."
            footer={
                <div className="flex gap-2">
                    <button className="text-sm font-medium">Decline</button>
                    <button className="text-sm font-medium text-primary">
                        Accept
                    </button>
                </div>
            }
        >
            By using this service you agree to our terms and privacy policy.
        </CardWrapper>
    ),
    args: {},
};
