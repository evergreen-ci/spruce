import { css } from "@emotion/react";
import { Link as LGLink } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";

export const StyledLink = (props) => (
  <LGLink
    hideExternalIcon
    css={css`
      // Override LG's fixed 13px line height
      line-height: inherit;
    `}
    {...props}
  />
);

export const StyledRouterLink = (props) => <StyledLink as={Link} {...props} />;
