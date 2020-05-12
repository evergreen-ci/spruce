import React, { useState } from "react";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import TextInput from "@leafygreen-ui/text-input";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { Radio } from "antd";
import { Notifications } from "gql/generated/types";
import { notificationFields } from "./fieldMaps";

interface ProfileTabProps {
  slackUsername?: string;
  notifications?: Notifications;
}
export const NotificationsTab: React.FC<ProfileTabProps> = ({
  slackUsername,
  notifications,
}) => {
  const [slackUsernameField, setslackUsernameField] = useState(slackUsername);

  const hasFieldUpdates = slackUsername !== slackUsernameField;
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
                status={notifications[notification]}
                index={index}
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
        <Body>
          To clear all subscriptions you have made on individual Task pages.
        </Body>
        <StyledLogMeOutButton
          data-cy="clear-subscriptions-button"
          variant={Variant.Danger}
        >
          Clear all previous subscriptions
        </StyledLogMeOutButton>
      </PreferencesCard>
    </div>
  );
};

interface NotificationFieldProps {
  notification: string;
  status?: string;
  index: number;
}
const NotificationField: React.FC<NotificationFieldProps> = ({
  notification,
  index,
}) => (
  <GridCapableRadioGroup>
    <GridField gridArea={`${2 + index}/ 1 / ${2 + index} / 3`}>
      {notificationFields[notification]}
    </GridField>
    <GridField gridArea={`${2 + index} / 3 / ${2 + index} / 4`}>
      <Radio value={1} />
    </GridField>
    <GridField gridArea={`${2 + index} / 4 / ${2 + index} / 5`}>
      <Radio value={2} />
    </GridField>
    <GridField gridArea={`${2 + index} / 5 / ${2 + index} / 6`}>
      <Radio value={3} />
    </GridField>
  </GridCapableRadioGroup>
);
const handleFieldUpdate = (stateUpdate) => (e) => {
  if (typeof e === "string") {
    stateUpdate(e); // Antd select just passes in the value string instead of an event
  } else {
    stateUpdate(e.target.value);
  }
};

const GridCapableRadioGroup = styled(Radio.Group)`
  display: contents;
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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
`;
const StyledTextInput = styled(TextInput)`
  margin-bottom: 24px;
  : last - child {
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
