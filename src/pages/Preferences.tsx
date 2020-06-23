import React from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { SideNav, SideNavGroup, SideNavItem } from "@leafygreen-ui/side-nav";
import get from "lodash/get";
import { paths, preferencesTabRoutes } from "constants/routes";
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
  if (tab === undefined) {
    return <Redirect to={`${paths.preferences}/profile`} />;
  }
  return (
    <PageWrapper>
      <PageContainer>
        <SideNav>
          <SideNavGroup header="Preferences">
            <PaddedSideNavItem
              active={tab === preferencesTabRoutes.Profile}
              to={`${paths.preferences}/${preferencesTabRoutes.Profile}`}
              as={Link}
              data-cy="profile-nav-tab"
            >
              Profile
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === preferencesTabRoutes.Notifications}
              to={`${paths.preferences}/${preferencesTabRoutes.Notifications}`}
              as={Link}
              data-cy="notifications-nav-tab"
            >
              Notifications
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === preferencesTabRoutes.CLI}
              to={`${paths.preferences}/${preferencesTabRoutes.CLI}`}
              as={Link}
              data-cy="cli-nav-tab"
            >
              CLI & API
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === preferencesTabRoutes.NewUI}
              to={`${paths.preferences}/${preferencesTabRoutes.NewUI}`}
              as={Link}
              data-cy="newui-nav-tab"
            >
              New UI
            </PaddedSideNavItem>
          </SideNavGroup>
        </SideNav>
        <PreferencesTabs
          tabKey={tab}
          userSettings={userSettings}
          loading={loading}
          error={error}
        />
      </PageContainer>
    </PageWrapper>
  );
};

const PaddedSideNavItem = styled(SideNavItem)`
  margin-top: 16px;
`;
const PageContainer = styled.div`
  display: flex;
`;
