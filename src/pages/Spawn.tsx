import React, { useEffect } from "react";
import { Route, useParams, Redirect, Link } from "react-router-dom";
import { routes, SpawnTab } from "constants/routes";
import { SpawnHost } from "pages/spawn/SpawnHost";
import { SpawnVolume } from "pages/spawn/SpawnVolume";
import { SideNav, SideNavGroup } from "@leafygreen-ui/side-nav";
import { PaddedSideNavItem, PageWrapper } from "components/styles";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { withBannersContext } from "hoc/withBannersContext";
import { Banners } from "components/Banners";

import styled from "@emotion/styled";

const SpawnTabs = () => {
  const { tab } = useParams<{ tab: string }>();
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  useEffect(() => {
    dispatchBanner.clearAllBanners();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
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
      <div>
        <Banners
          banners={bannersState}
          removeBanner={dispatchBanner.removeBanner}
        />
        <Route path={routes.spawnHost} component={SpawnHost} />
        <Route path={routes.spawnVolume} component={SpawnVolume} />
      </div>
    </FlexPageWrapper>
  );
};

const tabRouteValues = Object.values(SpawnTab);

const FlexPageWrapper = styled(PageWrapper)`
  display: flex;
`;

export const Spawn = withBannersContext(SpawnTabs);
