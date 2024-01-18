import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, H3 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import { PageWrapper, StyledRouterLink } from "components/styles";
import { getParsleyBuildLogURL } from "constants/externalResources";
import { getTaskRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  LogkeeperBuildMetadataQuery,
  LogkeeperBuildMetadataQueryVariables,
} from "gql/generated/types";
import { LOGKEEPER_BUILD_METADATA } from "gql/queries";
import { usePageTitle } from "hooks";
import { JobLogsTable } from "./jobLogs/JobLogsTable";

export const JobLogs = () => {
  const { buildId } = useParams<{ buildId: string }>();
  const dispatchToast = useToastContext();
  const { sendEvent } = useJobLogsAnalytics();

  usePageTitle(`Job Logs - ${buildId}`);

  const { data } = useQuery<
    LogkeeperBuildMetadataQuery,
    LogkeeperBuildMetadataQueryVariables
  >(LOGKEEPER_BUILD_METADATA, {
    variables: { buildId },
    onError: (err) => {
      dispatchToast.error(
        `There was an error retrieving logs for this build: ${err.message}`,
      );
    },
  });

  if (!data) return null;

  const {
    logkeeperBuildMetadata: { buildNum, builder, taskExecution, taskId, tests },
  } = data;

  return (
    <PageWrapper>
      <ContentWrapper>
        <TaskMetadata>
          <H3>
            {builder} – {buildNum}
          </H3>
          {taskId && (
            <Body>
              Task:{" "}
              <StyledRouterLink
                to={getTaskRoute(taskId, { execution: taskExecution })}
                data-cy="task-link"
              >
                {taskId}
              </StyledRouterLink>
            </Body>
          )}
        </TaskMetadata>

        <CompleteLogsLink>
          <Button
            href={getParsleyBuildLogURL(buildId)}
            data-cy="complete-test-logs-link"
            target="_blank"
            onClick={() => {
              sendEvent({ name: "Clicked complete logs link", buildId });
            }}
          >
            Complete logs for all tests
          </Button>
        </CompleteLogsLink>
        <JobLogsTable buildId={buildId} tests={tests} />
      </ContentWrapper>
    </PageWrapper>
  );
};

const CompleteLogsLink = styled.div`
  margin: ${size.s} 0;
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
