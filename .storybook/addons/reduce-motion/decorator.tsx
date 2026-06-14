/* eslint-disable react-hooks/rules-of-hooks */
import type { ComponentType } from "react";
import type { Decorator } from "@storybook/react";
import { useEffect } from "react";
import { useGlobals } from "storybook/preview-api";
import { REDUCE_MOTION_GLOBAL_TYPE_ID } from "./constants";

export const withReduceMotion: Decorator = (Story) => {
  const [globals] = useGlobals();
  const reduceMotion = globals[REDUCE_MOTION_GLOBAL_TYPE_ID] === "true";

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.setAttribute("data-reduce-motion", "true");
    } else {
      document.documentElement.removeAttribute("data-reduce-motion");
    }
  }, [reduceMotion]);

  const S = Story as ComponentType;
  return <S />;
};
