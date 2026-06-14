/* eslint-disable react-hooks/rules-of-hooks */
import type { ComponentType } from "react";
import type { Decorator } from "@storybook/react";
import { StrictMode } from "react";
import { useGlobals } from "storybook/preview-api";
import { STRICT_MODE_GLOBAL_TYPE_ID } from "./constants";

export const withReactStrictMode: Decorator = (Story) => {
  const [globals] = useGlobals();
  const isStrict = globals[STRICT_MODE_GLOBAL_TYPE_ID] === "true";
  const S = Story as ComponentType;

  return isStrict ? (
    <StrictMode>
      <S />
    </StrictMode>
  ) : (
    <S />
  );
};
