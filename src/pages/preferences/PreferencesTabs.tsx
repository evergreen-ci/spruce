import React from "react";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { ApolloError } from "apollo-client";
import { UserSettings } from "gql/generated/types";
import { ProfileTab } from "./ProfileTab";
import { NotificationsTab } from "./NotificationsTab";

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

export const PreferencesTabs: React.FC<PreferenceTabsProps> = ({
  tabKey,
  userSettings,
  loading,
}) => {
  const Component = componentMap[tabKey];
  return (
    <Container>
      <H2>{mapUrlTabToTitle[tabKey]}</H2>
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
