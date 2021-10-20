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

interface WaterfallTaskStatusIconProps {
  taskId: string;
  status: string;
  displayName: string;
  timeTaken?: number;
}

export const WaterfallTaskStatusIcon: React.FC<WaterfallTaskStatusIconProps> = ({
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
        <IconButton
          onMouseOver={loadDataCb}
          onFocus={loadDataCb}
          key={`task_${taskId}`}
          aria-label="task icon"
          as={Link}
          to={getTaskRoute(taskId)}
          data-cy="task-icon"
        >
          <TaskStatusIcon status={status} size={16} />
        </IconButton>
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
