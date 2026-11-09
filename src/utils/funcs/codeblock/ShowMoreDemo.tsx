'use client';

import Button from '@/components/ui/Button';
import CodeBlock, {
    CodeBlockContent,
    CodeBlockFooter,
} from '@/components/ui/CodeBlock';
import { useId, useState } from 'react';
import { longFile } from './codeSamples';

const ShowMoreDemo = ({
    expandedClassName,
}: {
    expandedClassName?: string;
}) => {
    const [expanded, setExpanded] = useState(false);
    const id = useId();
    return (
        <CodeBlock>
            <CodeBlockContent
                id={id}
                lineNumbers
                className={
                    expanded
                        ? expandedClassName
                        : 'max-h-64 scroll-fade-y overflow-y-hidden'
                }
            >
                {longFile}
            </CodeBlockContent>
            <CodeBlockFooter className="justify-center">
                <Button
                    variant="ghost"
                    size="xs"
                    aria-expanded={expanded}
                    aria-controls={id}
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'Show less' : 'Show more'}
                </Button>
            </CodeBlockFooter>
        </CodeBlock>
    );
};

export default ShowMoreDemo;
