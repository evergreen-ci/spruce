import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import Toggle from "@leafygreen-ui/toggle";
import { Body } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import { useToastContext } from "context/toast";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations/update-user-settings";
import { useUserSettingsQuery } from "hooks/useUserSettingsQuery";

export const NewUITab: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { data, loadingComp } = useUserSettingsQuery();
  const { spruceV1, hasUsedSpruceBefore } =
    data?.userSettings?.useSpruceOptions ?? {};
  const [checked, setChecked] = useState(spruceV1);
  const dispatchToast = useToastContext();
  const [updateUserSettings, { loading: updateLoading }] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      dispatchToast.success(`Your changes have successfully been saved.`);
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving settings: '${err.message}'`);
    },
  });

  if (loadingComp) {
    return loadingComp;
  }

  const handleToggle = async (c, e): Promise<void> => {
    e.preventDefault();
    setChecked(c);
    sendEvent({
      name: c ? "Opt into Spruce" : "Opt out of Spruce",
    });
    try {
      await updateUserSettings({
        variables: {
          userSettings: {
            useSpruceOptions: {
              spruceV1: c,
              hasUsedSpruceBefore,
            },
          },
        },
        refetchQueries: ["GetUserSettings"],
      });
    } catch (err) {}
  };
  return (
    <>
      {/* @ts-expect-error */}
      <PreferencesCard>
        <PaddedBody>
          Direct all inbound links to the new Evergreen UI, whenever possible
          (e.g. from the CLI, GitHub, etc.)
        </PaddedBody>
        <Toggle
          checked={checked}
          disabled={updateLoading}
          onChange={handleToggle}
          aria-label="Toggle new evergreen ui"
        />
      </PreferencesCard>
    </>
  );
};

// @ts-expect-error
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
