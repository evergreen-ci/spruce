import styled from "@emotion/styled";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { notificationFields } from "constants/fieldMaps";
import { fontSize, size } from "constants/tokens";
import { Notifications } from "gql/generated/types";

interface NotificationFieldProps {
  notification: string;
  notificationStatus: Notifications;
  index: number;
  setNotificationStatus: (notifications: { [key: string]: string }) => void;
}

export const NotificationField: React.VFC<NotificationFieldProps> = ({
  notification,
  setNotificationStatus,
  notificationStatus,
  index,
}) => (
  <>
    <NotificationEvent row={index}>
      {notificationFields[notification]}
    </NotificationEvent>
    <StyledRadioGroup
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
  </>
);

const NotificationEvent = styled.span<{ row: number }>`
  font-size: ${fontSize.m};
  margin-top: ${size.xs};

  grid-column: 1;
  grid-row: ${({ row }) => row};
`;

const StyledRadioGroup = styled(RadioGroup)<{ row: number }>`
  display: flex;
  gap: ${size.l};
  align-items: baseline;

  grid-column: 2;
  grid-row: ${({ row }) => row};
`;
