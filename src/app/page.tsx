import { X } from '@/components/_icons';
import ThemeChange from '@/components/common/ThemeChange';
import AlertDialogGroup from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import { XIcon } from 'lucide-react';
const page = () => {
    return (
        <>
            <ThemeChange />
            <AlertDialogGroup
                trigger={<Button variant={'secondary'}>Show</Button>}
                title='sure?'
                description={<div>hi</div>}
            >
                <input />
            </AlertDialogGroup>
            <X />
            <XIcon />
        </>
    );
};

export default page;

