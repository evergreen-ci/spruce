import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import Badge, { Variant } from "components/Badge";
import {
  mapGroupedStatusToColor,
  taskStatusToCopy,
  mapGroupedStatusToBorderColor,
  VariantPurple,
} from "constants/task";
import { TaskStatus } from "types/task";

interface Props {
  status: TaskStatus;
  count: number;
}
export const GroupedTaskStatusBadge: React.FC<Props> = ({ count, status }) => {
  return (
    <StyledBadge variant={statusToBadgeVariant[status as TaskStatus]}>
      <Number>{count}</Number>
      <Status>{taskStatusToCopy[status]}</Status>
    </StyledBadge>
  );
};

const statusToBadgeVariant = {
  [TaskStatus.Succeeded]: Variant.Green,
  [TaskStatus.Failed]: Variant.Red,
  [TaskStatus.Started]: Variant.Yellow,
  [TaskStatus.Undispatched]: Variant.LightGray,
  [TaskStatus.WillRun]: Variant.DarkGray,
  [TaskStatus.SystemFailed]: VariantPurple.DarkPurple,
  [TaskStatus.SetupFailed]: VariantPurple.LightPurple,
};

const StyledBadge = styled(Badge)`
  height: 27px;
  width: 55px;
  border-radius: 3px;
  box-sizing: border-box;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const Number = styled(Body)`
  font-weight: bold;
  font-size: 11px;
  letter-spacing: 0.18px;
  line-height: 10px;
  color: #116149;
`;

const Status = styled(Body)`
  font-size: 8px;
  letter-spacing: 0.13px;
  line-height: 10px;
  color: #116149;
`;
