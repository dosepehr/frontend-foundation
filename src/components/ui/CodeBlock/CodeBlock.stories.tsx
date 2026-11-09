import HighlightedBlock from '@/utils/funcs/codeblock/HighlightedBlock';
import LanguagesDemo from '@/utils/funcs/codeblock/LanguagesDemo';
import ShowMoreDemo from '@/utils/funcs/codeblock/ShowMoreDemo';
import StreamingDemo from '@/utils/funcs/codeblock/StreamingDemo';
import WrapToggleDemo from '@/utils/funcs/codeblock/WrapToggleDemo';
import {
    ansiOutput,
    componentCode,
    configJson,
    installOutput,
    longFile,
    longLine,
} from '@/utils/funcs/codeblock/codeSamples';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FileCodeIcon } from 'lucide-react';
import CodeBlock, {
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockLine,
    CodeBlockTitle,
} from '.';
import Tabs, { TabsContent, TabsList, TabsTrigger } from '../Tabs';

const meta: Meta<typeof CodeBlock> = {
    title: 'UI/CodeBlock',
    component: CodeBlock,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive'],
            description: 'The tone of the block',
        },
        size: {
            control: 'select',
            options: ['default', 'sm'],
            description:
                '`sm` has tighter padding and text-xs code, for tool output',
        },
    },
    decorators: [
        (Story) => (
            <div className="w-full max-w-xl">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

// ---- Basics ----

export const Default: Story = {
    args: { variant: 'default', size: 'default' },
    render: (args) => (
        <CodeBlock {...args}>
            <CodeBlockHeader>
                <CodeBlockTitle>Terminal</CodeBlockTitle>
                <CodeBlockActions>
                    <CodeBlockCopyButton value={installOutput} />
                </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>{installOutput}</CodeBlockContent>
        </CodeBlock>
    ),
};

export const Basic: Story = {
    render: () => (
        <CodeBlock>
            <CodeBlockContent>{installOutput}</CodeBlockContent>
        </CodeBlock>
    ),
};

export const Header: Story = {
    render: () => (
        <CodeBlock>
            <CodeBlockHeader>
                <CodeBlockTitle>
                    <FileCodeIcon />
                    components/example.tsx
                </CodeBlockTitle>
                <CodeBlockActions>
                    <CodeBlockCopyButton value={componentCode} />
                </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>{componentCode}</CodeBlockContent>
        </CodeBlock>
    ),
};

export const FloatingActions: Story = {
    render: () => (
        <CodeBlock>
            <CodeBlockActions>
                <CodeBlockCopyButton value={installOutput} />
            </CodeBlockActions>
            <CodeBlockContent>{installOutput}</CodeBlockContent>
        </CodeBlock>
    ),
};

export const LineNumbers: Story = {
    render: () => (
        <CodeBlock>
            <CodeBlockContent lineNumbers>{componentCode}</CodeBlockContent>
        </CodeBlock>
    ),
};

export const StartLine: Story = {
    render: () => (
        <CodeBlock>
            <CodeBlockContent lineNumbers startLine={98}>
                {componentCode}
            </CodeBlockContent>
        </CodeBlock>
    ),
};

export const Wrap: Story = {
    render: () => (
        <CodeBlock>
            <CodeBlockContent wrap>{longLine}</CodeBlockContent>
        </CodeBlock>
    ),
};

export const Size: Story = {
    render: () => (
        <CodeBlock size="sm">
            <CodeBlockHeader>
                <CodeBlockTitle>npm install</CodeBlockTitle>
                <CodeBlockActions>
                    <CodeBlockCopyButton value={installOutput} />
                </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>{installOutput}</CodeBlockContent>
        </CodeBlock>
    ),
};

export const Destructive: Story = {
    render: () => (
        <CodeBlock variant="destructive">
            <CodeBlockHeader>
                <CodeBlockTitle>Build failed</CodeBlockTitle>
            </CodeBlockHeader>
            <CodeBlockContent wrap>{longLine}</CodeBlockContent>
        </CodeBlock>
    ),
};

export const Rtl: Story = {
    name: 'RTL',
    render: () => (
        <div dir="rtl">
            <CodeBlock>
                <CodeBlockHeader>
                    <CodeBlockTitle>ترمینال</CodeBlockTitle>
                    <CodeBlockActions>
                        <CodeBlockCopyButton value={installOutput} />
                    </CodeBlockActions>
                </CodeBlockHeader>
                <CodeBlockContent>{installOutput}</CodeBlockContent>
            </CodeBlock>
        </div>
    ),
};

// ---- Lines ----

export const HighlightedLines: Story = {
    render: () => (
        <CodeBlock>
            <CodeBlockContent lineNumbers>
                <CodeBlockLine>
                    {"import { cn } from '@/utils/funcs/cn';"}
                </CodeBlockLine>
                <CodeBlockLine />
                <CodeBlockLine variant="highlighted">
                    {
                        'export function Badge({ className }: { className?: string }) {'
                    }
                </CodeBlockLine>
                <CodeBlockLine variant="highlighted">
                    {"    return <span className={cn('badge', className)} />;"}
                </CodeBlockLine>
                <CodeBlockLine>{'}'}</CodeBlockLine>
            </CodeBlockContent>
        </CodeBlock>
    ),
};

export const Diff: Story = {
    render: () => (
        <CodeBlock>
            <CodeBlockContent>
                <CodeBlockLine>{'const config = {'}</CodeBlockLine>
                <CodeBlockLine variant="removed">
                    {"    output: 'standalone',"}
                </CodeBlockLine>
                <CodeBlockLine variant="added">
                    {"    output: 'export',"}
                </CodeBlockLine>
                <CodeBlockLine variant="added">
                    {'    trailingSlash: true,'}
                </CodeBlockLine>
                <CodeBlockLine>{'};'}</CodeBlockLine>
            </CodeBlockContent>
        </CodeBlock>
    ),
};

export const Height: Story = {
    render: () => (
        <CodeBlock>
            <CodeBlockContent lineNumbers className="max-h-72">
                {longFile}
            </CodeBlockContent>
        </CodeBlock>
    ),
};

// ---- Interactive ----

export const Actions: Story = {
    render: () => <WrapToggleDemo />,
};

export const ShowMore: Story = {
    render: () => <ShowMoreDemo />,
};

export const ShowMoreMaxHeight: Story = {
    name: 'Show more (max height)',
    render: () => <ShowMoreDemo expandedClassName="max-h-96 scroll-fade-y" />,
};

export const InTabs: Story = {
    name: 'Tabs',
    render: () => (
        <Tabs defaultValue="component">
            <TabsList>
                <TabsTrigger value="component">Example.tsx</TabsTrigger>
                <TabsTrigger value="config">package.json</TabsTrigger>
            </TabsList>
            <TabsContent value="component">
                <CodeBlock>
                    <CodeBlockActions>
                        <CodeBlockCopyButton value={componentCode} />
                    </CodeBlockActions>
                    <CodeBlockContent>{componentCode}</CodeBlockContent>
                </CodeBlock>
            </TabsContent>
            <TabsContent value="config">
                <CodeBlock>
                    <CodeBlockActions>
                        <CodeBlockCopyButton value={configJson} />
                    </CodeBlockActions>
                    <CodeBlockContent>{configJson}</CodeBlockContent>
                </CodeBlock>
            </TabsContent>
        </Tabs>
    ),
};

// ---- Syntax highlighting ----

export const SyntaxHighlighting: Story = {
    render: () => (
        <HighlightedBlock
            code={configJson}
            language="json"
            title="package.json"
        />
    ),
};

export const Languages: Story = {
    render: () => <LanguagesDemo />,
};

export const TerminalOutput: Story = {
    render: () => (
        <HighlightedBlock code={ansiOutput} language="ansi" title="vitest" />
    ),
};

export const Streaming: Story = {
    render: () => <StreamingDemo />,
};
