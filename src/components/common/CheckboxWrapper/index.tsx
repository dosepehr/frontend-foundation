import { Checkbox } from '@/components/ui/Checkbox';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/Field';
import { FC } from 'react';
import { CheckboxWrapperProps } from './checkbox-wrapper.type';
const CheckboxWrapper: FC<CheckboxWrapperProps> = ({
    title,
    description,
    ...props
}) => {
    return (
        <FieldLabel className='cursor-pointer'>
            <Field orientation='horizontal'>
                <Checkbox {...props} />
                <FieldContent>
                    <FieldTitle>{title}</FieldTitle>
                    {description && (
                        <FieldDescription>{description} </FieldDescription>
                    )}
                </FieldContent>
            </Field>
        </FieldLabel>
    );
};

export default CheckboxWrapper;

