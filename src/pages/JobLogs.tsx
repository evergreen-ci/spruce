import { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { H2, Subtitle, Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import { StyledRouterLink, StyledLink } from "components/styles";
import { getLobsterTestLogUrl } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  GetDisplayTaskQuery,
  GetDisplayTaskQueryVariables,
  GetTestsQuery,
  GetTestsQueryVariables,
} from "gql/generated/types";
import { GET_DISPLAY_TASK, GET_TESTS } from "gql/queries";
import { PageDoesNotExist } from "pages/404";

export const JobLogs = () => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useJobLogsAnalytics();
  const { taskId, execution: execStr, groupId } = useParams<{
    taskId: string;
    execution: string;
    groupId: string;
  }>();
  const execution = parseInt(execStr, 10);
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
  const [
    getTests,
    { data: testsResult, loading: isLoadingTests, error: errorTests },
  ] = useLazyQuery<GetTestsQuery, GetTestsQueryVariables>(GET_TESTS, {
    onError: (err) =>
      dispatchToast.error(
        `There was an error loading test result data: ${err.message}`
      ),
  });

  const task = displayTaskResult?.task?.displayTask ?? displayTaskResult?.task;
  useEffect(() => {
    if (task) {
      getTests({
        variables: {
          taskId: task.id,
          execution: task.execution,
          ...(groupId && { groupId }),
        },
      });
    }
  }, [task, groupId, getTests]);

  if (errorTests || errorDisplayTask) {
    return <PageDoesNotExist />;
  }

  return isLoadingDisplayTask || isLoadingTests ? (
    <Skeleton paragraph={{ rows: 8 }} />
  ) : (
    <Row>
      <Card>
        <Column>
          <>
            <H2>
              <StyledRouterLink to={getTaskRoute(task?.id)} data-cy="task-link">
                {task?.id}
              </StyledRouterLink>
            </H2>
            <SubtitleContainer>
              <Subtitle>
                Execution: <span data-cy="execution">{task?.execution}</span>
                <br />
                {groupId && (
                  <>
                    Job Number: <span data-cy="groupId">{groupId}</span>
                  </>
                )}
              </Subtitle>
            </SubtitleContainer>
          </>
          {testsResult?.taskTests.testResults.map(
            ({ id, lineNum, displayTestName, testFile, ...test }) => (
              <StyledLink
                href={getLobsterTestLogUrl({
                  taskId: test.taskId,
                  execution: test.execution,
                  testId: id,
                  lineNum,
                })}
                data-cy="testlog-link"
                key={id}
                onClick={() => {
                  sendEvent({
                    name: "Clicked lobster testlog url",
                    testId: id,
                  });
                }}
              >
                {displayTestName || testFile}
              </StyledLink>
            )
          )}
          {testsResult?.taskTests.testResults.length === 0 && (
            <Body>No test test found.</Body>
          )}
        </Column>
      </Card>
    </Row>
  );
};

const SubtitleContainer = styled.div`
  margin-bottom: 16px;
`;
const Row = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  word-break: break-all;
`;
