import type { Preview } from "@storybook/react";
import { DocsContainer as StorybookDocsContainer } from "@storybook/addon-docs/blocks";
import React, { useEffect, useMemo, useState } from "react";
import { addons } from "storybook/preview-api";
import {
  DEFAULT_THEME,
  THEME_EVENT_NAME,
  THEME_GLOBAL_TYPE_ID,
  ensureThemeKey,
} from "../addons/theme/constants";
import { themes } from "../styles/theme";

export const DocsContainer: NonNullable<Preview["parameters"]>["docs"]["container"] = ({
  children,
  context,
}) => {
  const initialTheme = useMemo(
    () =>
      ensureThemeKey(
        (context?.globals?.[THEME_GLOBAL_TYPE_ID] as string | undefined) || undefined,
      ),
    [context?.globals],
  );
  const [themeKey, setThemeKey] = useState<string>(initialTheme);

  useEffect(() => {
    const next = ensureThemeKey(
      (context?.globals?.[THEME_GLOBAL_TYPE_ID] as string | undefined) || undefined,
    );
    setThemeKey((prev) => (prev === next ? prev : next));
  }, [context?.globals]);

  useEffect(() => {
    const channel = addons.getChannel();
    const handleThemeChange = (event: { theme: string }) => {
      const next = ensureThemeKey(event.theme);
      setThemeKey((prev) => (prev === next ? prev : next));
    };
    channel.on(THEME_EVENT_NAME, handleThemeChange);
    return () => {
      channel.off(THEME_EVENT_NAME, handleThemeChange);
    };
  }, []);

  const selectedTheme = themes[themeKey as keyof typeof themes] || themes[DEFAULT_THEME];

  return (
    <StorybookDocsContainer context={context} theme={selectedTheme}>
      {children}
    </StorybookDocsContainer>
  );
};
