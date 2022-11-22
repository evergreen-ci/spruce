import React, { useMemo } from "react";
import { BoxProps } from "@leafygreen-ui/box";
import { StyledRouterLink } from "components/styles";

export const useLGButtonRouterLink = (to: string) => {
  const linkComp = useMemo(
    () =>
      ({ children, ...rest }: BoxProps<"div", { children: React.ReactNode }>) =>
        (
          /* @ts-expect-error */
          // eslint-disable-next-line react/jsx-props-no-spreading
          <div {...rest}>
            <StyledRouterLink to={to}>{children}</StyledRouterLink>
          </div>
        ),
    [to]
  );
  return linkComp;
};
