import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import TextInput from "@leafygreen-ui/text-input";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import {
  Notifications,
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { useBannerDispatchContext } from "context/banners";
import { UPDATE_USER_SETTINGS } from "gql/mutations/update-user-settings";
import { omitTypename } from "utils/string";
import { PreferencesModal } from "./PreferencesModal";
import { NotificationField } from "./notificationTab/NotificationField";

interface ProfileTabProps {
  slackUsername?: string;
  notifications?: Notifications;
}
export const NotificationsTab: React.FC<ProfileTabProps> = ({
  slackUsername,
  notifications,
}) => {
  const [slackUsernameField, setslackUsernameField] = useState(slackUsername);
  const [notificationStatus, setNotificationStatus] = useState(notifications);
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

  const handleSave = async (e): Promise<void> => {
    e.preventDefault();
    dispatchBanner.clearAllBanners();
    try {
      await updateUserSettings({
        variables: {
          userSettings: {
            slackUsername: slackUsernameField,
            notifications: omitTypename(notificationStatus),
          },
        },
        refetchQueries: ["GetUserSettings"],
      });
    } catch (err) {}
  };

  const hasFieldUpdates =
    slackUsername !== slackUsernameField ||
    notificationStatus !== notifications;

  const newPayload = omitTypename(notifications);

  return (
    <div>
      <PreferencesCard>
        <StyledTextInput
          label="Slack Username"
          onChange={handleFieldUpdate(setslackUsernameField)}
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
          disabled={!hasFieldUpdates}
          onClick={handleSave}
          loading={loading}
        >
          Save Changes
        </Button>
      </PreferencesCard>
      <ClearSubscriptionsCard />
    </div>
  );
};

const ClearSubscriptionsCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <PreferencesCard>
        <ContentWrapper>
          <Body>
            To clear all subscriptions you have made on individual Task pages.
          </Body>
          <StyledClearSubscriptionButton
            data-cy="clear-subscriptions-button"
            variant={Variant.Danger}
            onClick={() => setShowModal(true)}
          >
            Clear all previous subscriptions
          </StyledClearSubscriptionButton>
        </ContentWrapper>
      </PreferencesCard>
      <PreferencesModal
        visible={showModal}
        title="Are you sure you want to clear all of your individual subscriptions?"
        onSubmit={() => undefined}
        onCancel={() => setShowModal(false)}
        action="Clear All"
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

const StyledClearSubscriptionButton = styled(Button)`
  margin-top: 36px;
`;

const StyledTextInput = styled(TextInput)`
  margin-bottom: 24px;
  width: 50%;
  : last-child {
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
