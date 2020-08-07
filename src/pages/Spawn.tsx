import React from "react";
import { Route, useParams, Redirect, Link } from "react-router-dom";
import { routes, SpawnTab } from "constants/routes";
import { SpawnHost } from "pages/spawn/SpawnHost";
import { SpawnVolume } from "pages/spawn/SpawnVolume";
import { SideNav, SideNavGroup } from "@leafygreen-ui/side-nav";
import { PaddedSideNavItem } from "components/styles";
import { PageWrapper } from "components/styles";
import styled from "@emotion/styled";

export const Spawn = () => {
  const { tab } = useParams<{ tab: string }>();
  if (!tabRouteValues.includes(tab as SpawnTab)) {
    return <Redirect to={routes.spawnHost} />;
  }
  return (
    <FlexPageWrapper>
      <SideNav>
        <SideNavGroup header="Hosts & Volumes">
          <PaddedSideNavItem
            active={tab === SpawnTab.Host}
            to={routes.spawnHost}
            as={Link}
            data-cy="host-nav-tab"
          >
            Hosts
          </PaddedSideNavItem>
          <PaddedSideNavItem
            active={tab === SpawnTab.Volume}
            to={routes.spawnVolume}
            as={Link}
            data-cy="volume-nav-tab"
          >
            Volumes
          </PaddedSideNavItem>
        </SideNavGroup>
      </SideNav>
      <Route path={routes.spawnHost} component={SpawnHost} />
      <Route path={routes.spawnVolume} component={SpawnVolume} />
    </FlexPageWrapper>
  );
};

const tabRouteValues = Object.values(SpawnTab);

const FlexPageWrapper = styled(PageWrapper)`
  display: flex;
`;
