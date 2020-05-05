import React, { useState } from "react";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import TextInput from "@leafygreen-ui/text-input";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { Select } from "antd";
import get from "lodash/get";

interface ProfileTabProps {
  githubUser: {
    lastKnownAs: string;
  };
}
export const ProfileTab: React.FC<ProfileTabProps> = ({ githubUser }) => {
  const lastKnownAs = get(githubUser, "githubUser.lastKnownAs", "");
  const [githubUsername, setGithubUsername] = useState(lastKnownAs);
  return (
    <div>
      <PreferencesCard>
        <ContentWrapper>
          <StyledTextInput
            label="Github Username"
            onChange={(e) => setGithubUsername(e.target.value)}
            value={githubUsername}
          />
          <StyledTextInput
            label="Github Username"
            onChange={(e) => setGithubUsername(e.target.value)}
            value={githubUsername}
          />
          <StyledTextInput
            label="Github Username"
            onChange={(e) => setGithubUsername(e.target.value)}
            value={githubUsername}
          />
          <Button
            data-cy="save-profile-changes-button"
            variant={Variant.Primary}
            disabled={lastKnownAs === githubUsername}
          >
            Save Changes
          </Button>
        </ContentWrapper>
      </PreferencesCard>
      <PreferencesCard>
        <Body>
          To log out of the Evergreen UI in all browser windows on all computers
          you are logged in on.
        </Body>
        <Button data-cy="logme-out-button" variant={Variant.Danger}>
          Log me out everywhere
        </Button>
      </PreferencesCard>
    </div>
  );
};

const StyledTextInput = styled(TextInput)`
  margin-bottom: 24px;
  :last-child {
    margin-bottom: 40px;
  }
`;
const ContentWrapper = styled.div`
  width: 50%;
`;
const PreferencesCard = styled(Card)`
  padding-left: 25px;
  padding-top: 25px;
  padding-bottom: 40px;
  margin-bottom: 30px;
  width: 100%;
`;
