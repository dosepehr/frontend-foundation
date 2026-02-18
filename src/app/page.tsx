import ThemeChange from '@/components/common/ThemeChange';
import AlertDialogGroup from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';

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
        </>
    );
};

export default page;

