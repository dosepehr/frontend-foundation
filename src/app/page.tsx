import ThemeChange from '@/components/common/ThemeChange';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
const page = () => {
    return (
        <>
            <ThemeChange />
            <div className='flex gap-2'>
                <Checkbox id='terms' checked='indeterminate' />
                <Label htmlFor='terms'>Accept terms and conditions</Label>
            </div>
        </>
    );
};

export default page;

