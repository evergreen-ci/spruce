import React, { useState } from "react";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import TextInput from "@leafygreen-ui/text-input";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { Select } from "antd";
import get from "lodash/get";
import { timeZones, awsRegions } from "./fieldMaps";
import { GithubUser } from "gql/generated/types";
const { Option } = Select;

interface ProfileTabProps {
  githubUser?: GithubUser;
  timezone?: string;
  region?: string;
}
export const ProfileTab: React.FC<ProfileTabProps> = ({
  githubUser,
  timezone,
  region,
}) => {
  const lastKnownAs = get(githubUser, "githubUser.lastKnownAs", "");
  const [timezoneField, setTimezoneField] = useState(timezone ?? "UTC");
  const [regionField, setRegionField] = useState(region ?? "us-east-1");
  const [githubUsernameField, setGithubUsernameField] = useState(lastKnownAs);

  const hasFieldUpdates =
    lastKnownAs !== githubUsernameField ||
    timezone !== timezoneField ||
    region !== regionField;

  return (
    <div>
      <PreferencesCard>
        <ContentWrapper>
          <StyledTextInput
            label="Github Username"
            onChange={handleFieldUpdate(setGithubUsernameField)}
            value={githubUsernameField}
          />
          <StyledSelect
            defaultValue={timezoneField}
            onChange={handleFieldUpdate(setTimezoneField)}
          >
            {timeZones.map((timeZone) => (
              <Option value={timeZone.value} key={timeZone.value}>
                {timeZone.str}
              </Option>
            ))}
          </StyledSelect>
          <StyledSelect
            defaultValue={regionField}
            onChange={handleFieldUpdate(setRegionField)}
          >
            {awsRegions.map((awsRegion) => (
              <Option value={awsRegion.value} key={awsRegion.value}>
                {awsRegion.str}
              </Option>
            ))}
          </StyledSelect>
          <Button
            data-cy="save-profile-changes-button"
            variant={Variant.Primary}
            disabled={!hasFieldUpdates}
          >
            Save Changes
          </Button>
        </ContentWrapper>
      </PreferencesCard>
      <PreferencesCard>
        <ContentWrapper>
          <Body>
            To log out of the Evergreen UI in all browser windows on all
            computers you are logged in on.
          </Body>
          <StyledLogMeOutButton
            data-cy="logme-out-button"
            variant={Variant.Danger}
          >
            Log me out everywhere
          </StyledLogMeOutButton>
        </ContentWrapper>
      </PreferencesCard>
    </div>
  );
};

const handleFieldUpdate = (stateUpdate) => (e) => {
  if (typeof e === "string") {
    stateUpdate(e); // Antd select just passes in the value string instead of an event
  } else {
    stateUpdate(e.target.value);
  }
};
const StyledLogMeOutButton = styled(Button)`
  margin-top: 36px;
`;
const StyledSelect = styled(Select)`
  width: 100%;
  margin-bottom: 24px;
  :last-child {
    margin-bottom: 40px;
  }
`;
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
