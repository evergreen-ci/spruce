import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { Skeleton } from "antd";
import isEqual from "lodash.isequal";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { useUserSettings } from "hooks";
import { string } from "utils";
import { NotificationField } from "./notificationTab/NotificationField";
import { UserSubscriptions } from "./notificationTab/UserSubscriptions";

const { omitTypename } = string;

export const NotificationsTab: React.FC = () => {
  const dispatchToast = useToastContext();
  const { loading, userSettings } = useUserSettings();
  const { notifications, slackMemberId, slackUsername } = userSettings ?? {};
  const [slackUsernameField, setSlackUsernameField] = useState(slackUsername);
  const [slackMemberIdField, setSlackMemberIdField] = useState(slackMemberId);
  const [notificationStatus, setNotificationStatus] = useState(notifications);
  const { sendEvent } = usePreferencesAnalytics();
  // update state from query
  useEffect(() => {
    setSlackUsernameField(slackUsername);
    setSlackMemberIdField(slackMemberId);
    setNotificationStatus(notifications);
  }, [slackUsername, slackMemberId, notifications]);

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

  if (!notificationStatus) {
    return null;
  }

  const handleSave = async (e): Promise<void> => {
    e.preventDefault();

    const variables = {
      userSettings: {
        slackUsername: slackUsernameField,
        slackMemberId: slackMemberIdField,
        notifications: omitTypename(notificationStatus),
      },
    };
    sendEvent({
      name: "Save Notifications",
      params: variables,
    });
    try {
      await updateUserSettings({
        variables,
        refetchQueries: ["UserSettings"],
      });
    } catch (err) {}
  };

  const hasFieldUpdates =
    slackUsername !== slackUsernameField ||
    slackMemberId !== slackMemberIdField ||
    !isEqual(notificationStatus, notifications);

  const newPayload = omitTypename(notificationStatus);
  return (
    <>
      <SettingsCard>
        <StyledTextInput
          label="Slack Username"
          onChange={handleFieldUpdate(setSlackUsernameField)}
          value={slackUsernameField}
          data-cy="slack-username-field"
        />
        <StyledTextInput
          label="Slack Member ID"
          onChange={handleFieldUpdate(setSlackMemberIdField)}
          value={slackMemberIdField}
          description="Click on the three dots next to 'set a status' in your Slack profile, and then 'Copy member ID'."
          data-cy="slack-member-id-field"
        />
        <NotificationField
          notifications={newPayload}
          notificationStatus={notificationStatus}
          setNotificationStatus={setNotificationStatus}
        />
        <Button
          data-cy="save-profile-changes-button"
          variant={Variant.Primary}
          disabled={!hasFieldUpdates || updateLoading}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </SettingsCard>
      <UserSubscriptions />
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

const StyledTextInput = styled(TextInput)`
  margin-bottom: ${size.m};
  width: 50%;
`;
