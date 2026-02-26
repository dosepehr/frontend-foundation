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
import SelectGroup from '@/components/ui/Select';
import { SelectTrigger } from '@/components/ui/Select/components';
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/Textarea';
const page = () => {
    return (
        <>
            <ThemeChange />

            <div className='py-20'>
                <SelectGroup />
            </div>
        </>
    );
};

export default page;

