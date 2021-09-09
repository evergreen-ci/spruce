import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import {
  SideNav as LGSideNav,
  SideNavItem as LGSideNavItem,
  SideNavGroup as LGSideNavGroup,
} from "@leafygreen-ui/side-nav";

const { gray } = uiColors;

// Override Spruce's universal blue hover on links
// @ts-expect-error
export const SideNavItem = styled(LGSideNavItem)`
  :hover {
    color: ${gray.dark2};
  }
`;

export const SideNav = styled(LGSideNav)`
  grid-area: sidenav;
`;

export const SideNavGroup = LGSideNavGroup;
