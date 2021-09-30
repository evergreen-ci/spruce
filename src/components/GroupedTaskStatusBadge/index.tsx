import styled from "@emotion/styled";
import { taskStatusToCopy, mapUmbrellaStatusColors } from "constants/task";

interface Props {
  status: string;
  count: number;
  onClick?: () => void;
  statusCounts?: { [key: string]: number };
}
export const GroupedTaskStatusBadge: React.FC<Props> = ({
  count,
  status,
  onClick = () => undefined,
}) => {
  let statusDisplayName = taskStatusToCopy[status];
  if (statusDisplayName.slice(-1) === "s" && count !== 1) {
    statusDisplayName += "es";
  } else if (statusDisplayName.slice(-1) === "e" && count !== 1) {
    statusDisplayName += "s";
  }

  return (
    <BadgeContainer {...mapUmbrellaStatusColors[status]} onClick={onClick}>
      <Number>{count}</Number>
      <Status>{statusDisplayName}</Status>
    </BadgeContainer>
  );
};

interface BadgeColorProps {
  border?: string;
  fill?: string;
  text?: string;
  onClick: () => void;
}

const BadgeContainer = styled.div<BadgeColorProps>`
  height: 28px;
  width: 60px;
  border-radius: 3px;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  ${({ onClick }) => onClick && `cursor: pointer`};
  ${({ border }) => border && `border-color: ${border};`}
  ${({ fill }) => fill && `background-color: ${fill};`}
  ${({ text }) => text && `color: ${text};`}
`;

const Number = styled.span`
  font-size: 11px;
  font-weight: bold;
  line-height: 8px;
`;

const Status = styled.span`
  font-size: 8px;
  line-height: 8px;
`;
