'use client';
import ThemeChange from '@/components/common/ThemeChange';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
const page = () => {
    return (
        <>
            <ThemeChange />
            <div className='max-w-40 mx-40 w-full'>
                <Textarea
                    label='name'
                    id='name'
                    required
                    description='llf'
                    placeholder='fkfk'
                />
            </div>
        </>
    );
};

export default page;

