import { Fragment } from "react";
import styled from "@emotion/styled";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { notificationFields } from "constants/fieldMaps";
import { fontSize, size } from "constants/tokens";
import { Notifications } from "gql/generated/types";

interface NotificationFieldProps {
  notifications: { [key: string]: string };
  notificationStatus: Notifications;
  setNotificationStatus: (notifications: { [key: string]: string }) => void;
}

export const NotificationField: React.VFC<NotificationFieldProps> = ({
  notifications,
  notificationStatus,
  setNotificationStatus,
}) => (
  <GridContainer>
    <NotificationMethod>
      <span>Email</span>
      <span>Slack</span>
      <span>None</span>
    </NotificationMethod>
    {Object.keys(notifications).map((notification, index) => (
      <Fragment key={notification}>
        <NotificationEvent row={index}>
          {notificationFields[notification]}
        </NotificationEvent>
        <StyledRadioGroup
          key={`${notification}-radio`}
          row={index}
          onChange={(e) => {
            setNotificationStatus({
              ...notificationStatus,
              [notification]: e.target.value,
            });
          }}
          value={notificationStatus[notification]}
        >
          <Radio value="email" />
          <Radio value="slack" />
          <Radio value="" />
        </StyledRadioGroup>
      </Fragment>
    ))}
  </GridContainer>
);

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(7, 1fr);
  margin-bottom: ${size.s};
  width: 350px;
`;

const NotificationMethod = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.l};

  grid-column: 2;
  grid-row: 1;
`;

const NotificationEvent = styled.span<{ row: number }>`
  font-size: ${fontSize.m};
  margin-top: ${size.xs};

  grid-column: 1;
  grid-row: ${({ row }) => row + 2};
`;

const StyledRadioGroup = styled(RadioGroup)<{ row: number }>`
  display: flex;
  gap: ${size.l};
  align-items: baseline;

  grid-column: 2;
  grid-row: ${({ row }) => row + 2};
`;
