import type { Preview } from "@storybook/nextjs-vite";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { withInternationalization } from "./addons/i18n/decorator";
import { i18nGlobalType } from "./addons/i18n/preview";
import { withReactScan } from "./addons/react-scan/decorator";
import { reactScanGlobalType } from "./addons/react-scan/preview";
import { withReduceMotion } from "./addons/reduce-motion/decorator";
import { reduceMotionGlobalType } from "./addons/reduce-motion/preview";
import { withReactStrictMode } from "./addons/strict-mode/decorator";
import { strictModeGlobalType } from "./addons/strict-mode/preview";
import { withTheme } from "./addons/theme/decorator";
import { themeGlobalType } from "./addons/theme/preview";
import { DocsContainer } from "./components/docs-container";
import Toaster from "../src/components/ui/Toast";

import "./fonts.css";
import "../src/app/globals.css";

let toasterMounted = false;

function GlobalToaster() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (toasterMounted) return;
    toasterMounted = true;
    const el = document.createElement("div");
    el.id = "storybook-toaster-root";
    document.body.appendChild(el);
    ref.current = el;
    return () => {
      toasterMounted = false;
      el.remove();
    };
  }, []);

  if (typeof document === "undefined") return null;
  const container = document.getElementById("storybook-toaster-root");
  if (!container) return null;
  return createPortal(<Toaster position="bottom-right" />, container);
}

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    grid: {
      cellSize: 8,
      opacity: 0.4,
      cellAmount: 4,
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Welcome", "UI", "tokens"],
      },
    },
    docs: {
      container: DocsContainer,
    },
    viewport: {
      options: {
        xs: {
          name: "XS — Mobile S",
          styles: { width: "375px", height: "667px" },
        },
        sm: {
          name: "SM — Mobile L (640px)",
          styles: { width: "640px", height: "900px" },
        },
        md: {
          name: "MD — Tablet (768px)",
          styles: { width: "768px", height: "1024px" },
        },
        lg: {
          name: "LG — Laptop (1024px)",
          styles: { width: "1024px", height: "768px" },
        },
        xl: {
          name: "XL — Desktop (1280px)",
          styles: { width: "1280px", height: "800px" },
        },
        "2xl": {
          name: "2XL — Wide (1536px)",
          styles: { width: "1536px", height: "900px" },
        },
      },
    },
  },
  decorators: [
    withReactStrictMode,
    withTheme,
    withInternationalization,
    withReduceMotion,
    withReactScan,
    (Story) => (
      <>
        <GlobalToaster />
        <Story />
      </>
    ),
  ],
  globalTypes: {
    ...themeGlobalType,
    ...i18nGlobalType,
    ...reduceMotionGlobalType,
    ...strictModeGlobalType,
    ...reactScanGlobalType,
  },
  tags: ["autodocs"],
};

export default preview;
