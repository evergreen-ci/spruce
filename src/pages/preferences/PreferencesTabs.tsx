import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { ApolloError } from "apollo-client";
import { UserSettings } from "gql/generated/types";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { PreferencesTabRoutes } from "constants/routes";
import { Banners } from "components/Banners";
import { withBannersContext } from "hoc/withBannersContext";
import { NotificationsTab } from "./preferencesTabs/NotificationsTab";
import { ProfileTab } from "./preferencesTabs/ProfileTab";
import { CliTab } from "./preferencesTabs/CliTab";
import { NewUITab } from "./preferencesTabs/NewUITab";
import { PublicKeysTab } from "./preferencesTabs/PublicKeysTab";

interface PreferenceTabsProps {
  tabKey: PreferencesTabRoutes;
  userSettings: UserSettings;
  loading: boolean;
  error: ApolloError;
}

const Tabs: React.FC<PreferenceTabsProps> = ({
  tabKey,
  userSettings,
  loading,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  useEffect(() => {
    dispatchBanner.clearAllBanners();
  }, [tabKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const { title, Component, subtitle } = getTitleAndComponent(
    tabKey,
    userSettings
  );
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
      {!loading && <Component />}
    </Container>
  );
};

const getTitleAndComponent = (
  tabKey: PreferencesTabRoutes = PreferencesTabRoutes.Profile,
  userSettings: UserSettings
): { title: string; Component: React.FC; subtitle?: string } => {
  const {
    githubUser,
    timezone,
    region,
    slackUsername,
    notifications,
    useSpruceOptions,
  } = userSettings ?? {};

  const defaultTitleAndComponent = {
    title: "Profile",
    Component: () => <ProfileTab {...{ githubUser, timezone, region }} />,
  };

  return (
    {
      [PreferencesTabRoutes.Profile]: defaultTitleAndComponent,
      [PreferencesTabRoutes.Notifications]: {
        title: "Notifications",
        Component: () => (
          <NotificationsTab {...{ slackUsername, notifications }} />
        ),
      },
      [PreferencesTabRoutes.CLI]: {
        title: "CLI & API",
        Component: () => <CliTab />,
      },
      [PreferencesTabRoutes.NewUI]: {
        title: "New UI Settings",
        Component: () => <NewUITab {...{ useSpruceOptions }} />,
      },
      [PreferencesTabRoutes.PublicKeys]: {
        title: "Manage Public Keys",
        subtitle: "These keys will be used to SSH into spawned hosts",
        Component: () => <PublicKeysTab />,
      },
    }[tabKey] ?? defaultTitleAndComponent
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
