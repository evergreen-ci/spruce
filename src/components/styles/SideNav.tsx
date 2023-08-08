import styled from "@emotion/styled";
import {
  SideNav as LGSideNav,
  SideNavItem as LGSideNavItem,
  SideNavGroup as LGSideNavGroup,
} from "@leafygreen-ui/side-nav";
import { zIndex } from "constants/tokens";

export const SideNav = styled(LGSideNav)`
  grid-area: sidenav;
  z-index: ${zIndex.sideNav};
`;

export const SideNavGroup = LGSideNavGroup;

export const SideNavItem = LGSideNavItem;
