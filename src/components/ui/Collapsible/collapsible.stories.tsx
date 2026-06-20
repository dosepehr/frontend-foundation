import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronRightIcon, ChevronsUpDownIcon } from 'lucide-react';
import * as React from 'react';
import Button from '../Button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from './components';

const meta = {
    title: 'UI/Collapsible',
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Collapsible className="w-64">
            <CollapsibleTrigger asChild>
                <button className="group flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-medium hover:bg-muted">
                    Toggle content
                    <ChevronRightIcon className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="rounded-lg border border-input px-3 py-2 text-sm text-muted-foreground">
                    This content animates open and closed using Motion.
                </div>
            </CollapsibleContent>
        </Collapsible>
    ),
};

export const DefaultOpen: Story = {
    render: () => (
        <Collapsible defaultOpen className="w-64">
            <CollapsibleTrigger asChild>
                <button className="group flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-medium hover:bg-muted">
                    Toggle content
                    <ChevronRightIcon className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="rounded-lg border border-input px-3 py-2 text-sm text-muted-foreground">
                    This content is open by default.
                </div>
            </CollapsibleContent>
        </Collapsible>
    ),
};

export const OrderDetails: Story = {
    render: () => {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="flex w-80 flex-col gap-2"
            >
                <div className="flex items-center justify-between gap-4 px-1">
                    <h4 className="text-sm font-semibold">Order #4189</h4>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <ChevronsUpDownIcon />
                            <span className="sr-only">Toggle details</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">Shipped</span>
                </div>
                <CollapsibleContent className="flex flex-col gap-2">
                    <div className="rounded-lg border border-border px-4 py-2 text-sm">
                        <p className="font-medium">Shipping address</p>
                        <p className="text-muted-foreground">
                            100 Market St, San Francisco
                        </p>
                    </div>
                    <div className="rounded-lg border border-border px-4 py-2 text-sm">
                        <p className="font-medium">Items</p>
                        <p className="text-muted-foreground">
                            2x Studio Headphones
                        </p>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        );
    },
};

export const MultipleItems: Story = {
    render: () => (
        <div className="flex w-64 flex-col gap-2">
            {['Section A', 'Section B', 'Section C'].map((section) => (
                <Collapsible key={section}>
                    <CollapsibleTrigger asChild>
                        <button className="group flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-medium hover:bg-muted">
                            {section}
                            <ChevronRightIcon className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1">
                        <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                            Content for {section}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    ),
};
