import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Popover, {
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '.';
import Button from '../Button';
import { FieldGroup } from '../Field';
import Input from '../Input';

const meta: Meta<typeof Popover> = {
    title: 'UI/Popover',
    component: Popover,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Basic: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Dimensions</PopoverTitle>
                    <PopoverDescription>
                        Set the dimensions for the layer.
                    </PopoverDescription>
                </PopoverHeader>
            </PopoverContent>
        </Popover>
    ),
};

export const Align: Story = {
    render: () => (
        <div className="flex gap-4">
            {(['start', 'center', 'end'] as const).map((align) => (
                <Popover key={align}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="capitalize">
                            {align}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align={align} className="w-48">
                        <PopoverHeader>
                            <PopoverTitle className="capitalize">
                                {align}
                            </PopoverTitle>
                            <PopoverDescription>
                                Aligned to the {align} of the trigger.
                            </PopoverDescription>
                        </PopoverHeader>
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Edit dimensions</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 gap-4">
                <PopoverHeader>
                    <PopoverTitle>Dimensions</PopoverTitle>
                    <PopoverDescription>
                        Set the dimensions for the layer.
                    </PopoverDescription>
                </PopoverHeader>
                <FieldGroup>
                    <Input
                        label="Width"
                        placeholder="Enter the width"
                        defaultValue="100%"
                    />
                    <Input
                        label="Height"
                        placeholder="Enter the height"
                        defaultValue="25px"
                    />
                </FieldGroup>
                <Button size="sm">Save</Button>
            </PopoverContent>
        </Popover>
    ),
};

export const Rtl: Story = {
    name: 'RTL',
    render: () => (
        <div dir="rtl">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">باز کردن</Button>
                </PopoverTrigger>
                <PopoverContent dir="rtl" align="start">
                    <PopoverHeader>
                        <PopoverTitle>ابعاد</PopoverTitle>
                        <PopoverDescription>
                            ابعاد لایه را تنظیم کنید.
                        </PopoverDescription>
                    </PopoverHeader>
                </PopoverContent>
            </Popover>
        </div>
    ),
};
