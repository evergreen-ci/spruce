import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Body } from "@leafygreen-ui/typography";
import Toggle from "@leafygreen-ui/toggle";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { useBannerDispatchContext } from "context/banners";
import { UPDATE_USER_SETTINGS } from "gql/mutations/update-user-settings";
import {
  UseSpruceOptions,
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";

interface NewUITabProps {
  useSpruceOptions: UseSpruceOptions;
}
export const NewUITab: React.FC<NewUITabProps> = ({ useSpruceOptions }) => {
  const { spruceV1 } = useSpruceOptions;
  const [checked, setChecked] = useState(spruceV1);
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
      dispatchBanner.errorBanner(
        `Error while saving settings: '${err.message}'`
      );
    },
  });
  const handleToggle = async (e): Promise<void> => {
    e.preventDefault();
    dispatchBanner.clearAllBanners();
    setChecked(e.target.checked);
    console.log(e.target.checked);
    try {
      await updateUserSettings({
        variables: {
          userSettings: {
            useSpruceOptions: {
              spruceV1: e.target.checked,
              hasUsedSpruceBefore: true,
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
      <Toggle checked={checked} disabled={loading} onClick={handleToggle} />
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
