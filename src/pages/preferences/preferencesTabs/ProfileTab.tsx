import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import TextInput from "@leafygreen-ui/text-input";
import { Select } from "antd";
import get from "lodash/get";
import { usePreferencesAnalytics } from "analytics";
import { timeZones } from "constants/fieldMaps";
import { useBannerDispatchContext } from "context/banners";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  AwsRegionsQuery,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { GET_AWS_REGIONS } from "gql/queries";
import { useUserSettingsQuery } from "hooks/useUserSettingsQuery";
import { omitTypename } from "utils/string";

const { Option } = Select;

export const ProfileTab: React.FC = () => {
  const { data, loadingComp } = useUserSettingsQuery();
  const { githubUser, timezone, region } = data?.userSettings ?? {};
  const lastKnownAs = get(githubUser, "githubUser.lastKnownAs", "");
  const [timezoneField, setTimezoneField] = useState<string>(timezone);
  const [regionField, setRegionField] = useState<string>(region);
  const { sendEvent } = usePreferencesAnalytics();
  const [githubUsernameField, setGithubUsernameField] = useState<string>(
    get(githubUser, "githubUser.lastKnownAs")
  );
  useEffect(() => {
    setGithubUsernameField(githubUser?.lastKnownAs);
    setTimezoneField(timezone);
    setRegionField(region);
  }, [githubUser, timezone, region]);
  const dispatchBanner = useBannerDispatchContext();
  const [updateUserSettings, { loading: updateLoading }] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      dispatchBanner.successBanner(
        `Your changes have successfully been saved.`
      );
    },
    onError: (err) => {
      dispatchBanner.errorBanner(
        `Error while saving settings: '${err.message}'`
      );
    },
  });

  const { data: awsRegionData } = useQuery<AwsRegionsQuery>(GET_AWS_REGIONS);

  if (loadingComp) {
    return loadingComp;
  }

  const awsRegions = get(awsRegionData, "awsRegions", []);
  const handleSave = async (e): Promise<void> => {
    e.preventDefault();
    dispatchBanner.clearAllBanners();
    const variables = {
      userSettings: {
        githubUser: {
          ...omitTypename(githubUser),
          lastKnownAs: githubUsernameField,
        },
        timezone: timezoneField,
        region: regionField,
      },
    };
    sendEvent({
      name: "Save Profile Info",
      params: variables,
    });
    try {
      await updateUserSettings({
        variables,
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
            data-cy="timezone-field"
          >
            {timeZones.map((timeZone) => (
              <Option
                value={timeZone.value}
                key={timeZone.value}
                data-cy={`${timeZone.str}-option`}
              >
                {timeZone.str}
              </Option>
            ))}
          </StyledSelect>
          <StyledSelect
            defaultValue={regionField}
            onChange={handleFieldUpdate(setRegionField)}
          >
            {(awsRegions as any[])?.map((awsRegion) => (
              <Option value={awsRegion} key={awsRegion}>
                {awsRegion}
              </Option>
            ))}
          </StyledSelect>
          <Button
            data-cy="save-profile-changes-button"
            variant={Variant.Primary}
            disabled={!hasFieldUpdates || updateLoading}
            onClick={handleSave}
          >
            Save Changes
          </Button>
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
