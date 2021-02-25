import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { SideNav, SideNavGroup } from "@leafygreen-ui/side-nav";
import { Route, useParams, Redirect, Link } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import { PaddedSideNavItem, PageWrapper } from "components/styles";
import { routes, SpawnTab } from "constants/routes";
import { SpawnHost } from "pages/spawn/SpawnHost";
import { SpawnVolume } from "pages/spawn/SpawnVolume";

export const Spawn: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  const spawnAnalytics = useSpawnAnalytics();
  useEffect(() => {}, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!tabRouteValues.includes(tab as SpawnTab)) {
    return <Redirect to={routes.spawnHost} />;
  }

  return (
    <FlexPageWrapper>
      <SideNav>
        <SideNavGroup header="Hosts & Volumes">
          <PaddedSideNavItem
            active={tab === SpawnTab.Host} // @ts-expect-error
            to={routes.spawnHost}
            as={Link}
            data-cy="host-nav-tab"
            onClick={() =>
              spawnAnalytics.sendEvent({
                name: "Change Tab",
                tab: SpawnTab.Host,
              })
            }
          >
            Hosts
          </PaddedSideNavItem>
          <PaddedSideNavItem
            active={tab === SpawnTab.Volume} // @ts-expect-error
            to={routes.spawnVolume}
            as={Link}
            data-cy="volume-nav-tab"
            onClick={() =>
              spawnAnalytics.sendEvent({
                name: "Change Tab",
                tab: SpawnTab.Volume,
              })
            }
          >
            Volumes
          </PaddedSideNavItem>
        </SideNavGroup>
      </SideNav>
      <Container>
        <Route path={routes.spawnHost} component={SpawnHost} />
        <Route path={routes.spawnVolume} component={SpawnVolume} />
      </Container>
    </FlexPageWrapper>
  );
};

const tabRouteValues = Object.values(SpawnTab);

const FlexPageWrapper = styled(PageWrapper)`
  display: flex;
`;

const Container = styled.div`
  overflow-x: hidden;
  margin-left: 60px;
  width: 100%;
`;
