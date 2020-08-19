import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import {
  GetUserSettingsQuery,
  GetUserSettingsQueryVariables,
} from "gql/generated/types";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { Banners } from "components/Banners";
import { withBannersContext } from "hoc/withBannersContext";
import { routes, PreferencesTabRoutes } from "constants/routes";
import { Route, useParams } from "react-router-dom";
import { GET_USER_SETTINGS } from "gql/queries";
import { useQuery } from "@apollo/react-hooks";
import { NotificationsTab } from "./preferencesTabs/NotificationsTab";
import { ProfileTab } from "./preferencesTabs/ProfileTab";
import { CliTab } from "./preferencesTabs/CliTab";
import { NewUITab } from "./preferencesTabs/NewUITab";
import { PublicKeysTab } from "./preferencesTabs/PublicKeysTab";

const Tabs: React.FC = () => {
  const { loading, error } = useQuery<
    GetUserSettingsQuery,
    GetUserSettingsQueryVariables
  >(GET_USER_SETTINGS, {
    onError(err) {
      dispatchBanner.errorBanner(
        `There was an error fetching your user settings: ${err.message}`
      );
    },
  });
  const { tab } = useParams<{ tab: string }>();
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();

  useEffect(() => {
    dispatchBanner.clearAllBanners();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const { title, subtitle } = getTitle(tab as PreferencesTabRoutes);
  if (error) {
    return (
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
    );
  }
  return (
    <Container>
      <TitleContainer>
        <H2 data-cy="preferences-tab-title">{title}</H2>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleContainer>
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      {loading && <Skeleton active />}
      {!loading && (
        <>
          <Route path={routes.profilePreferences} component={ProfileTab} />
          <Route
            path={routes.notificationsPreferences}
            component={NotificationsTab}
          />
          <Route path={routes.cliPreferences} component={CliTab} />
          <Route path={routes.newUIPreferences} component={NewUITab} />
          <Route
            path={routes.publicKeysPreferences}
            component={PublicKeysTab}
          />
        </>
      )}
    </Container>
  );
};

const getTitle = (
  tab: PreferencesTabRoutes = PreferencesTabRoutes.Profile
): { title: string; subtitle?: string } => {
  const defaultTitle = {
    title: "Profile",
  };
  return (
    {
      [PreferencesTabRoutes.Profile]: defaultTitle,
      [PreferencesTabRoutes.Notifications]: {
        title: "Notifications",
      },
      [PreferencesTabRoutes.CLI]: {
        title: "CLI & API",
      },
      [PreferencesTabRoutes.NewUI]: {
        title: "New UI Settings",
      },
      [PreferencesTabRoutes.PublicKeys]: {
        title: "Manage Public Keys",
        subtitle: "These keys will be used to SSH into spawned hosts",
      },
    }[tab] ?? defaultTitle
  );
};

const Container = styled.div`
  margin-left: 64px;
  width: 60%;
`;

const TitleContainer = styled.div`
  margin-bottom: 30px;
`;

const Subtitle = styled(Disclaimer)`
  padding-top: 16px;
`;
export const PreferencesTabs = withBannersContext(Tabs);
