import React from "react";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { H1 } from "components/Typography/index";
import { ProfileTab } from "./ProfileTab";
import { UserSettings } from "gql/generated/types";
interface PreferenceTabsProps {
  tabKey: string;
  userSettings: UserSettings;
  loading: boolean;
  error: any;
}
export const PreferencesTabs: React.FC<PreferenceTabsProps> = ({
  tabKey,
  userSettings,
  loading,
  error,
}) => {
  return (
    <Container>
      <H1>{mapUrlTabToTitle[tabKey]}</H1>
      {loading && <Skeleton active />}
      {!loading && (
        <MapUrlTabToPage tabKey={tabKey} userSettings={userSettings} />
      )}
    </Container>
  );
};

const MapUrlTabToPage: React.FC<{
  tabKey: string;
  userSettings: UserSettings;
}> = ({ tabKey, userSettings }) => {
  const componentMap = {
    profile: ProfileTab,
    notifications: ProfileTab,
    cli: ProfileTab,
  };
  const Component = componentMap[tabKey];
  return <Component {...userSettings} />;
};
const mapUrlTabToTitle = {
  profile: "Profile",
  notifications: "Notifications",
  cli: "CLI & API",
};
const Container = styled.div`
  margin-left: 64px;
  width: 60%;
`;
