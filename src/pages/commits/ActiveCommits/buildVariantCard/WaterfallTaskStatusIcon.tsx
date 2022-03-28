import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
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
import { useCommits } from "../../CommitsContext";

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
  const { hoveredTaskIcon, setTaskIcon } = useCommits();
  const shouldHighlight = !hoveredTaskIcon || identifier === hoveredTaskIcon;

  const [loadData, { data, loading }] = useLazyQuery<
    GetFailedTaskStatusIconTooltipQuery,
    GetFailedTaskStatusIconTooltipQueryVariables
  >(GET_FAILED_TASK_STATUS_ICON_TOOLTIP, { variables: { taskId } });
  const { testResults, filteredTestCount } = data?.taskTests ?? {};
  const failedTestDifference = filteredTestCount - testResults?.length;

  const onHover = () => {
    setTaskIcon(identifier);
    // Only query failing test names if the task has failed.
    if (isFailedTaskStatus(status)) {
      loadData();
    }
  };
  const onUnhover = () => {
    setTaskIcon(null);
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
          onMouseLeave={onUnhover}
          key={`task_${taskId}`}
          aria-label={`${status} icon`}
          to={getTaskRoute(taskId)}
          data-cy="waterfall-task-status-icon"
        >
          <StyledTaskStatusIcon
            status={status}
            size={16}
            highlight={shouldHighlight}
          />
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
  height: ${size.m};
  width: ${size.m};
  padding: ${size.xxs};
  border-radius: 50%;
  cursor: pointer;
`;
const StyledTaskStatusIcon = styled(TaskStatusIcon)<{ highlight: boolean }>`
  opacity: ${({ highlight }) => (highlight ? 1 : 0.25)};
`;
