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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/OtpInput';
import SelectField from '@/components/ui/Select';
import SelectGroup from '@/components/ui/Select';
import { SelectTrigger } from '@/components/ui/Select/components';
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/Textarea';
const page = () => {
    return (
        <>
            <ThemeChange />

            <div className='py-20'>
                <SelectField
                    id='theme-select'
                    label='Theme'
                    description='Choose your preferred theme'
                    placeholder='Select a theme'
                    options={[
                        { label: 'Light', value: 'light' },
                        { label: 'Dark', value: 'dark' },
                        { label: 'System', value: 'system', disabled: true },
                    ]}
                    onValueChange={(val) => console.log(val)}
                    required
                />
            </div>
        </>
    );
};

export default page;

