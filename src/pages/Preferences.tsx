import React from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { SideNav, SideNavGroup, SideNavItem } from "@leafygreen-ui/side-nav";
import get from "lodash/get";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import { PageWrapper } from "components/styles";
import { PreferencesTabs } from "pages/preferences/PreferencesTabs";
import { GET_USER_SETTINGS } from "gql/queries/get-user-settings";
import {
  GetUserSettingsQuery,
  GetUserSettingsQueryVariables,
} from "gql/generated/types";
import { usePageTitle } from "hooks";

export const Preferences: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  const { data, loading, error } = useQuery<
    GetUserSettingsQuery,
    GetUserSettingsQueryVariables
  >(GET_USER_SETTINGS);
  usePageTitle("Preferences");
  const userSettings = get(data, "userSettings");

  if (!tabRouteValues.includes(tab as PreferencesTabRoutes)) {
    return <Redirect to={getPreferencesRoute(PreferencesTabRoutes.Profile)} />;
  }
  return (
    <PageWrapper>
      <PageContainer>
        <SideNav>
          <SideNavGroup header="Preferences">
            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.Profile}
              to={getPreferencesRoute(PreferencesTabRoutes.Profile)}
              as={Link}
              data-cy="profile-nav-tab"
            >
              Profile
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.Notifications}
              to={getPreferencesRoute(PreferencesTabRoutes.Notifications)}
              as={Link}
              data-cy="notifications-nav-tab"
            >
              Notifications
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.CLI}
              to={getPreferencesRoute(PreferencesTabRoutes.CLI)}
              as={Link}
              data-cy="cli-nav-tab"
            >
              CLI & API
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.PublicKeys}
              to={getPreferencesRoute(PreferencesTabRoutes.PublicKeys)}
              as={Link}
              data-cy="publickeys-nav-tab"
            >
              Manage Public Keys
            </PaddedSideNavItem>

            <PaddedSideNavItem
              active={tab === PreferencesTabRoutes.NewUI}
              to={getPreferencesRoute(PreferencesTabRoutes.NewUI)}
              as={Link}
              data-cy="newui-nav-tab"
            >
              New UI
            </PaddedSideNavItem>
          </SideNavGroup>
        </SideNav>
        <PreferencesTabs
          tabKey={tab as PreferencesTabRoutes}
          userSettings={userSettings}
          loading={loading}
          error={error}
        />
      </PageContainer>
    </PageWrapper>
  );
};

const tabRouteValues = Object.values(PreferencesTabRoutes);

const PaddedSideNavItem = styled(SideNavItem)`
  margin-top: 16px;
`;
const PageContainer = styled.div`
  display: flex;
`;
