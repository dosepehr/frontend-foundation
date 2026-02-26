import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components';

type TabItem = {
    value: string;
    label: string;
    content: React.ReactNode;
};

type TabsGroupProps = {
    tabs: TabItem[];
    defaultValue?: string;
    className?: string;
};

const TabsGroup = ({ tabs, defaultValue, className }: TabsGroupProps) => {
    const activeDefault = defaultValue ?? tabs[0]?.value;

    return (
        <Tabs defaultValue={activeDefault} className={className}>
            <TabsList variant={'line'} >
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default TabsGroup;

