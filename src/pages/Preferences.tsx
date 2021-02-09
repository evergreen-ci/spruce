import React from "react";
import styled from "@emotion/styled";
import { SideNav, SideNavGroup } from "@leafygreen-ui/side-nav";
import { useParams, Link, Redirect } from "react-router-dom";
import { usePreferencesAnalytics } from "analytics";
import { PageWrapper, PaddedSideNavItem } from "components/styles";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import { usePageTitle } from "hooks";
import { PreferencesTabs } from "pages/preferences/PreferencesTabs";

export const Preferences: React.FC = () => {
  usePageTitle("Preferences");
  const { tab } = useParams<{ tab: string }>();
  const { sendEvent } = usePreferencesAnalytics();
  if (!tabRouteValues.includes(tab as PreferencesTabRoutes)) {
    return <Redirect to={getPreferencesRoute(PreferencesTabRoutes.Profile)} />;
  }
  return (
    <PageWrapper>
      <PageContainer>
        <SideNav>
          <SideNavGroup header="Preferences">
            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.Profile} // @ts-expect-error
              to={getPreferencesRoute(PreferencesTabRoutes.Profile)}
              as={Link}
              data-cy="profile-nav-tab"
              onClick={() =>
                sendEvent({
                  name: "Change Tab",
                  tab: PreferencesTabRoutes.Profile,
                })
              }
            >
              Profile
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.Notifications} // @ts-expect-error
              to={getPreferencesRoute(PreferencesTabRoutes.Notifications)}
              as={Link}
              data-cy="notifications-nav-tab"
              onClick={() =>
                sendEvent({
                  name: "Change Tab",
                  tab: PreferencesTabRoutes.Notifications,
                })
              }
            >
              Notifications
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.CLI} // @ts-expect-error
              to={getPreferencesRoute(PreferencesTabRoutes.CLI)}
              as={Link}
              data-cy="cli-nav-tab"
              onClick={() =>
                sendEvent({
                  name: "Change Tab",
                  tab: PreferencesTabRoutes.CLI,
                })
              }
            >
              CLI & API
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.PublicKeys} // @ts-expect-error
              to={getPreferencesRoute(PreferencesTabRoutes.PublicKeys)}
              as={Link}
              data-cy="publickeys-nav-tab"
              onClick={() =>
                sendEvent({
                  name: "Change Tab",
                  tab: PreferencesTabRoutes.PublicKeys,
                })
              }
            >
              Manage Public Keys
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.NewUI} // @ts-expect-error
              to={getPreferencesRoute(PreferencesTabRoutes.NewUI)}
              as={Link}
              data-cy="newui-nav-tab"
              onClick={() =>
                sendEvent({
                  name: "Change Tab",
                  tab: PreferencesTabRoutes.NewUI,
                })
              }
            >
              New UI
            </PaddedSideNavItem>
          </SideNavGroup>
        </SideNav>
        <PreferencesTabs />
      </PageContainer>
    </PageWrapper>
  );
};

const tabRouteValues = Object.values(PreferencesTabRoutes);

const PageContainer = styled.div`
  display: flex;
`;
