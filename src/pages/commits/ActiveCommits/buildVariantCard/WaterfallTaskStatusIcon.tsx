import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { StyledRouterLink } from "components/styles";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getTaskRoute } from "constants/routes";
import { size, zIndex } from "constants/tokens";
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
  identifier: string;
}

export const WaterfallTaskStatusIcon: React.FC<WaterfallTaskStatusIconProps> = ({
  taskId,
  status,
  displayName,
  timeTaken,
  identifier,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const [loadData, { data, loading }] = useLazyQuery<
    GetFailedTaskStatusIconTooltipQuery,
    GetFailedTaskStatusIconTooltipQueryVariables
  >(GET_FAILED_TASK_STATUS_ICON_TOOLTIP, { variables: { taskId } });
  const { testResults, filteredTestCount } = data?.taskTests ?? {};
  const failedTestDifference = filteredTestCount - testResults?.length;

  const onHover = () => {
    // Only query failing test names if the task has failed.
    if (isFailedTaskStatus(status)) {
      loadData();
    }
  };

  return (
    <Tooltip
      usePortal={false}
      align="top"
      justify="middle"
      popoverZIndex={zIndex.tooltip}
      trigger={
        <IconWrapper
          onMouseEnter={onHover}
          key={`task_${taskId}`}
          aria-label={`${status} icon`}
          to={getTaskRoute(taskId)}
          onClick={() => {
            sendEvent({ name: "Click task status icon", status });
          }}
          data-cy="waterfall-task-status-icon"
        >
          <TaskStatusWrapper data-task-icon={identifier}>
            <TaskStatusIcon status={status} size={16} />
          </TaskStatusWrapper>
        </IconWrapper>
      }
      triggerEvent="hover"
    >
      <div data-cy="waterfall-task-status-icon-tooltip">
        <TooltipTitle
          data-cy="waterfall-task-status-icon-tooltip-title"
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
            {failedTestDifference > 0 && (
              <div>and {failedTestDifference} more</div>
            )}
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
const IconWrapper = styled(StyledRouterLink)`
  cursor: pointer;
`;
const TaskStatusWrapper = styled.div`
  height: ${size.m};
  width: ${size.m};
  padding: ${size.xxs};
`;
