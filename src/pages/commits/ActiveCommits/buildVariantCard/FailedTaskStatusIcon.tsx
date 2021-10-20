import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { Link } from "react-router-dom";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getTaskRoute } from "constants/routes";
import {
  GetFailedTaskStatusIconTooltipQuery,
  GetFailedTaskStatusIconTooltipQueryVariables,
} from "gql/generated/types";
import { GET_FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import { isFailedTaskStatus } from "utils/statuses";
import { msToDuration } from "utils/string";

interface FailedStatusIconProps {
  taskId: string;
  status: string;
  displayName: string;
  timeTaken?: number;
}

export const FailedTaskStatusIcon: React.FC<FailedStatusIconProps> = ({
  taskId,
  status,
  displayName,
  timeTaken,
}) => {
  const [loadData, { data, loading }] = useLazyQuery<
    GetFailedTaskStatusIconTooltipQuery,
    GetFailedTaskStatusIconTooltipQueryVariables
  >(GET_FAILED_TASK_STATUS_ICON_TOOLTIP, { variables: { taskId } });
  console.log(taskId);
  const { testResults } = data?.taskTests ?? {};
  const loadDataCb = () => {
    console.log("considering", status);
    if (isFailedTaskStatus(status)) {
      console.log("loading data");
      loadData();
    }
  };
  console.log({ data, loading });
  return (
    <Tooltip
      usePortal={false}
      align="top"
      justify="middle"
      popoverZIndex={1}
      trigger={
        <div
          onMouseOver={loadDataCb}
          onFocus={loadDataCb}
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
        </div>
      }
      triggerEvent="hover"
    >
      <div data-cy="failed-task-status-icon-tooltip">
        <TooltipTitle
          data-cy="failed-task-status-icon-tooltip-title"
          weight="medium"
        >
          {displayName} {timeTaken && `- ${msToDuration(timeTaken)}`}
        </TooltipTitle>
        {loading ? (
          <Skeleton />
        ) : (
          <>
            {testResults?.map(({ id, testFile }) => (
              <TestName key={id}>{testFile}</TestName>
            ))}
          </>
        )}
      </div>
    </Tooltip>
  );
};
const TestName = styled.div`
  word-break: break-all;
`;
const TooltipTitle = styled(Body)`
  white-space: nowrap;
`;
