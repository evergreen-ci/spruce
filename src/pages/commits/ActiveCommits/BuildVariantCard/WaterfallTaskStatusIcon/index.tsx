import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { Link } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getTaskRoute } from "constants/routes";
import { size, zIndex } from "constants/tokens";
import {
  FailedTaskStatusIconTooltipQuery,
  FailedTaskStatusIconTooltipQueryVariables,
} from "gql/generated/types";
import { FAILED_TASK_STATUS_ICON_TOOLTIP } from "gql/queries";
import {
  injectGlobalHighlightStyle,
  removeGlobalHighlightStyle,
} from "pages/commits/ActiveCommits/utils";
import { TASK_ICON_HEIGHT } from "pages/commits/constants";
import { isFailedTaskStatus } from "utils/statuses";
import { msToDuration } from "utils/string";

interface WaterfallTaskStatusIconProps {
  taskId: string;
  status: string;
  displayName: string;
  timeTaken?: number;
  identifier: string;
  failedTestCount?: number;
}

let timeout;
export const WaterfallTaskStatusIcon: React.FC<
  WaterfallTaskStatusIconProps
> = ({
  displayName,
  failedTestCount,
  identifier,
  status,
  taskId,
  timeTaken,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const [enabled, setEnabled] = useState(false);
  const [loadData, { data, loading }] = useLazyQuery<
    FailedTaskStatusIconTooltipQuery,
    FailedTaskStatusIconTooltipQueryVariables
  >(FAILED_TASK_STATUS_ICON_TOOLTIP, { variables: { taskId } });

  const { filteredTestCount, testResults } = data?.task?.tests ?? {};
  const failedTestDifference = filteredTestCount - (testResults ?? []).length;

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (enabled) {
      injectGlobalHighlightStyle(identifier);
      timeout = setTimeout(() => {
        // Only query failing test names if the task has failed.
        if (isFailedTaskStatus(status) && failedTestCount > 0) {
          loadData();
        }
      }, 600);
    } else {
      removeGlobalHighlightStyle();
    }
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Tooltip
      align="top"
      justify="middle"
      popoverZIndex={zIndex.tooltip}
      enabled={enabled}
      trigger={
        <Link
          onMouseEnter={() => setEnabled(true)}
          onMouseLeave={() => setEnabled(false)}
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
        </Link>
      }
    >
      <div data-cy="waterfall-task-status-icon-tooltip">
        <Body
          data-cy="waterfall-task-status-icon-tooltip-title"
          weight="medium"
        >
          {displayName} {timeTaken && `- ${msToDuration(timeTaken)}`}
        </Body>
        {loading ? (
          <Skeleton />
        ) : (
          <div>
            <TestList>
              {testResults?.map(({ id, testFile }) => (
                <TestName key={id}>{testFile}</TestName>
              ))}
            </TestList>
            {failedTestDifference > 0 && (
              <div>and {failedTestDifference} more</div>
            )}
          </div>
        )}
      </div>
    </Tooltip>
  );
};

const TestList = styled.ul`
  margin: 0;
  padding-left: 12px;
`;

const TestName = styled.li`
  word-break: break-all;
`;

const TaskStatusWrapper = styled.div`
  height: ${TASK_ICON_HEIGHT}px;
  width: ${size.m};
  padding: ${size.xxs};
`;
