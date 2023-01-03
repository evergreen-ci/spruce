import { memo } from "react";
import { Link } from "react-router-dom";

export const useLGButtonRouterLink = (to: string) =>
  memo(({ children, ...rest }) => (
    <Link {...rest} to={to}>
      {children}
    </Link>
  ));
