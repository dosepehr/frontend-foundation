/* eslint-disable react-hooks/rules-of-hooks */
import type { ComponentType } from "react";
import type { Decorator } from "@storybook/react";
import { useEffect } from "react";
import { scan } from "react-scan";
import { useGlobals } from "storybook/preview-api";
import { REACT_SCAN_GLOBAL_TYPE_ID } from "./constants";

export const withReactScan: Decorator = (Story) => {
  const [globals] = useGlobals();
  const isEnabled = globals[REACT_SCAN_GLOBAL_TYPE_ID] === "true";

  useEffect(() => {
    scan({ enabled: isEnabled });
  }, [isEnabled]);

  const S = Story as ComponentType;
  return <S />;
};
