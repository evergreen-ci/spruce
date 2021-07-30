import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { taskStatusToCopy } from "constants/task";
import { TaskStatus } from "types/task";

interface Props {
  status: TaskStatus;
  count: number;
}
export const GroupedTaskStatusBadge: React.FC<Props> = ({ count, status }) => {
  let statusDisplayName = taskStatusToCopy[status];
  if (statusDisplayName.slice(-1) === "s" && count !== 1) {
    statusDisplayName += "es";
  } else if (statusDisplayName.slice(-1) === "e" && count !== 1) {
    statusDisplayName += "s";
  }

  return (
    <BadgeContainer css={statusToColorVariant[status]}>
      <Number css={statusToColorVariant[status]}>{count}</Number>
      <Status css={statusToColorVariant[status]}>{statusDisplayName}</Status>
    </BadgeContainer>
  );
};

const BadgeContainer = styled.div`
  height: 27px;
  width: 57px;
  border-radius: 3px;
  border: 1px solid;
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
`;

const Status = styled(Body)`
  font-size: 8px;
  letter-spacing: 0.13px;
  line-height: 10px;
`;

const statusToColorVariant = {
  [TaskStatus.Failed]: css`
    background-color: ${uiColors.red.light3};
    border-color: ${uiColors.red.light2};
    color: ${uiColors.red.dark2};
  `,
  [TaskStatus.SetupFailed]: css`
    background-color: #f1f0fc;
    border-color: #d5d4f9;
    color: #4f4fbf;
  `,
  [TaskStatus.Succeeded]: css`
    background-color: ${uiColors.green.light3};
    border-color: ${uiColors.green.light2};
    color: ${uiColors.green.dark2};
  `,
  [TaskStatus.Started]: css`
    background-color: ${uiColors.yellow.light3};
    border-color: ${uiColors.yellow.light2};
    color: ${uiColors.yellow.dark2};
  `,
  [TaskStatus.SystemFailed]: css`
    background-color: #4f4fbf;
    border-color: #36367f;
    color: #f1f0fc;
  `,
  [TaskStatus.Undispatched]: css`
    background-color: ${uiColors.gray.light3};
    border-color: ${uiColors.gray.light2};
    color: ${uiColors.gray.dark1};
  `,
  [TaskStatus.WillRun]: css`
    background-color: ${uiColors.gray.dark1};
    border-color: ${uiColors.gray.dark2};
    color: ${uiColors.gray.light3};
  `,
};
