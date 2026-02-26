import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectContainer,
    SelectItem,
} from './components';
import { Field, FieldDescription, FieldLabel } from '../Field';
import { SelectFieldProps } from './select.props';

const SelectGroup = ({
    id,
    label,
    description,
    placeholder = 'Select an option',
    options,
    value,
    defaultValue,
    onValueChange,
    required = false,
    disabled = false,
    size = 'default',
    className,
}: SelectFieldProps) => {
    return (
        <Field>
            {label && (
                <FieldLabel
                    htmlFor={id}
                    required={required}
                    disabled={disabled}
                >
                    {label}
                </FieldLabel>
            )}

            <Select
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                disabled={disabled}
                required={required}
            >
                <SelectTrigger
                    id={id}
                    size={size}
                    className={className ?? 'w-full'}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent position='popper'>
                    <SelectContainer>
                        {options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContainer>
                </SelectContent>
            </Select>

            {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
    );
};

export default SelectGroup;

