import { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { H2, Subtitle, Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { StyledRouterLink, StyledLink } from "components/styles";
import { getLobsterTestLogUrl } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import {
  GetDisplayTaskQuery,
  GetDisplayTaskQueryVariables,
  GetTestsQuery,
  GetTestsQueryVariables,
} from "gql/generated/types";
import { GET_DISPLAY_TASK, GET_TESTS } from "gql/queries";
import { usePrevious } from "hooks";

export const TestLogs = () => {
  const { taskId, execution: execStr, groupId } = useParams<{
    taskId: string;
    execution: string;
    groupId: string;
  }>();
  const execution = parseInt(execStr, 10);
  const { data: displayTaskResult, loading: isLoadingDisplayTask } = useQuery<
    GetDisplayTaskQuery,
    GetDisplayTaskQueryVariables
  >(GET_DISPLAY_TASK, { variables: { taskId, execution } });
  const [
    getTests,
    { data: testsResult, loading: isLoadingTests },
  ] = useLazyQuery<GetTestsQuery, GetTestsQueryVariables>(GET_TESTS);

  const task = displayTaskResult?.task?.displayTask ?? displayTaskResult?.task;
  const prevTask = usePrevious(task);
  useEffect(() => {
    if (!prevTask && task) {
      getTests({
        variables: {
          taskId: task.id,
          execution: task.execution,
          groupId,
        },
      });
    }
  }, [task, prevTask, groupId, getTests]);
  const isLoading = isLoadingDisplayTask || isLoadingTests;

  console.log(
    testsResult?.taskTests.testResults.length !== undefined && isLoading
  );
  return isLoading ? (
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
                Execution: {task?.execution}
                <br />
                GroupID: {groupId}
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
                key={id}
                target="_blank"
              >
                {displayTestName || testFile}
              </StyledLink>
            )
          )}
          {testsResult?.taskTests.testResults.length === 0 && (
            <Body>No test results found.</Body>
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
