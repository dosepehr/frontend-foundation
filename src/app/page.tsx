import AccordionGroup from '@/components/ui/Accordion';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/Accordion/components';

const page = () => {
    return (
        <Accordion
            type='single'
            collapsible
            defaultValue='shipping'
        >
            <AccordionGroup value='shipping' trigger={<p>trigger</p>}>
                Returns accepted within 30 days. Items must be unused and in
                original packaging. Refunds processed within 5-7 business days.
            </AccordionGroup>
            <AccordionItem value='returns'>
                <AccordionTrigger>What is your return policy?</AccordionTrigger>
                <AccordionContent>
                    Returns accepted within 30 days. Items must be unused and in
                    original packaging. Refunds processed within 5-7 business
                    days.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='support'>
                <AccordionTrigger>
                    How can I contact customer support?
                </AccordionTrigger>
                <AccordionContent>
                    Reach us via email, live chat, or phone. We respond within
                    24 hours during business days.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default page;

