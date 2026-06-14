import type { Meta } from "@storybook/nextjs-vite";
import React, { useEffect, useRef, useState } from "react";

const meta: Meta = {
  title: "tokens/Colors",
  parameters: { layout: "fullscreen" },
  tags: ["!dev"],
};

export default meta;

const COLOR_GROUPS = [
  {
    title: "Base",
    colors: [
      { name: "Background",         variable: "--background" },
      { name: "Foreground",         variable: "--foreground" },
      { name: "Card",               variable: "--card" },
      { name: "Card Foreground",    variable: "--card-foreground" },
      { name: "Popover",            variable: "--popover" },
      { name: "Popover Foreground", variable: "--popover-foreground" },
      { name: "Muted",              variable: "--muted" },
      { name: "Muted Foreground",   variable: "--muted-foreground" },
      { name: "Border",             variable: "--border" },
      { name: "Input",              variable: "--input" },
      { name: "Ring",               variable: "--ring" },
    ],
  },
  {
    title: "Brand",
    colors: [
      { name: "Primary",              variable: "--primary" },
      { name: "Primary Foreground",   variable: "--primary-foreground" },
      { name: "Secondary",            variable: "--secondary" },
      { name: "Secondary Foreground", variable: "--secondary-foreground" },
      { name: "Accent",               variable: "--accent" },
      { name: "Accent Foreground",    variable: "--accent-foreground" },
    ],
  },
  {
    title: "Semantic",
    colors: [
      { name: "Destructive",        variable: "--destructive" },
      { name: "Success",            variable: "--success" },
      { name: "Success Foreground", variable: "--success-foreground" },
      { name: "Warning",            variable: "--warning" },
      { name: "Warning Foreground", variable: "--warning-foreground" },
      { name: "Info",               variable: "--info" },
      { name: "Info Foreground",    variable: "--info-foreground" },
    ],
  },
  {
    title: "Chart",
    colors: [
      { name: "Chart 1", variable: "--chart-1" },
      { name: "Chart 2", variable: "--chart-2" },
      { name: "Chart 3", variable: "--chart-3" },
      { name: "Chart 4", variable: "--chart-4" },
      { name: "Chart 5", variable: "--chart-5" },
    ],
  },
  {
    title: "Sidebar",
    colors: [
      { name: "Sidebar",                    variable: "--sidebar" },
      { name: "Sidebar Foreground",         variable: "--sidebar-foreground" },
      { name: "Sidebar Primary",            variable: "--sidebar-primary" },
      { name: "Sidebar Primary Foreground", variable: "--sidebar-primary-foreground" },
      { name: "Sidebar Accent",             variable: "--sidebar-accent" },
      { name: "Sidebar Accent Foreground",  variable: "--sidebar-accent-foreground" },
      { name: "Sidebar Border",             variable: "--sidebar-border" },
      { name: "Sidebar Ring",               variable: "--sidebar-ring" },
    ],
  },
] as const;

const ColorChip = ({ variable }: { variable: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (ref.current) {
      setValue(getComputedStyle(ref.current).getPropertyValue(variable).trim());
    }
  }, [variable]);

  return (
    <div
      ref={ref}
      className="size-10 shrink-0 rounded-lg"
      style={{ backgroundColor: `var(${variable})`, border: "1px solid var(--border)" }}
      title={value}
    />
  );
};

const ColorRow = ({ name, variable }: { name: string; variable: string }) => (
  <div className="flex items-center gap-3 border-b border-border py-3 last:border-0">
    <ColorChip variable={variable} />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-foreground">{name}</p>
      <code className="text-xs text-muted-foreground">{variable}</code>
    </div>
  </div>
);

const ColorGroup = ({
  title,
  colors,
}: {
  title: string;
  colors: ReadonlyArray<{ name: string; variable: string }>;
}) => (
  <div className="mb-8">
    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {title}
    </p>
    {colors.map((c) => (
      <ColorRow key={c.variable} name={c.name} variable={c.variable} />
    ))}
  </div>
);

const ThemePanel = ({ mode }: { mode: "light" | "dark" }) => (
  <div className={`${mode} flex flex-1 flex-col bg-background`}>
    <div className="sticky top-0 z-10 border-b border-border bg-background px-8 py-4">
      <span className="text-sm font-semibold text-foreground">
        {mode === "light" ? "Light" : "Dark"}
      </span>
    </div>
    <div className="p-8">
      {COLOR_GROUPS.map((group) => (
        <ColorGroup key={group.title} title={group.title} colors={group.colors} />
      ))}
    </div>
  </div>
);

export const AllColors = () => (
  <div className="flex min-h-screen">
    <ThemePanel mode="light" />
    <div className="w-px shrink-0 bg-border" />
    <ThemePanel mode="dark" />
  </div>
);
