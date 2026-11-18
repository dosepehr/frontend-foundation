/* eslint-disable react-hooks/rules-of-hooks */
import type { Decorator } from '@storybook/react';
import type { ComponentType } from 'react';
import { useEffect } from 'react';
import { DEFAULT_LOCALE, I18N_GLOBAL_TYPE_ID, LOCALES } from './constants';

function resolveLocale(selected: unknown) {
    const value = (selected as string) || DEFAULT_LOCALE;
    const localeValue =
        value === 'Auto'
            ? typeof navigator !== 'undefined'
                ? navigator.language
                : 'en-US'
            : value;

    return (
        LOCALES.find((l) => l.value === localeValue) ||
        LOCALES.find((l) => l.value.startsWith(localeValue.split('-')[0])) ||
        LOCALES[0]
    );
}

export const withInternationalization: Decorator = (Story, context) => {
    const storyLocale = resolveLocale(context.globals[I18N_GLOBAL_TYPE_ID]);
    // A docs page renders every story in one document, so a story's own
    // locale (e.g. `globals: { i18n: 'fa-IR' }`) must not flip the whole page:
    // the page follows the toolbar and such a story is wrapped instead.
    const isDocs = context.viewMode === 'docs';
    const pageLocale = isDocs
        ? resolveLocale(context.userGlobals?.[I18N_GLOBAL_TYPE_ID])
        : storyLocale;

    useEffect(() => {
        document.documentElement.lang = pageLocale.value;
        document.documentElement.dir = pageLocale.direction;
    }, [pageLocale.value, pageLocale.direction]);

    const S = Story as ComponentType;
    if (storyLocale.value === pageLocale.value) return <S />;

    return (
        <div lang={storyLocale.value} dir={storyLocale.direction}>
            <S />
        </div>
    );
};
