import React from "react";
import styled from "@emotion/styled";
import { Tooltip } from "antd";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import {
  mapVariantTaskStatusToColor,
  mapVariantTaskStatusToDarkColor,
} from "components/StatusSquare";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute } from "constants/routes";

interface Props {
  count: number;
  status: string;
}

export const GroupedTaskSquare: React.FC<Props> = ({ status, count }) => {
  const patchAnalytics = usePatchAnalytics();
  const { id } = useParams<{ id: string }>();
  const filteredRoute = `${getVersionRoute(id)}?page=0&statuses=${status}`;
  return (
    <StyledRouterLink
      to={filteredRoute}
      data-cy="task-square"
      onClick={() =>
        patchAnalytics.sendEvent({
          name: "Click Grouped Task Square",
          taskSquareStatus: status,
        })
      }
    >
      <Tooltip
        title={
          <span data-cy="task-square-tooltip">
            {count} {count > 1 ? "task's" : "task"} with status {status}
          </span>
        }
      >
        <TaskSquare status={status}>{count}</TaskSquare>
      </Tooltip>
    </StyledRouterLink>
  );
};

interface TaskSquareProps {
  status: string;
}
const TaskSquare = styled.div<TaskSquareProps>`
  ${({ status }) =>
    `
    border: 1.3px solid ${mapVariantTaskStatusToColor[status]};
    color: ${mapVariantTaskStatusToDarkColor[status]};
    `};
  padding: 7px;
  margin: 0 3px;
  border-radius: 3px;
  box-sizing: border-box;
`;
