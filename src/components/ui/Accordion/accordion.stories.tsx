import { Meta, StoryObj } from '@storybook/nextjs-vite';
import AccordionGroup from '.';
import { Accordion } from './components';
import { X } from '@/components/_icons';

type Story = StoryObj<typeof AccordionGroup>;

const meta: Meta<typeof AccordionGroup> = {
    title: 'components/Accordion',
    component: AccordionGroup,
    tags: ['autodocs'],
};

export default meta;

export const Default: Story = {
    render: () => (
        <Accordion type='single' collapsible className='space-y-10'>
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
    ),
};

export const MultipleOpen: Story = {
    render: () => (
        <Accordion type='multiple' className='space-y-10'>
            <AccordionGroup trigger='Question A' value='qa'>
                Detailed answer for question A.
            </AccordionGroup>
            <AccordionGroup trigger='Question B' value='qb'>
                Detailed answer for question B.
            </AccordionGroup>
            <AccordionGroup trigger='Question C' value='qc'>
                Detailed answer for question C.
            </AccordionGroup>
        </Accordion>
    ),
};

export const WithCustomStyling: Story = {
    render: () => (
        <Accordion type='single' collapsible className='space-y-10'>
            <AccordionGroup
                trigger='Styled Trigger'
                value='styled'
                itemClasses='border-2 border-primary rounded-lg px-4'
                triggerClasses='text-lg font-bold text-primary hover:text-primary/80'
                contentClasses='pt-4 text-muted-foreground'
            >
                This content has custom padding and text styling applied via the
                contentClasses prop.
            </AccordionGroup>
            <AccordionGroup trigger='Default Styling' value='default'>
                This item uses the default component styles.
            </AccordionGroup>
        </Accordion>
    ),
};

