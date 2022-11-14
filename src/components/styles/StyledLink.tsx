import { css } from "@emotion/react";
import { Link as LGLink } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";

export const StyledLink = (props) => (
  <LGLink
    hideExternalIcon
    css={css`
      // TODO: Remove when fixed: https://jira.mongodb.org/browse/EVG-18183

      // Override LG's fixed 13px line height
      line-height: inherit;

      // Override LeafyGreen's font-size declaration for Link
      font-size: inherit;
      font-weight: inherit;
    `}
    {...props}
  />
);

export const StyledRouterLink = (props) => <StyledLink as={Link} {...props} />;
