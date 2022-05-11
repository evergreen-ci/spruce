import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getVersionRoute } from "constants/routes";
import {
  taskStatusToCopy,
  mapUmbrellaStatusColors,
  mapUmbrellaStatusToQueryParam,
} from "constants/task";
import { fontSize, size, zIndex } from "constants/tokens";
import { TaskStatus } from "types/task";
import { queryString, string } from "utils";

const { applyStrictRegex } = string;
const { parseQueryString } = queryString;

interface Props {
  status: TaskStatus;
  count: number;
  onClick?: () => void;
  statusCounts?: { [key: string]: number };
  versionId: string;
  variant?: string;
  preserveSorts?: boolean;
}

export const GroupedTaskStatusBadge: React.VFC<Props> = ({
  count,
  status,
  onClick = () => undefined,
  statusCounts,
  versionId,
  variant,
  preserveSorts = false,
}) => {
  const { search } = useLocation();
  const { sorts } = parseQueryString(search);

  const href = getVersionRoute(versionId, {
    ...(preserveSorts && { sorts }),
    ...(variant && { variant: applyStrictRegex(variant) }),
    statuses: mapUmbrellaStatusToQueryParam[status],
  });

  const { fill, border, text } = mapUmbrellaStatusColors[status];

  return (
    <Tooltip
      enabled={!!statusCounts}
      align="top"
      justify="middle"
      popoverZIndex={zIndex.tooltip}
      trigger={
        <div>
          <Link
            to={href}
            onClick={() => onClick()}
            data-cy="grouped-task-status-badge"
          >
            <BadgeContainer fill={fill} border={border} text={text}>
              <Number>{count}</Number>
              <Status>{taskStatusToCopy[status]}</Status>
            </BadgeContainer>
          </Link>
        </div>
      }
      triggerEvent="hover"
    >
      <div data-cy="grouped-task-status-badge-tooltip">
        {statusCounts &&
          Object.entries(statusCounts).map(([taskStatus, taskCount]) => (
            <Row key={taskStatus}>
              <TaskStatusIcon status={taskStatus} size={16} />
              <span>
                <Count>{taskCount}</Count>{" "}
                {taskStatusToCopy[taskStatus] ?? taskStatus}
              </span>
            </Row>
          ))}
      </div>
    </Tooltip>
  );
};

interface BadgeColorProps {
  border?: string;
  fill?: string;
  text?: string;
}

const BadgeContainer = styled.div<BadgeColorProps>`
  height: ${size.l};
  width: ${size.xl};
  border-radius: ${size.xxs};
  border: 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  ${({ border }) => border && `border-color: ${border};`}
  ${({ fill }) => fill && `background-color: ${fill};`}
  ${({ text }) => text && `color: ${text};`}
`;

const Row = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const Number = styled.span`
  font-size: ${fontSize.m};
  font-weight: bold;
  line-height: ${fontSize.m};
`;

const Status = styled.span`
  font-size: ${size.xs};
  white-space: nowrap;
`;

const Count = styled.span`
  font-weight: bold;
  margin-left: ${size.xxs};
`;
