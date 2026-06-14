import { addons } from "storybook/manager-api";
import { DEFAULT_THEME, THEME_EVENT_NAME, THEME_GLOBAL_TYPE_ID, ensureThemeKey } from "./constants";
import { themes } from "../../styles/theme";

addons.register("theme-manager", (api) => {
  let lastTheme = DEFAULT_THEME;

  const applyTheme = (theme: string) => {
    const next = ensureThemeKey(theme);
    lastTheme = next;
    // setConfig merges — only override the theme key
    addons.setConfig({ theme: themes[next] });
  };

  const init = () => {
    const channel = api.getChannel() ?? addons.getChannel();
    if (!channel) {
      setTimeout(init, 100);
      return;
    }

    applyTheme(DEFAULT_THEME);

    channel.on(THEME_EVENT_NAME, (event: { theme: string }) => applyTheme(event?.theme));
    channel.on("GLOBALS_UPDATED", (payload: { globals?: Record<string, unknown> }) => {
      const theme = payload?.globals?.[THEME_GLOBAL_TYPE_ID] as string | undefined;
      if (theme) applyTheme(theme);
    });

    const replayEvents = [
      "STORIES_CONFIGURED",
      "SET_STORIES",
      "SELECT_STORY",
      "STORY_RENDERED",
      "DOCS_RENDERED",
    ] as const;
    replayEvents.forEach((e) => channel.on(e, () => applyTheme(lastTheme)));
  };

  init();
});
