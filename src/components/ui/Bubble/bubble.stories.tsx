import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BubbleWrapper from '.';
import { BubbleGroup } from './components';

const meta: Meta<typeof BubbleWrapper> = {
    title: 'UI/Bubble',
    component: BubbleWrapper,
    tags: ['autodocs'],
    argTypes: {
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
            description: 'Visual treatment of the bubble',
        },
        align: {
            control: 'radio',
            options: ['start', 'end'],
            description: 'Inline alignment of the bubble within its container',
        },
    },
    decorators: [
        (Story) => (
            <div className="flex w-full flex-col gap-4 p-4">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof BubbleWrapper>;

export const Default: Story = {
    args: {
        variant: 'default',
        align: 'start',
        children: 'I checked the registry output and removed the stale route.',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <BubbleWrapper variant="default">default — strong primary, usually the current user</BubbleWrapper>
            <BubbleWrapper variant="secondary">secondary — standard neutral bubble for conversation</BubbleWrapper>
            <BubbleWrapper variant="muted">muted — lower emphasis for quiet supporting content</BubbleWrapper>
            <BubbleWrapper variant="tinted">tinted — subtle primary tint</BubbleWrapper>
            <BubbleWrapper variant="outline">outline — bordered bubble for rich content</BubbleWrapper>
            <BubbleWrapper variant="ghost">ghost — unframed, full-width for assistant text</BubbleWrapper>
            <BubbleWrapper variant="destructive">destructive — error or failed action</BubbleWrapper>
        </div>
    ),
    args: {},
};

export const Alignment: Story = {
    render: () => (
        <div className="flex w-full flex-col gap-3">
            <BubbleWrapper variant="secondary" align="start">Hey, did you finish the PR review?</BubbleWrapper>
            <BubbleWrapper variant="default" align="end">Just finished. Left some comments on the auth flow.</BubbleWrapper>
            <BubbleWrapper variant="secondary" align="start">{"Nice, I'll address them now and push a fix."}</BubbleWrapper>
            <BubbleWrapper variant="default" align="end">Sounds good. Ping me when ready.</BubbleWrapper>
        </div>
    ),
    args: {},
};

export const Group: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <BubbleGroup>
                <BubbleWrapper variant="secondary" align="start">{"I've been looking into the issue."}</BubbleWrapper>
                <BubbleWrapper variant="secondary" align="start">{"Turns out it's a race condition in the auth middleware."}</BubbleWrapper>
                <BubbleWrapper variant="secondary" align="start">{"I'll have a fix ready by end of day."}</BubbleWrapper>
            </BubbleGroup>

            <BubbleGroup>
                <BubbleWrapper variant="default" align="end">Perfect, thanks for looking into it.</BubbleWrapper>
                <BubbleWrapper variant="default" align="end">Let me know if you need another pair of eyes.</BubbleWrapper>
            </BubbleGroup>
        </div>
    ),
    args: {},
};

export const WithReactions: Story = {
    render: () => (
        <div className="flex flex-col gap-8 pb-4">
            <BubbleWrapper
                variant="secondary"
                reactions={<><span>👍</span><span>🔥</span><span>+3</span></>}
            >
                Shipped the feature — finally! 🚀
            </BubbleWrapper>

            <BubbleWrapper
                variant="default"
                align="end"
                reactions={<span>❤️</span>}
                reactionsAlign="end"
            >
                Great work everyone, this was a team effort.
            </BubbleWrapper>
        </div>
    ),
    args: {},
};

export const ReactionsTop: Story = {
    render: () => (
        <div className="flex flex-col gap-8 pt-6">
            <BubbleWrapper
                variant="secondary"
                reactions={<><span>👀</span><span>+2</span></>}
                reactionsSide="top"
                reactionsAlign="start"
            >
                Reactions can sit on the top edge too.
            </BubbleWrapper>

            <BubbleWrapper
                variant="default"
                align="end"
                reactions={<span>✅</span>}
                reactionsSide="top"
                reactionsAlign="end"
            >
                Use side and align to position them anywhere.
            </BubbleWrapper>
        </div>
    ),
    args: {},
};

export const AsButton: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <BubbleWrapper variant="muted" contentAsChild>
                <button type="button">I forgot my password</button>
            </BubbleWrapper>
            <BubbleWrapper variant="muted" contentAsChild>
                <button type="button">Create a new account</button>
            </BubbleWrapper>
            <BubbleWrapper variant="muted" contentAsChild>
                <button type="button">Sign in with Google</button>
            </BubbleWrapper>
        </div>
    ),
    args: {},
};

export const AsLink: Story = {
    render: () => (
        <BubbleWrapper variant="outline" contentAsChild>
            <a href="#">View the full changelog →</a>
        </BubbleWrapper>
    ),
    args: {},
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Failed to send message. Please check your connection and try again.',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children:
            'The ghost variant removes the background and max-width constraint, making it ideal for assistant responses or rich content that should span the full container width.',
    },
};

export const Conversation: Story = {
    render: () => (
        <div className="flex w-full max-w-sm flex-col gap-6 mx-auto">
            <BubbleGroup>
                <BubbleWrapper variant="secondary" align="start">Hey! The deploy pipeline failed again.</BubbleWrapper>
                <BubbleWrapper variant="secondary" align="start">Same error as last time in the build step.</BubbleWrapper>
            </BubbleGroup>

            <BubbleWrapper variant="default" align="end">On it — looking at the logs now.</BubbleWrapper>

            <BubbleWrapper variant="ghost" align="start">
                Found it. The Node version in CI is pinned to 18 but the lockfile was generated with 20. Updating the workflow now.
            </BubbleWrapper>

            <BubbleGroup>
                <BubbleWrapper variant="default" align="end">Perfect. Should I bump the base image too?</BubbleWrapper>
                <BubbleWrapper variant="default" align="end">Or just the engine field in package.json?</BubbleWrapper>
            </BubbleGroup>

            <BubbleWrapper
                variant="secondary"
                align="start"
                reactions={<span>👍</span>}
                reactionsAlign="start"
            >
                {"Both. I'll send a PR in a few minutes."}
            </BubbleWrapper>
        </div>
    ),
    args: {},
    decorators: [
        (Story) => (
            <div className="flex w-full justify-center p-4 pb-8">
                <Story />
            </div>
        ),
    ],
};
