import { useMemo } from 'react';

type Option = {
    value: string;
    label: string;
};

type ValuePrimitive = string | number | boolean;

interface UseOptionsConfig<
    TItem extends { id: ValuePrimitive; title: string },
    TValue extends ValuePrimitive = TItem['id'],
    TLabel extends string = TItem['title'],
> {
    valueAccessor?: (item: TItem) => TValue;
    labelAccessor?: (item: TItem) => TLabel;
    metaAccessor?: (item: TItem) => Partial<Omit<Option, 'value' | 'label'>>;
    filter?: (item: TItem) => boolean;
    sort?: (a: TItem, b: TItem) => number;
    transform?: (item: TItem, index: number) => TItem;
    includeEmptyOption?: {
        value: ValuePrimitive;
        label: string;
        meta?: Partial<Omit<Option, 'value' | 'label'>>;
    };
}

export const useOptions = <
    TItem extends { id: ValuePrimitive; title: string },
    TValue extends ValuePrimitive = TItem['id'],
    TLabel extends string = TItem['title'],
>(
    data: TItem[] = [],
    {
        valueAccessor,
        labelAccessor,
        metaAccessor,
        filter,
        sort,
        transform,
        includeEmptyOption,
    }: UseOptionsConfig<TItem, TValue, TLabel> = {},
): Option[] =>
    useMemo(() => {
        const resolvedValue =
            valueAccessor ?? ((item: TItem) => item.id as TValue);
        const resolvedLabel =
            labelAccessor ?? ((item: TItem) => item.title as TLabel);

        const transformed = transform
            ? data.map((item, index) => transform(item, index))
            : data;
        const filtered = filter ? transformed.filter(filter) : transformed;
        const sorted = sort ? [...filtered].sort(sort) : filtered;

        const options = sorted.map<Option>((item) => ({
            value: String(resolvedValue(item)),
            label: resolvedLabel(item),
            ...metaAccessor?.(item),
        }));

        return includeEmptyOption
            ? [
                  {
                      value: String(includeEmptyOption.value),
                      label: includeEmptyOption.label,
                      ...includeEmptyOption.meta,
                  },
                  ...options,
              ]
            : options;
    }, [
        data,
        valueAccessor,
        labelAccessor,
        metaAccessor,
        filter,
        sort,
        transform,
        includeEmptyOption,
    ]);
