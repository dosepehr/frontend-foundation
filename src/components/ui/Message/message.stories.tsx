import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckIcon, CopyIcon, RotateCcwIcon, ThumbsUpIcon } from 'lucide-react';
import MessageWrapper from '.';
import AttachmentWrapper from '../Attachment';
import Button from '../Button';
import MarkerWrapper from '../Marker';
import { Spinner } from '../Spinner/components';
import { MessageGroup } from './components';

const meta: Meta<typeof MessageWrapper> = {
    title: 'UI/Message',
    component: MessageWrapper,
    tags: ['autodocs'],
    argTypes: {
        align: {
            control: 'radio',
            options: ['start', 'end'],
            description: 'Alignment of the message row and bubble',
        },
        variant: {
            control: 'select',
            options: [
                'default',
                'secondary',
                'muted',
                'tinted',
                'outline',
                'ghost',
                'destructive',
            ],
        },
        children: { control: 'text' },
    },
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className="w-full max-w-sm">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof MessageWrapper>;

export const Default: Story = {
    args: {
        avatarFallback: 'CN',
        variant: 'secondary',
        children: 'How can I help you today?',
    },
};

// ─── Avatar ──────────────────────────────────────────────────────────────

export const Avatar: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <MessageWrapper
                align="start"
                avatarFallback="CN"
                variant="secondary"
            >
                How can I help you today?
            </MessageWrapper>
            <MessageWrapper align="end" avatarFallback="You" variant="default">
                I need help debugging a race condition.
            </MessageWrapper>
        </div>
    ),
};

// ─── Group ───────────────────────────────────────────────────────────────

export const Group: Story = {
    render: () => (
        <MessageGroup>
            <MessageWrapper reserveAvatarSpace variant="secondary">
                {"I've been looking into the issue."}
            </MessageWrapper>
            <MessageWrapper reserveAvatarSpace variant="secondary">
                {"Turns out it's a race condition in the auth middleware."}
            </MessageWrapper>
            <MessageWrapper avatarFallback="CN" variant="secondary">
                {"I'll have a fix ready by end of day."}
            </MessageWrapper>
        </MessageGroup>
    ),
};

// ─── Header and Footer ───────────────────────────────────────────────────

export const HeaderAndFooter: Story = {
    render: () => (
        <MessageWrapper
            avatarFallback="CN"
            variant="secondary"
            header="Claude"
            footer="Read 2:14 PM"
        >
            {"I've pushed the fix — mind taking a look?"}
        </MessageWrapper>
    ),
};

// ─── Actions ─────────────────────────────────────────────────────────────

export const Actions: Story = {
    render: () => (
        <MessageWrapper
            avatarFallback="CN"
            variant="secondary"
            header="Claude"
            footer={
                <>
                    <Button variant="ghost" size="icon-sm" aria-label="Copy">
                        <CopyIcon />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Retry">
                        <RotateCcwIcon />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Good response"
                    >
                        <ThumbsUpIcon />
                    </Button>
                </>
            }
        >
            {"Here's the updated implementation with the fix applied."}
        </MessageWrapper>
    ),
};

// ─── Attachment ──────────────────────────────────────────────────────────

export const Attachment: Story = {
    render: () => (
        <MessageWrapper
            align="end"
            avatarFallback="You"
            avatarSrc="https://github.com/shadcn.png"
            render={
                <AttachmentWrapper
                    name="architecture-diagram.png"
                    description="1.2 MB"
                    state="done"
                />
            }
        />
    ),
};

// ─── Status ──────────────────────────────────────────────────────────────

export const Status: Story = {
    render: () => (
        <MessageWrapper
            className="items-center"
            avatarFallback="CN"
            render={
                <MarkerWrapper
                    role="status"
                    icon={<Spinner size="sm" />}
                    shimmer
                >
                    Checking the logs...
                </MarkerWrapper>
            }
        />
    ),
};

// ─── Links and Buttons ───────────────────────────────────────────────────

export const AsLink: Story = {
    render: () => (
        <MessageWrapper avatarFallback="CN" variant="outline" contentAsChild>
            <a href="#">View the full changelog →</a>
        </MessageWrapper>
    ),
};

// ─── Conversation ────────────────────────────────────────────────────────

export const Conversation: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <MessageGroup>
                <MessageWrapper reserveAvatarSpace variant="secondary">
                    Hey! The deploy pipeline failed again.
                </MessageWrapper>
                <MessageWrapper
                    avatarFallback="CN"
                    variant="secondary"
                    header="Claude"
                >
                    Same error as last time in the build step.
                </MessageWrapper>
            </MessageGroup>

            <MessageWrapper align="end" avatarFallback="You" variant="default">
                On it — looking at the logs now.
            </MessageWrapper>

            <MessageWrapper
                avatarFallback="CN"
                render={
                    <MarkerWrapper
                        role="status"
                        icon={<Spinner size="sm" />}
                        shimmer
                    >
                        Checking the logs...
                    </MarkerWrapper>
                }
            />

            <MessageWrapper
                align="end"
                avatarFallback="You"
                variant="default"
                footer={
                    <Button variant="ghost" size="icon-sm" aria-label="Copy">
                        <CopyIcon />
                    </Button>
                }
            >
                Perfect. Should I bump the base image too?
            </MessageWrapper>

            <MessageWrapper
                avatarFallback="CN"
                variant="secondary"
                header="Claude"
                footer={
                    <span className="flex items-center gap-1">
                        <CheckIcon className="size-3" />
                        Delivered
                    </span>
                }
            >
                {"Both. I'll send a PR in a few minutes."}
            </MessageWrapper>
        </div>
    ),
};
