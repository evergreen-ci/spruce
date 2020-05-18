import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import TextInput from "@leafygreen-ui/text-input";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { Select } from "antd";
import get from "lodash/get";
import {
  GithubUser,
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { useBannerDispatchContext } from "context/banners";
import { UPDATE_USER_SETTINGS } from "gql/mutations/update-user-settings";
import { omitTypename } from "utils/string";
import { timeZones, awsRegions } from "./fieldMaps";
import { PreferencesModal } from "./PreferencesModal";

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
  const dispatchBanner = useBannerDispatchContext();
  const [updateUserSettings, { loading }] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      dispatchBanner.successBanner(
        `Your changes have successfully been saved.`
      );
    },
    onError: (err) => {
      dispatchBanner.errorBanner(`Error while saving patch: '${err.message}'`);
    },
  });
  const handleSave = async (e): Promise<void> => {
    e.preventDefault();
    dispatchBanner.clearAllBanners();
    try {
      await updateUserSettings({
        variables: {
          userSettings: {
            githubUser: {
              ...omitTypename(githubUser),
              lastKnownAs: githubUsernameField,
            },
            timezone: timezoneField,
            region: regionField,
          },
        },
        refetchQueries: ["GetUserSettings"],
      });
    } catch (err) {}
  };

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
            disabled={!hasFieldUpdates || loading}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </ContentWrapper>
      </PreferencesCard>
      <LogMeOutCard />
    </div>
  );
};

const LogMeOutCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <PreferencesCard>
        <ContentWrapper>
          <Body>
            To log out of the Evergreen UI in all browser windows on all
            computers you are logged in on.
          </Body>
          <StyledLogMeOutButton
            data-cy="logme-out-button"
            variant={Variant.Danger}
            onClick={() => setShowModal(true)}
          >
            Log me out everywhere
          </StyledLogMeOutButton>
        </ContentWrapper>
      </PreferencesCard>
      <PreferencesModal
        visible={showModal}
        title="Are you sure you want to log out from everywhere?"
        onSubmit={() => console.log("Submitted")}
        onCancel={() => setShowModal(false)}
        action="Log out"
      />
    </>
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
