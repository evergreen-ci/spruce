import styled from "@emotion/styled";
import {
  SideNav as LGSideNav,
  SideNavItem as LGSideNavItem,
  SideNavGroup as LGSideNavGroup,
} from "@leafygreen-ui/side-nav";

export const SideNav = styled(LGSideNav)`
  grid-area: sidenav;
  z-index: 1;
`;

export const SideNavGroup = LGSideNavGroup;

export const SideNavItem = LGSideNavItem;
