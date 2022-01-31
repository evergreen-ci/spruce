import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import TextInput from "@leafygreen-ui/text-input";
import { usePreferencesAnalytics } from "analytics";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { useUserSettingsQuery } from "hooks/useUserSettingsQuery";
import { string } from "utils";
import { ClearSubscriptionsCard } from "./notificationTab/ClearSubscriptionsCard";
import { NotificationField } from "./notificationTab/NotificationField";

const { omitTypename } = string;

export const NotificationsTab: React.FC = () => {
  const dispatchToast = useToastContext();
  const { data, loadingComp } = useUserSettingsQuery();
  const { slackUsername, notifications } = data?.userSettings ?? {};
  const [slackUsernameField, setSlackUsernameField] = useState(slackUsername);
  const [notificationStatus, setNotificationStatus] = useState(notifications);
  const { sendEvent } = usePreferencesAnalytics();
  // update state from query
  useEffect(() => {
    setSlackUsernameField(slackUsername);
    setNotificationStatus(notifications);
  }, [slackUsername, notifications]);

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

  if (!notificationStatus) {
    return null;
  }

  const handleSave = async (e): Promise<void> => {
    e.preventDefault();

    const variables = {
      userSettings: {
        slackUsername: slackUsernameField,
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
        refetchQueries: ["GetUserSettings"],
      });
    } catch (err) {}
  };

  const hasFieldUpdates =
    slackUsername !== slackUsernameField ||
    notificationStatus !== notifications;

  const newPayload = omitTypename(notificationStatus);
  return (
    <div>
      {/* @ts-expect-error */}
      <PreferencesCard>
        <StyledTextInput
          label="Slack Username"
          onChange={handleFieldUpdate(setSlackUsernameField)}
          value={slackUsernameField}
          data-cy="slack-username-field"
        />
        <GridContainer>
          <GridField gridArea="1 / 3 / 2 / 4">Email</GridField>
          <GridField gridArea="1 / 4 / 2 / 5">Slack</GridField>
          <GridField gridArea="1 / 5 / 2 / 6">None</GridField>
          {Object.keys(newPayload).map((notification, index) => (
            <NotificationField
              notification={notification}
              index={index}
              notificationStatus={notificationStatus}
              setNotificationStatus={setNotificationStatus}
              key={notification}
            />
          ))}
        </GridContainer>
        <Button
          data-cy="save-profile-changes-button"
          variant={Variant.Primary}
          disabled={!hasFieldUpdates || updateLoading}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </PreferencesCard>
      <ClearSubscriptionsCard />
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  grid-template-rows: repeat(7, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  width: 50%;
}
`;

const GridField = styled.div`
  height: 50px;
  grid-area: ${(props: { gridArea: string }): string => props.gridArea};
`;

const StyledTextInput = styled(TextInput)`
  margin-bottom: ${size.m}px;
  width: 50%;
  :last-child {
    margin-bottom: 40px;
  }
`;

// @ts-expect-error
const PreferencesCard = styled(Card)`
  padding-left: 25px;
  padding-top: 25px;
  padding-bottom: 40px;
  margin-bottom: 30px;
  width: 100%;
`;
