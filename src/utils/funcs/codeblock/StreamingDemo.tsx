'use client';

import { useEffect, useState } from 'react';
import { componentCode } from './codeSamples';
import HighlightedBlock from './HighlightedBlock';

// Types the sample out a few characters at a time, then starts over.
const StreamingDemo = () => {
    const [length, setLength] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setLength((current) =>
                current >= componentCode.length ? 0 : current + 4,
            );
        }, 40);
        return () => clearInterval(timer);
    }, []);
    return (
        <HighlightedBlock
            code={componentCode.slice(0, length)}
            language="tsx"
            title="Streaming…"
        />
    );
};

export default StreamingDemo;
