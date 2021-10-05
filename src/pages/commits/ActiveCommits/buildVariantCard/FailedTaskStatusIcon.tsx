import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getTaskRoute } from "constants/routes";
import {
  GetFailedTaskStatusIconTooltipQuery,
  GetFailedTaskStatusIconTooltipQueryVariables,
} from "gql/generated/types";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import { msToDuration } from "utils/string";

interface FailedStatusIconProps {
  taskId: string;
  status: string;
}
export const FailedTaskStatusIcon: React.FC<FailedStatusIconProps> = ({
  taskId,
  status,
}) => {
  const [loadData, { data }] = useLazyQuery<
    GetFailedTaskStatusIconTooltipQuery,
    GetFailedTaskStatusIconTooltipQueryVariables
  >(GET_FAILED_TASK_STATUS_ICON_TOOLTIP, { variables: { taskId } });
  const { displayName, timeTaken } = data?.task ?? {};
  const { testResults } = data?.taskTests ?? {};

  return (
    <Tooltip
      usePortal={false}
      align="top"
      justify="middle"
      popoverZIndex={1}
      trigger={
        <span
          onMouseOver={() => loadData()}
          onFocus={() => loadData()}
          data-cy="failed-task-status-icon"
        >
          <Link
            data-cy="task-status-icon"
            to={getTaskRoute(taskId)}
            key={`task_${taskId}`}
          >
            <IconButton aria-label="task icon">
              <TaskStatusIcon status={status} size={16} />
            </IconButton>
          </Link>
        </span>
      }
      triggerEvent="hover"
    >
      <div data-cy="failed-task-status-icon-tooltip">
        <TooltipTitle data-cy="failed-task-status-icon-tooltip-title">
          {displayName} - {msToDuration(timeTaken)}
        </TooltipTitle>
        {testResults?.map(({ id, testFile }) => (
          <div key={id}>{testFile}</div>
        ))}
      </div>
    </Tooltip>
  );
};

const TooltipTitle = styled.div`
  white-space: nowrap;
`;
