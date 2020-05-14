import React, { useState } from "react";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import TextInput from "@leafygreen-ui/text-input";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { Notifications } from "gql/generated/types";
import { NotificationField } from "./NotificationField";

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

  const hasFieldUpdates =
    slackUsername !== slackUsernameField ||
    notificationStatus !== notifications;
  const omitTypename = (key, value) =>
    key === "__typename" ? undefined : value;
  const newPayload = JSON.parse(JSON.stringify(notifications), omitTypename);

  return (
    <div>
      <PreferencesCard>
        <ContentWrapper>
          <StyledTextInput
            label="Slack Username"
            onChange={handleFieldUpdate(setslackUsernameField)}
            value={slackUsernameField}
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
              />
            ))}
          </GridContainer>
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
            To clear all subscriptions you have made on individual Task pages.
          </Body>
          <StyledLogMeOutButton
            data-cy="clear-subscriptions-button"
            variant={Variant.Danger}
          >
            Clear all previous subscriptions
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
const StyledLogMeOutButton = styled(Button)`
  margin-top: 36px;
  display: flex;
`;
const StyledTextInput = styled(TextInput)`
  margin-bottom: 24px;
  width: 50%;
  : last-child {
    margin-bottom: 40px;
  }
`;
const ContentWrapper = styled.div`
  width: 50 %;
`;
const PreferencesCard = styled(Card)`
  padding-left: 25px;
  padding-top: 25px;
  padding-bottom: 40px;
  margin-bottom: 30px;
  width: 100 %;
`;
