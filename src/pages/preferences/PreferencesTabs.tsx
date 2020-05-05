import React from "react";
import styled from "@emotion/styled";
import { H1 } from "components/Typography/index";
import { ProfileTab } from "./ProfileTab";
import { UserSettings } from "gql/generated/types";
interface PreferenceTabsProps {
  tabKey: string;
  userSettings: UserSettings;
}
export const PreferencesTabs: React.FC<PreferenceTabsProps> = ({
  tabKey,
  userSettings,
}) => {
  return (
    <Container>
      <H1>{mapUrlTabToTitle[tabKey]}</H1>
      <MapUrlTabToPage tabKey={tabKey} userSettings={userSettings} />
    </Container>
  );
};

const MapUrlTabToPage: React.FC<{
  tabKey: string;
  userSettings: UserSettings;
}> = ({ tabKey, userSettings }) => {
  return <ProfileTab {...userSettings} />;
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
