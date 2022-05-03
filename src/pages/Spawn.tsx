import React, { useEffect } from "react";
import { Route, useParams, Redirect, Link } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import {
  PageWrapper,
  SideNav,
  SideNavGroup,
  SideNavItem,
} from "components/styles";
import { routes, SpawnTab } from "constants/routes";
import { SpawnHost } from "pages/spawn/SpawnHost";
import { SpawnVolume } from "pages/spawn/SpawnVolume";

export const Spawn: React.VFC = () => {
  const { tab } = useParams<{ tab: string }>();
  const spawnAnalytics = useSpawnAnalytics();
  useEffect(() => {}, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!tabRouteValues.includes(tab as SpawnTab)) {
    return <Redirect to={routes.spawnHost} />;
  }

  return (
    <>
      <SideNav aria-label="Hosts & Volumes">
        <SideNavGroup header="Hosts & Volumes">
          <SideNavItem
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
          </SideNavItem>
          <SideNavItem
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
          </SideNavItem>
        </SideNavGroup>
      </SideNav>
      <PageWrapper>
        <Route path={routes.spawnHost} component={SpawnHost} />
        <Route path={routes.spawnVolume} component={SpawnVolume} />
      </PageWrapper>
    </>
  );
};

const tabRouteValues = Object.values(SpawnTab);
