/* eslint-disable react-hooks/rules-of-hooks */
import type { ComponentType } from "react";
import type { Decorator } from "@storybook/react";
import { useEffect } from "react";
import { addons, useGlobals } from "storybook/preview-api";
import { THEME_EVENT_NAME, THEME_GLOBAL_TYPE_ID, ensureThemeKey } from "./constants";

const updatePreviewTheme = (theme: string) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
};

export const withTheme: Decorator = (Story) => {
  const [globals] = useGlobals();
  const theme = ensureThemeKey(globals[THEME_GLOBAL_TYPE_ID] as string | undefined);

  useEffect(() => {
    updatePreviewTheme(theme);
    const channel = addons.getChannel();
    if (channel) channel.emit(THEME_EVENT_NAME, { theme });
  }, [theme]);

  useEffect(() => {
    const channel = addons.getChannel();
    const handleEvent = () => updatePreviewTheme(theme);
    channel.on("STORY_CHANGED", handleEvent);
    channel.on("SET_STORIES", handleEvent);
    return () => {
      channel.removeListener("STORY_CHANGED", handleEvent);
      channel.removeListener("SET_STORIES", handleEvent);
    };
  }, [theme]);

  const S = Story as ComponentType;
  return <S />;
};
