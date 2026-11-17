'use client';

import Tabs, { TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useState } from 'react';
import { languageSamples } from '../codeSamples/codeSamples';
import HighlightedBlock from '../HighlightedBlock/HighlightedBlock';

const LanguagesDemo = () => {
    const [language, setLanguage] = useState('tsx');
    return (
        <div className="flex flex-col gap-3">
            <Tabs value={language} onValueChange={setLanguage}>
                <TabsList>
                    {Object.keys(languageSamples).map((name) => (
                        <TabsTrigger key={name} value={name}>
                            {name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <HighlightedBlock
                code={languageSamples[language]}
                language={language}
            />
        </div>
    );
};

export default LanguagesDemo;
