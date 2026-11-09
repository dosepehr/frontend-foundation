import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Field, {
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from '.';
import Button from '../Button';
import Input from '../Input';
import { Switch } from '../Switch/components';
import Textarea from '../Textarea';

const meta: Meta<typeof Field> = {
    title: 'UI/Field',
    component: Field,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const FormLayout: Story = {
    render: () => (
        <form className="flex flex-col gap-8">
            <FieldSet>
                <FieldLegend>Profile</FieldLegend>
                <FieldDescription>
                    This information is shown on your public profile.
                </FieldDescription>
                <FieldGroup>
                    <Input
                        label="Full name"
                        placeholder="Enter the full name"
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter the email"
                    />
                    <Textarea label="Bio" placeholder="Enter the bio" />
                </FieldGroup>
            </FieldSet>
            <Button type="submit">Save</Button>
        </form>
    ),
};

export const HorizontalField: Story = {
    render: () => (
        <FieldGroup>
            <Field orientation="horizontal">
                <FieldLabel htmlFor="field-marketing">
                    Marketing emails
                </FieldLabel>
                <Switch id="field-marketing" />
            </Field>
            <FieldSeparator />
            <Field orientation="horizontal">
                <FieldLabel htmlFor="field-security">
                    Security alerts
                </FieldLabel>
                <Switch id="field-security" defaultChecked />
            </Field>
        </FieldGroup>
    ),
};
