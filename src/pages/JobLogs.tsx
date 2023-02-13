import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, H2, Link } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { size } from "constants/tokens";
import { usePageTitle } from "hooks";
import { environmentalVariables } from "utils";

const { isProduction } = environmentalVariables;

export const JobLogs = () => {
  const { buildId } = useParams<{ buildId: string }>();
  usePageTitle(`Job Logs - ${buildId}`);

  return (
    <PageWrapper>
      {isProduction() ? (
        <>
          <H2>⚒️ Under Construction</H2>
          <Body>
            Please visit{" "}
            <Link
              href={`https://logkeeper2.build.10gen.cc/build/${buildId}`}
              hideExternalIcon
            >
              Logkeeper
            </Link>{" "}
            to see this build&rsquo;s logs.
          </Body>
        </>
      ) : (
        <ContentWrapper>
          <TaskMetadata>
            <H2>Build {buildId}</H2>
          </TaskMetadata>

          <CompleteLogsLink>
            <Button data-cy="complete-test-logs-link" target="_blank">
              Complete logs for all tests
            </Button>
          </CompleteLogsLink>
        </ContentWrapper>
      )}
    </PageWrapper>
  );
};

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
