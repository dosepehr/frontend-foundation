import AlertDialogGroup from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';

const page = () => {
    return (
        <>
            <AlertDialogGroup
                trigger={<Button variant={'secondary'}>Show</Button>}
                title='sure?'
                description={<div>hi</div>}
            >
                fkfkfkf
                <input />
            </AlertDialogGroup>
        </>
    );
};

export default page;

