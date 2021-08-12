import React from "react";
import styled from "@emotion/styled";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { taskStatusToCopy, mapBadgeColors } from "constants/task";
import { TaskStatus } from "types/task";

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
      {...mapBadgeColors[status]}
      onClick={onClick}
      clickable={href !== ""}
    >
      <Number>{count}</Number>
      <Status>{statusDisplayName}</Status>
    </BadgeContainer>
  );
};

interface BadgeColorProps {
  border?: string;
  fill?: string;
  text?: string;
  clickable: boolean;
}

const BadgeContainer = styled.div<BadgeColorProps>`
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
  ${({ border }) => border && `border-color: ${border} !important;`}
  ${({ fill }) => fill && `background-color: ${fill} !important;`}
  ${({ text }) => text && `color: ${text} !important;`}
`;

const Number = styled.span`
  font-family: ${fontFamilies.default};
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.18px;
  line-height: 8px;
`;

const Status = styled.span`
  font-family: ${fontFamilies.default};
  letter-spacing: 0.13px;
  font-size: 8px;
  line-height: 8px;
`;
