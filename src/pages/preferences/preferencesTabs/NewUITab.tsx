import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Toggle from "@leafygreen-ui/toggle";
import { Label } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import Cookies from "js-cookie";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import { DISABLE_QUERY_POLLING } from "constants/cookies";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { useUserSettings } from "hooks";

export const NewUITab: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { loading, userSettings } = useUserSettings();
  const { spruceV1 } = userSettings?.useSpruceOptions ?? {};
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

  if (loading) {
    return <Skeleton active />;
  }

  const handleOnChangeNewUI = (c: boolean) => {
    sendEvent({
      name: c ? "Opt into Spruce" : "Opt out of Spruce",
    });
    updateUserSettings({
      variables: {
        userSettings: {
          useSpruceOptions: {
            spruceV1: c,
          },
        },
      },
      refetchQueries: ["UserSettings"],
    });
  };

  const handleOnChangePolling = () => {
    const nextState = Cookies.get(DISABLE_QUERY_POLLING) !== "true";
    sendEvent({
      name: "Toggle polling",
      value: nextState ? "Enabled" : "Disabled",
    });
    Cookies.set(DISABLE_QUERY_POLLING, nextState.toString());
    window.location.reload();
  };

  return (
    <SettingsCard>
      <PreferenceItem>
        <Toggle
          checked={spruceV1}
          disabled={updateLoading}
          onChange={handleOnChangeNewUI}
          aria-label="Toggle new evergreen ui"
          id="prefer-spruce"
          size="small"
        />
        <Label htmlFor="prefer-spruce">
          Direct all inbound links to the new Evergreen UI, whenever possible
          (e.g. from the CLI, GitHub, etc.).
        </Label>
      </PreferenceItem>
      <PreferenceItem>
        <Toggle
          checked={Cookies.get(DISABLE_QUERY_POLLING) !== "true"}
          onChange={handleOnChangePolling}
          aria-label="Toggle background polling"
          id="polling"
          size="small"
        />
        <Label htmlFor="polling">
          Allow background polling for active tabs in the current browser.
        </Label>
      </PreferenceItem>
    </SettingsCard>
  );
};

const PreferenceItem = styled.div`
  align-items: center;
  display: flex;
  gap: ${size.xs};

  :not(:last-of-type) {
    margin-bottom: ${size.s};
  }
`;
