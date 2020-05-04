import React from "react";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { SideNav, SideNavGroup, SideNavItem } from "@leafygreen-ui/side-nav";
import { paths } from "constants/routes";
import { PageWrapper } from "components/styles";

const PaddedSideNavItem = styled(SideNavItem)`
  margin-top: 16px;
`;
export const Preferences: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  return (
    <PageWrapper>
      <SideNav>
        <SideNavGroup header="Preferences">
          <PaddedSideNavItem
            active={tab === "profile"}
            href={`${paths.preferences}/profile`}
          >
            Profile
          </PaddedSideNavItem>
          <PaddedSideNavItem
            active={tab === "notifications"}
            href={`${paths.preferences}/notifications`}
          >
            Notifications
          </PaddedSideNavItem>
          <PaddedSideNavItem
            active={tab === "cli"}
            href={`${paths.preferences}/cli`}
          >
            CLI & API
          </PaddedSideNavItem>
        </SideNavGroup>
      </SideNav>
    </PageWrapper>
  );
};
