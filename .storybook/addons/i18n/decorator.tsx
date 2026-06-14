/* eslint-disable react-hooks/rules-of-hooks */
import type { ComponentType } from "react";
import type { Decorator } from "@storybook/react";
import { useEffect } from "react";
import { useGlobals } from "storybook/preview-api";
import { DEFAULT_LOCALE, I18N_GLOBAL_TYPE_ID, LOCALES } from "./constants";

export const withInternationalization: Decorator = (Story) => {
  const [globals] = useGlobals();
  const selectedLocale = (globals[I18N_GLOBAL_TYPE_ID] as string) || DEFAULT_LOCALE;

  useEffect(() => {
    const localeValue =
      selectedLocale === "Auto"
        ? typeof navigator !== "undefined"
          ? navigator.language
          : "en-US"
        : selectedLocale;

    const localeConfig =
      LOCALES.find((l) => l.value === localeValue) ||
      LOCALES.find((l) => l.value.startsWith((localeValue as string).split("-")[0])) ||
      LOCALES[0];

    if (localeConfig) {
      document.documentElement.lang = localeConfig.value;
      document.documentElement.dir = localeConfig.direction;
    }
  }, [selectedLocale]);

  const S = Story as ComponentType;
  return <S />;
};
