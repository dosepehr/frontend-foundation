'use client';

import Button from '@/components/ui/Button';
import CodeBlock, {
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockTitle,
} from '@/components/ui/CodeBlock';
import { WrapTextIcon } from 'lucide-react';
import { useState } from 'react';
import { longLine } from './codeSamples';

const WrapToggleDemo = () => {
    const [wrap, setWrap] = useState(false);
    return (
        <CodeBlock>
            <CodeBlockHeader>
                <CodeBlockTitle>error.log</CodeBlockTitle>
                <CodeBlockActions>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Wrap lines"
                        aria-pressed={wrap}
                        onClick={() => setWrap(!wrap)}
                    >
                        <WrapTextIcon />
                    </Button>
                    <CodeBlockCopyButton value={longLine} />
                </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent wrap={wrap}>{longLine}</CodeBlockContent>
        </CodeBlock>
    );
};

export default WrapToggleDemo;
