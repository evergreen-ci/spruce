import React from "react";
import styled from "@emotion/styled";
import { Tooltip } from "antd";
import queryString from "query-string";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute } from "constants/routes";

interface Props {
  count: number;
  statuses: string[];
  color: string;
  textColor: string;
}

export const GroupedTaskSquare: React.FC<Props> = ({
  statuses,
  count,
  color,
  textColor,
}) => {
  const patchAnalytics = usePatchAnalytics();
  const { id } = useParams<{ id: string }>();

  const nextQueryParams = queryString.stringify(
    {
      statuses,
      page: 0,
    },
    { arrayFormat }
  );
  const filteredRoute = `${getVersionRoute(id)}?${nextQueryParams}`;
  const multipleStatuses = statuses.length > 1;
  const tooltipCopy = `${count} ${count > 1 ? "tasks" : "task"} with ${
    multipleStatuses ? "statuses" : "status"
  }: ${statuses.join()}`;
  return (
    <StyledRouterLink
      to={filteredRoute}
      data-cy="task-square"
      onClick={() =>
        patchAnalytics.sendEvent({
          name: "Click Grouped Task Square",
          taskSquareStatuses: statuses,
        })
      }
    >
      <Tooltip title={<span data-cy="task-square-tooltip">{tooltipCopy}</span>}>
        <TaskSquare color={color}>
          <StyledText textColor={textColor}>{count}</StyledText>
        </TaskSquare>
      </Tooltip>
    </StyledRouterLink>
  );
};

interface TaskSquareProps {
  color: string;
}
const TaskSquare = styled.div<TaskSquareProps>`
  ${({ color }) =>
    `
    background-color: ${color}80;
    `};
  margin: 0 3px;
  border-radius: 3px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface StyledTextProps {
  textColor: string;
}
const StyledText = styled.span<StyledTextProps>`
  ${({ textColor }) => `
    color: ${textColor};
    `};
  font-weight: bold;
`;

const arrayFormat = "comma";
