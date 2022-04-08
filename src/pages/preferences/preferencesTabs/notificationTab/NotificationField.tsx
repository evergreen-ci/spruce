import styled from "@emotion/styled";
import { Radio } from "antd";
import { notificationFields } from "constants/fieldMaps";
import { fontSize, size } from "constants/tokens";
import { Notifications } from "gql/generated/types";

interface NotificationFieldProps {
  notification: string;
  notificationStatus: Notifications;
  index: number;
  setNotificationStatus: (e) => void;
}
export const NotificationField: React.VFC<NotificationFieldProps> = ({
  notification,
  setNotificationStatus,
  notificationStatus,
  index,
}) => (
  <GridCapableRadioGroup
    onChange={(e) => {
      setNotificationStatus({
        ...notificationStatus,
        [notification]: e.target.value,
      });
    }}
    value={notificationStatus[notification]}
  >
    <GridField gridArea={`${2 + index}/ 1 / ${2 + index} / 3`}>
      <FieldLabel>{notificationFields[notification]}</FieldLabel>
    </GridField>
    <GridField gridArea={`${2 + index} / 3 / ${2 + index} / 4`}>
      <Radio value="email" />
    </GridField>
    <GridField gridArea={`${2 + index} / 4 / ${2 + index} / 5`}>
      <Radio value="slack" />
    </GridField>
    <GridField gridArea={`${2 + index} / 5 / ${2 + index} / 6`}>
      <Radio value="" />
    </GridField>
  </GridCapableRadioGroup>
);

const GridCapableRadioGroup = styled(Radio.Group)`
  display: contents;
`;

const GridField = styled.div`
  height: ${size.l};
  grid-area: ${(props: { gridArea: string }): string => props.gridArea};
`;

const FieldLabel = styled.span`
  font-size: ${fontSize.m};
`;
