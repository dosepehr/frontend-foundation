import React from 'react';
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectContainer,
    SelectItem,
} from './components';

const SelectGroup = () => {
    return (
        <Select>
            <SelectTrigger className='w-full'>
                <SelectValue placeholder='Theme' />
            </SelectTrigger>
            <SelectContent position='popper'>
                <SelectContainer>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                </SelectContainer>
            </SelectContent>
        </Select>
    );
};

export default SelectGroup;

