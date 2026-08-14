import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import ErrorBoundaryWrapper from '.';
import Button from '../Button';

const Bomb = (): never => {
    throw new Error('This is a simulated rendering error.');
};

const Demo = () => {
    const [shouldThrow, setShouldThrow] = useState(false);

    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <Button
                size="sm"
                variant="destructive"
                onClick={() => setShouldThrow(true)}
                disabled={shouldThrow}
            >
                Trigger error
            </Button>
            <ErrorBoundaryWrapper onReset={() => setShouldThrow(false)}>
                {shouldThrow ? (
                    <Bomb />
                ) : (
                    <p className="text-sm text-muted-foreground">
                        This section loaded fine.
                    </p>
                )}
            </ErrorBoundaryWrapper>
        </div>
    );
};

const meta: Meta<typeof ErrorBoundaryWrapper> = {
    title: 'UI/ErrorBoundary',
    component: ErrorBoundaryWrapper,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundaryWrapper>;

export const Default: Story = {
    render: () => <Demo />,
};

export const CustomFallbackText: Story = {
    render: () => (
        <div className="w-full max-w-sm">
            <ErrorBoundaryWrapper
                title="Failed to load widget"
                description="Please retry in a moment, or contact support if this keeps happening."
            >
                <Bomb />
            </ErrorBoundaryWrapper>
        </div>
    ),
};
