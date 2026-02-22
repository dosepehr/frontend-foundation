import { X } from '@/components/_icons';
import ThemeChange from '@/components/common/ThemeChange';
import AccordionGroup from '@/components/ui/Accordion';
import { Accordion } from '@/components/ui/Accordion/components';
import AlertGroup from '@/components/ui/Alert';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert/components';
import AlertDialogGroup from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import { CheckCircle2Icon, InfoIcon, XIcon } from 'lucide-react';
const page = () => {
    return (
        <>
            <ThemeChange />
            <Accordion
                type='single'
                collapsible
                className='space-y-10'
                dir='rtl'
            >
                <AccordionGroup trigger='question 1' value='q1'>
                    answer 1
                </AccordionGroup>
                <AccordionGroup trigger='question 2' value='q2'>
                    answer 2
                </AccordionGroup>
                <AccordionGroup trigger='question 3' value='q3'>
                    answer 3
                </AccordionGroup>
            </Accordion>
            <AlertGroup variant='info' title='Heads up'>
                You can change your settings in the profile page.
            </AlertGroup>
            <Alert>
                <CheckCircle2Icon />
                <AlertTitle>Payment successful</AlertTitle>
                <AlertDescription>
                    Your payment of $29.99 has been processed. A receipt has
                    been sent to your email address.
                </AlertDescription>
            </Alert>
            <Alert>
                <InfoIcon />
                <AlertTitle>New feature available</AlertTitle>
                <AlertDescription>
                    We&apos;ve added dark mode support. You can enable it in
                    your account settings.
                </AlertDescription>
            </Alert>
        </>
    );
};

export default page;

