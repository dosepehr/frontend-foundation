import { X } from '@/components/_icons';
import ThemeChange from '@/components/common/ThemeChange';
import AccordionGroup from '@/components/ui/Accordion';
import { Accordion } from '@/components/ui/Accordion/components';
import AlertDialogGroup from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import { XIcon } from 'lucide-react';
const page = () => {
    return (
        <>
            <ThemeChange />
            <Accordion type='single' collapsible className='space-y-10' dir='rtl'>
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
        </>
    );
};

export default page;

