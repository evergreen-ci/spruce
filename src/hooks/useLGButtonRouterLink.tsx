import { useMemo } from "react";
import { Link } from "react-router-dom";

export const useLGButtonRouterLink = (to: string) => {
  const linkComp = useMemo(
    () =>
      ({ children, ...rest }) =>
        (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Link {...rest} to={to}>
            {children}
          </Link>
        ),
    [to]
  );
  return linkComp;
};
