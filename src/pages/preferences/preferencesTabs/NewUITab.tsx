import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import Toggle from "@leafygreen-ui/toggle";
import { Body } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import { useBannerDispatchContext } from "context/banners";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations/update-user-settings";
import { useUserSettingsQuery } from "hooks/useUserSettingsQuery";

export const NewUITab: React.FC = () => {
  const preferencesAnalytics = usePreferencesAnalytics();
  const { data, loadingComp } = useUserSettingsQuery();
  const { spruceV1, hasUsedSpruceBefore } =
    data?.userSettings?.useSpruceOptions ?? {};
  const [checked, setChecked] = useState(spruceV1);
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

  if (loadingComp) {
    return loadingComp;
  }

  const handleToggle = async (e): Promise<void> => {
    e.preventDefault();
    dispatchBanner.clearAllBanners();
    setChecked(e.target.checked);
    preferencesAnalytics.sendEvent({
      name: e.target.checked ? "Opt into Spruce" : "Opt out of Spruce",
    });
    try {
      await updateUserSettings({
        variables: {
          userSettings: {
            useSpruceOptions: {
              spruceV1: e.target.checked,
              hasUsedSpruceBefore,
            },
          },
        },
        refetchQueries: ["GetUserSettings"],
      });
    } catch (err) {}
  };
  return (
    <PreferencesCard>
      <PaddedBody>
        Direct all inbound links to the new Evergreen UI, whenever possible
        (e.g. from the CLI, GitHub, etc.)
      </PaddedBody>
      <Toggle
        checked={checked}
        disabled={updateLoading}
        onClick={handleToggle}
      />
    </PreferencesCard>
  );
};
const PreferencesCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding-left: 25px;
  padding-top: 25px;
  padding-bottom: 40px;
  margin-bottom: 30px;
  width: 100%;
`;

const PaddedBody = styled(Body)`
  margin-bottom: 40px;
`;
