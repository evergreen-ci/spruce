import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { ApolloError } from "apollo-client";
import { UserSettings } from "gql/generated/types";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { Banners } from "components/Banners";
import { withBannersContext } from "hoc/withBannersContext";
import { NotificationsTab } from "./preferencesTabs/NotificationsTab";
import { ProfileTab } from "./preferencesTabs/ProfileTab";

interface PreferenceTabsProps {
  tabKey: string;
  userSettings: UserSettings;
  loading: boolean;
  error: ApolloError;
}

enum mapUrlTabToTitle {
  profile = "Profile",
  notifications = "Notifications",
  cli = "CLI & API",
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
  const Component = componentMap[tabKey];
  return (
    <Container>
      <Title data-cy="preferences-tab-title">{mapUrlTabToTitle[tabKey]}</Title>
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      {loading && <Skeleton active />}
      {!loading && <Component tabKey={tabKey} {...userSettings} />}
    </Container>
  );
};

const componentMap = {
  profile: ProfileTab,
  notifications: NotificationsTab,
  cli: ProfileTab,
};

const Container = styled.div`
  margin-left: 64px;
  width: 60%;
`;

const Title = styled(H2)`
  margin-bottom: 30px;
`;

export const PreferencesTabs = withBannersContext(Tabs);
