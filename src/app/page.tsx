'use client';
import ThemeChange from '@/components/common/ThemeChange';
import { Button } from '@/components/ui/Button';
import CardGroup from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const Page = () => {
    return (
        <>
            <ThemeChange />
            <CardGroup
                title='title'
                description='description'
                action={{
                    label: 'text',
                    onClick: () => console.log('object'),
                }}
                footer={
                    <div className='w-full'>
                        <Button className='w-full'>f</Button>
                    </div>
                }
            >
                <Input />
            </CardGroup>
        </>
    );
};

export default Page;

