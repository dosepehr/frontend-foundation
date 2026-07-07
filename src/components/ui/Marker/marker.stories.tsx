import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    CheckIcon,
    FileTextIcon,
    GitPullRequestIcon,
    SearchIcon,
} from 'lucide-react';
import MarkerWrapper from '.';
import { Spinner } from '../Spinner/components';

const meta: Meta<typeof MarkerWrapper> = {
    title: 'UI/Marker',
    component: MarkerWrapper,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'radio',
            options: ['default', 'border', 'separator'],
            description: 'Layout of the marker row',
        },
        shimmer: { control: 'boolean' },
        children: { control: 'text' },
    },
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof MarkerWrapper>;

export const Default: Story = {
    args: {
        icon: <CheckIcon />,
        children: 'Explored 4 files',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <MarkerWrapper variant="default" icon={<CheckIcon />}>
                default — inline marker for status and notes
            </MarkerWrapper>
            <MarkerWrapper variant="border" icon={<FileTextIcon />}>
                border — default marker with a bottom border
            </MarkerWrapper>
            <MarkerWrapper variant="separator">Today</MarkerWrapper>
        </div>
    ),
};

// ─── Status ──────────────────────────────────────────────────────────────

export const Status: Story = {
    render: () => (
        <MarkerWrapper role="status" icon={<Spinner size="sm" />}>
            Thinking...
        </MarkerWrapper>
    ),
};

export const Shimmer: Story = {
    render: () => (
        <MarkerWrapper role="status" icon={<Spinner size="sm" />} shimmer>
            Compacting conversation...
        </MarkerWrapper>
    ),
};

// ─── Separator ───────────────────────────────────────────────────────────

export const Separator: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <MarkerWrapper variant="separator">Today</MarkerWrapper>
            <MarkerWrapper variant="separator">March 5, 2026</MarkerWrapper>
        </div>
    ),
};

// ─── Border ──────────────────────────────────────────────────────────────

export const Border: Story = {
    render: () => (
        <div className="flex flex-col">
            <MarkerWrapper variant="border" icon={<FileTextIcon />}>
                Opened implementation notes
            </MarkerWrapper>
        </div>
    ),
};

// ─── With Icon ───────────────────────────────────────────────────────────

export const WithIcon: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <MarkerWrapper icon={<SearchIcon />}>
                Searched the codebase for &quot;useAuth&quot;
            </MarkerWrapper>
            <MarkerWrapper icon={<FileTextIcon />}>Read 3 files</MarkerWrapper>
            <MarkerWrapper icon={<CheckIcon />}>Applied changes</MarkerWrapper>
        </div>
    ),
};

export const IconStacked: Story = {
    render: () => (
        <MarkerWrapper
            className="flex-col items-start gap-1.5"
            icon={<CheckIcon />}
        >
            Explored 4 files
        </MarkerWrapper>
    ),
};

// ─── Links and Buttons ───────────────────────────────────────────────────

export const AsLink: Story = {
    render: () => (
        <MarkerWrapper render={<a href="#" />} icon={<GitPullRequestIcon />}>
            View the pull request
        </MarkerWrapper>
    ),
};

export const AsButton: Story = {
    render: () => (
        <MarkerWrapper
            render={<button type="button" />}
            icon={<FileTextIcon />}
        >
            Explored 4 files
        </MarkerWrapper>
    ),
};

// ─── Icon-only ───────────────────────────────────────────────────────────

export const IconOnly: Story = {
    render: () => <MarkerWrapper aria-label="Synced" icon={<CheckIcon />} />,
};

// ─── Conversation ────────────────────────────────────────────────────────

export const InConversation: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <MarkerWrapper variant="separator">Today</MarkerWrapper>
            <MarkerWrapper icon={<SearchIcon />}>
                Searched the codebase for &quot;auth middleware&quot;
            </MarkerWrapper>
            <MarkerWrapper icon={<FileTextIcon />}>
                Opened 3 files
            </MarkerWrapper>
            <MarkerWrapper variant="border" icon={<CheckIcon />}>
                Applied the fix
            </MarkerWrapper>
            <MarkerWrapper role="status" icon={<Spinner size="sm" />} shimmer>
                Running tests...
            </MarkerWrapper>
        </div>
    ),
    args: {},
    decorators: [
        (Story) => (
            <div className="w-full max-w-sm">
                <Story />
            </div>
        ),
    ],
};
