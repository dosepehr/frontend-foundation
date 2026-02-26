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
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/Textarea';
const page = () => {
    return (
        <>
            <ThemeChange />
    <div className="flex w-fit items-center gap-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
        </>
    );
};

export default page;

