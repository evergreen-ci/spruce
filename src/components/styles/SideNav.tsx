import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import {
  SideNav as LGSideNav,
  SideNavItem as LGSideNavItem,
  SideNavGroup as LGSideNavGroup,
} from "@leafygreen-ui/side-nav";

const { gray } = palette;

// Override Spruce's universal blue hover on links
// @ts-expect-error
export const SideNavItem = styled(LGSideNavItem)`
  :hover {
    color: ${gray.dark2};
  }
`;

export const SideNav = styled(LGSideNav)`
  grid-area: sidenav;
  z-index: 1;
`;

export const SideNavGroup = LGSideNavGroup;
