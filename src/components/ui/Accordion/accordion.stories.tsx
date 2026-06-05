import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Card/components';
import AccordionWrapper from '.';

const meta: Meta<typeof AccordionWrapper> = {
    title: 'UI/Accordion',
    component: AccordionWrapper,
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'Unique identifier for the accordion item',
        },
        trigger: {
            control: 'text',
            description: 'Content rendered in the trigger button',
        },
        children: {
            control: 'text',
            description: 'Content rendered inside the accordion panel',
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the accordion item',
        },
        className: {
            control: 'text',
            description: 'Class names applied to the accordion item',
        },
        triggerProps: {
            control: 'object',
            description: 'Props passed to the trigger element',
        },
        contentProps: {
            control: 'object',
            description: 'Props passed to the content element',
        },
        itemProps: {
            control: 'object',
            description: 'Props passed to the accordion item element',
        },
    },
};

export default meta;
type Story = StoryObj<typeof AccordionWrapper>;

export const Single: Story = {
    render: (args) => (
        <Accordion type='single' collapsible defaultValue='item-1'>
            <AccordionWrapper {...args} />
        </Accordion>
    ),
    args: {
        value: 'item-1',
        trigger: 'Is it accessible?',
        children: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
};

export const Multiple: Story = {
    render: () => (
        <Accordion type='single' collapsible defaultValue='item-1' className='space-y-2'>
            <AccordionWrapper value='item-1' trigger='Is it accessible?'>
                Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionWrapper>
            <AccordionWrapper value='item-2' trigger='Is it styled?'>
                Yes. It comes with default styles that match your design system.
            </AccordionWrapper>
            <AccordionWrapper value='item-3' trigger='Is it animated?'>
                Yes. It uses CSS animations for smooth open and close transitions.
            </AccordionWrapper>
        </Accordion>
    ),
    args: {},
};

export const WithCustomClasses: Story = {
    render: () => (
        <Accordion type='single' collapsible defaultValue='item-1'>
            <AccordionWrapper
                value='item-1'
                trigger='Custom styled item'
                className='rounded-lg border px-4'
                triggerProps={{ className: 'font-bold text-base' }}
                contentProps={{ className: 'text-muted-foreground' }}
            >
                This item has custom classes on the item, trigger, and content.
            </AccordionWrapper>
        </Accordion>
    ),
    args: {},
};

export const Disabled: Story = {
    render: () => (
        <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='item-1'>
                <AccordionTrigger>Can I access my account history?</AccordionTrigger>
                <AccordionContent>
                    Yes, you can view your complete account history including all transactions,
                    plan changes, and support tickets in the Account History section of your dashboard.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2' disabled>
                <AccordionTrigger>Premium feature information</AccordionTrigger>
                <AccordionContent>
                    This section contains information about premium features. Upgrade your plan to access this content.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
                <AccordionTrigger>How do I update my email address?</AccordionTrigger>
                <AccordionContent>
                    You can update your email address in your account settings. You&apos;ll receive a
                    verification email at your new address to confirm the change.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
    args: {},
};

export const Borders: Story = {
    render: () => (
        <Accordion type='single' collapsible className='max-w-lg rounded-lg border' defaultValue='billing'>
            {[
                { value: 'billing', trigger: 'How does billing work?', content: 'We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can cancel anytime.' },
                { value: 'security', trigger: 'Is my data secure?', content: 'Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits.' },
                { value: 'integration', trigger: 'What integrations do you support?', content: 'We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more.' },
            ].map((item) => (
                <AccordionItem key={item.value} value={item.value} className='border-b px-4 last:border-b-0'>
                    <AccordionTrigger>{item.trigger}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    ),
    args: {},
};

export const MultipleOpen: Story = {
    render: () => (
        <Accordion type='multiple' defaultValue={['item-1', 'item-2']} className='w-full'>
            <AccordionWrapper value='item-1' trigger='Is it accessible?'>
                Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionWrapper>
            <AccordionWrapper value='item-2' trigger='Is it styled?'>
                Yes. It comes with default styles that match your design system.
            </AccordionWrapper>
            <AccordionWrapper value='item-3' trigger='Is it animated?'>
                Yes. It uses CSS animations for smooth open and close transitions.
            </AccordionWrapper>
        </Accordion>
    ),
    args: {},
};

export const WithCard: Story = {
    render: () => (
        <Card className='w-full max-w-sm'>
            <CardHeader>
                <CardTitle>Subscription &amp; Billing</CardTitle>
                <CardDescription>
                    Common questions about your account, plans, payments and cancellations.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type='single' collapsible defaultValue='plans'>
                    {[
                        { value: 'plans', trigger: 'What subscription plans do you offer?', content: 'We offer three tiers: Starter ($9/mo), Professional ($29/mo), and Enterprise ($99/mo).' },
                        { value: 'billing', trigger: 'How does billing work?', content: "Billing occurs automatically at the start of each billing cycle. You'll receive an invoice via email after each payment." },
                        { value: 'cancel', trigger: 'How do I cancel my subscription?', content: 'You can cancel anytime from your account settings. Your access continues until the end of the billing period.' },
                    ].map((item) => (
                        <AccordionItem key={item.value} value={item.value}>
                            <AccordionTrigger>{item.trigger}</AccordionTrigger>
                            <AccordionContent>{item.content}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    ),
    args: {},
};
