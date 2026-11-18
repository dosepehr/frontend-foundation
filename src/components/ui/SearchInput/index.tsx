/* c8 ignore start */
'use client';
/* c8 ignore stop */

import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useControllableState } from '@/hooks/useControllableState';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { cn } from '@/utils/funcs/cn';
import { toLatinDigits } from '@/utils/funcs/numberFormat';
import { assignRef } from '@/utils/funcs/refs';
import { SearchIcon, XIcon } from 'lucide-react';
import {
    useCallback,
    useRef,
    type ChangeEvent,
    type KeyboardEvent,
} from 'react';
import type { SearchInputProps } from './SearchInput.types';

const SearchInput = ({
    value,
    defaultValue = '',
    onValueChange,
    onSearch,
    debounceMs = 300,
    isLoading = false,
    clearLabel = 'Clear search',
    searchLabel = 'Search',
    normalizeDigits = true,
    placeholder = 'Search',
    disabled,
    readOnly,
    className,
    onKeyDown,
    ref,
    ...props
}: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const setInputRef = useCallback(
        (node: HTMLInputElement | null) => {
            inputRef.current = node;
            assignRef(ref, node);
        },
        [ref],
    );
    const [text, setText] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });
    // Reads the latest text when it fires, so a value cleared or replaced
    // from outside in the meantime is what gets searched.
    const search = useDebouncedCallback(() => onSearch?.(text), debounceMs);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setText(normalizeDigits ? toLatinDigits(next) : next);
        search.run();
    };

    const clear = () => {
        setText('');
        search.cancel();
        onSearch?.('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'Enter') {
            search.cancel();
            onSearch?.(text);
        } else if (event.key === 'Escape' && text) {
            event.preventDefault();
            clear();
        }
    };

    const canClear = !!text && !disabled && !readOnly;

    return (
        <Input
            {...props}
            ref={setInputRef}
            type="search"
            role="searchbox"
            autoComplete="off"
            placeholder={placeholder}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            readOnly={readOnly}
            aria-busy={isLoading || undefined}
            className={cn(
                '[&::-webkit-search-cancel-button]:appearance-none',
                className,
            )}
            endAddon={
                isLoading ? (
                    <Spinner aria-label="Loading" />
                ) : (
                    // One button at the end: search (focuses the box) while
                    // empty, clear once there is text.
                    <button
                        type="button"
                        data-slot="search-input-action"
                        disabled={disabled}
                        onClick={
                            canClear ? clear : () => inputRef.current?.focus()
                        }
                        aria-label={canClear ? clearLabel : searchLabel}
                        className="-ms-2 -me-2.5 flex items-center self-stretch ps-2 pe-2.5 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
                    >
                        {canClear ? (
                            <XIcon aria-hidden className="size-4" />
                        ) : (
                            <SearchIcon aria-hidden className="size-4" />
                        )}
                    </button>
                )
            }
        />
    );
};

export default SearchInput;
