'use client';
import { Checkbox } from '@/components/ui/Checkbox';
import { ComboboxPopup } from '@/components/ui/ComboBox';
import { Label } from '@/components/ui/Label';
const page = () => {
    return (
        <>
            <div className='flex gap-2'>
                <Checkbox id='terms' checked='indeterminate' />
                <Label htmlFor='terms'>Accept terms and conditions</Label>
            </div>
            <ComboboxPopup />
        </>
    );
};

export default page;

