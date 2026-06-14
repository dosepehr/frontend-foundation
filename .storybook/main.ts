import type { StorybookConfig } from "@storybook/nextjs-vite";
import { join as pathJoin, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
    "@chromatic-com/storybook",
    "storybook-addon-pseudo-states",
    "storybook-addon-grid",
  ],
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
    enableCrashReports: false,
  },
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: [pathJoin(__dirname, "../public")],
  stories: [
    "./welcome.mdx",
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
  ],
};

export default config;
