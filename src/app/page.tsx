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
            <Field className='w-fit'>
                <FieldLabel htmlFor='digits-only' required>
                    Digits Only
                </FieldLabel>
                <InputOTP id='digits-only' maxLength={6}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </Field>
        </>
    );
};

export default page;

