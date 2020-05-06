import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { SideNav, SideNavGroup, SideNavItem } from "@leafygreen-ui/side-nav";
import get from "lodash/get";
import { paths } from "constants/routes";
import { PageWrapper } from "components/styles";
import { PreferencesTabs } from "pages/preferences/PreferencesTabs";
import { GET_USER_SETTINGS } from "gql/queries/get-user-settings";
import {
  GetUserSettingsQuery,
  GetUserSettingsQueryVariables,
} from "gql/generated/types";

const PaddedSideNavItem = styled(SideNavItem)`
  margin-top: 16px;
`;
const PageContainer = styled.div`
  display: flex;
`;
export const Preferences: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  const { data, loading, error } = useQuery<
    GetUserSettingsQuery,
    GetUserSettingsQueryVariables
  >(GET_USER_SETTINGS);

  const userSettings = get(data, "data.userSettings");
  return (
    <PageWrapper>
      <PageContainer>
        <SideNav>
          <SideNavGroup header="Preferences">
            <PaddedSideNavItem
              active={tab === "profile"}
              to={`${paths.preferences}/profile`}
              as={Link}
            >
              Profile
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === "notifications"}
              to={`${paths.preferences}/notifications`}
              as={Link}
            >
              Notifications
            </PaddedSideNavItem>
            <PaddedSideNavItem
              active={tab === "cli"}
              to={`${paths.preferences}/cli`}
              as={Link}
            >
              CLI & API
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
