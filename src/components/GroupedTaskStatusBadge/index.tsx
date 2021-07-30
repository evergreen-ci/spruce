import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { taskStatusToCopy } from "constants/task";
import { TaskStatus } from "types/task";

const { gray, red, yellow, green } = uiColors;
interface Props {
  status: TaskStatus;
  count: number;
  href?: string;
  onClick?: () => void;
}
export const GroupedTaskStatusBadge: React.FC<Props> = ({
  count,
  status,
  href = "",
  onClick = () => undefined,
}) => {
  let statusDisplayName = taskStatusToCopy[status];
  if (statusDisplayName.slice(-1) === "s" && count !== 1) {
    statusDisplayName += "es";
  } else if (statusDisplayName.slice(-1) === "e" && count !== 1) {
    statusDisplayName += "s";
  }

  return (
    <BadgeContainer
      css={statusToColorVariant[status]}
      onClick={onClick}
      to={href}
      clickable={href !== ""}
    >
      <Number css={statusToColorVariant[status]}>{count}</Number>
      <Status css={statusToColorVariant[status]}>{statusDisplayName}</Status>
    </BadgeContainer>
  );
};

const BadgeContainer = styled.div<{ clickable: boolean }>`
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
  ${({ clickable }) => clickable && `cursor: pointer`};
`;

const Number = styled(Body)`
  font-weight: bold;
  font-size: 11px;
  line-height: 10px;
`;

const Status = styled(Body)`
  font-size: 8px;
  line-height: 10px;
`;

const statusToColorVariant = {
  [TaskStatus.Failed]: css`
    background-color: ${red.light3};
    border-color: ${red.light2};
    color: ${red.dark2};
  `,
  [TaskStatus.SetupFailed]: css`
    background-color: #f1f0fc;
    border-color: #d5d4f9;
    color: #4f4fbf;
  `,
  [TaskStatus.Succeeded]: css`
    background-color: ${green.light3};
    border-color: ${green.light2};
    color: ${green.dark2};
  `,
  [TaskStatus.Started]: css`
    background-color: ${yellow.light3};
    border-color: ${yellow.light2};
    color: ${yellow.dark2};
  `,
  [TaskStatus.SystemFailed]: css`
    background-color: #4f4fbf;
    border-color: #36367f;
    color: #f1f0fc;
  `,
  [TaskStatus.Undispatched]: css`
    background-color: ${gray.light3};
    border-color: ${gray.light2};
    color: ${gray.dark1};
  `,
  [TaskStatus.WillRun]: css`
    background-color: ${gray.dark1};
    border-color: ${gray.dark2};
    color: ${gray.light3};
  `,
};
