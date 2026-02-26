import { Switch } from '@/components/ui/Switch';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/Field';
import { FC } from 'react';
import { SwitchWrapperProps } from './switch-wrapper.type';

const SwitchWrapper: FC<SwitchWrapperProps> = ({
    title,
    description,
    ...props
}) => {
    return (
        <FieldLabel className='cursor-pointer'>
            <Field orientation='horizontal'>
                <Switch {...props} />
                <FieldContent>
                    <FieldTitle>{title}</FieldTitle>
                    {description && (
                        <FieldDescription>{description}</FieldDescription>
                    )}
                </FieldContent>
            </Field>
        </FieldLabel>
    );
};

export default SwitchWrapper;

