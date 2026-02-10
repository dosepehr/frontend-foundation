import AlertGroup from '@/components/ui/Alert';

import { CheckCircle2Icon } from 'lucide-react';

const page = () => {
    return (
        <div className='grid w-full max-w-md items-start gap-4'>
            <AlertGroup title='fkfkkf' Icon={CheckCircle2Icon}>
                Your payment of $29.99 has been processed. A receipt has been
                sent to your email address.
            </AlertGroup>
        </div>
    );
};

export default page;

