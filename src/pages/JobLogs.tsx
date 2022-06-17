import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { H2, Subtitle } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import { StyledRouterLink, PageWrapper } from "components/styles";
import { getLobsterTestLogCompleteUrl } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  GetDisplayTaskQuery,
  GetDisplayTaskQueryVariables,
} from "gql/generated/types";
import { GET_DISPLAY_TASK } from "gql/queries";
import { usePageTitle } from "hooks";
import { PageDoesNotExist } from "pages/404";
import { JobLogsTable } from "pages/jobLogs/JobLogsTable";

export const JobLogs = () => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useJobLogsAnalytics();

  const { taskId, execution: execStr, groupId } = useParams<{
    taskId: string;
    execution: string;
    groupId: string;
  }>();
  const execution = parseInt(execStr, 10);
  usePageTitle(`Job Logs - ${taskId}`);

  const {
    data: displayTaskResult,
    loading: isLoadingDisplayTask,
    error: errorDisplayTask,
  } = useQuery<GetDisplayTaskQuery, GetDisplayTaskQueryVariables>(
    GET_DISPLAY_TASK,
    {
      variables: { taskId, execution },
      onError: (err) =>
        dispatchToast.error(
          `There was an error loading the task: ${err.message}`
        ),
    }
  );

  if (errorDisplayTask) {
    return <PageDoesNotExist />;
  }

  const task = displayTaskResult?.task?.displayTask ?? displayTaskResult?.task;
  const isDisplayTask = displayTaskResult?.task.executionTasks;

  return (
    <PageWrapper>
      <ContentWrapper>
        {isLoadingDisplayTask ? (
          <Skeleton paragraph={{ rows: 8 }} />
        ) : (
          <>
            <TaskMetadata>
              <H2>
                <StyledRouterLink
                  to={getTaskRoute(task?.id)}
                  data-cy="task-link"
                >
                  {task?.id}
                </StyledRouterLink>
              </H2>
              <SubtitleContainer>
                <Subtitle data-cy="execution">
                  Execution: {task?.execution}
                </Subtitle>
                {groupId && (
                  <Subtitle data-cy="groupId">Job Number: {groupId}</Subtitle>
                )}
              </SubtitleContainer>
            </TaskMetadata>

            {!isDisplayTask && (
              <CompleteLogsLink>
                <Button
                  data-cy="complete-test-logs-link"
                  href={getLobsterTestLogCompleteUrl({
                    taskId,
                    groupId,
                    execution,
                  })}
                  target="_blank"
                  onClick={() => {
                    sendEvent({ name: "Clicked complete logs link", taskId });
                  }}
                >
                  Complete logs for all tests
                </Button>
              </CompleteLogsLink>
            )}

            <JobLogsTable task={task} groupId={groupId} />
          </>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
};

const SubtitleContainer = styled.div`
  margin: ${size.xs} 0 ${size.m} 0;
`;
const CompleteLogsLink = styled.div`
  margin-bottom: ${size.s};
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${size.s};
`;
const TaskMetadata = styled.div`
  word-break: break-all;
`;
