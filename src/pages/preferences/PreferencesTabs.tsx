import React from "react";
import styled from "@emotion/styled";
import { H1 } from "components/Typography/index";
import { ProfileTab } from "./ProfileTab";

interface PreferenceTabsProps {
  tabKey: string;
}
export const PreferencesTabs: React.FC<PreferenceTabsProps> = ({ tabKey }) => {
  const props = {
    githubUser: {
      lastKnownAs: "Khelif96",
    },
  };
  return (
    <Container>
      <H1>{mapUrlTabToTitle[tabKey]}</H1>
      <MapUrlTabToPage tabKey={tabKey} {...props} />
    </Container>
  );
};

const MapUrlTabToPage: React.FC<{ tabKey: string }> = ({ tabKey }, props) => {
  return <ProfileTab {...props} />;
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
