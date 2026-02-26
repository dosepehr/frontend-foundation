'use client';
import CheckboxWrapper from '@/components/common/CheckboxWrapper';
import ThemeChange from '@/components/common/ThemeChange';
import { Checkbox } from '@/components/ui/Checkbox';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/Field';
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
            <CheckboxWrapper title='fff' id='1' description='kfkf' />
        </>
    );
};

export default page;

