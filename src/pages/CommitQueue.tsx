import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Banner from "@leafygreen-ui/banner";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { PageTitle } from "components/PageTitle";
import { ProjectSelect } from "components/ProjectSelect";
import { PageWrapper } from "components/styles";
import { getCommitQueueRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  CommitQueueQuery,
  CommitQueueQueryVariables,
} from "gql/generated/types";
import { COMMIT_QUEUE } from "gql/queries";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { CommitQueueCard } from "./commitqueue/CommitQueueCard";

const { gray } = palette;

export const CommitQueue: React.FC = () => {
  const { projectIdentifier } = useParams<{ projectIdentifier: string }>();
  const dispatchToast = useToastContext();
  const { data, loading } = useQuery<
    CommitQueueQuery,
    CommitQueueQueryVariables
  >(COMMIT_QUEUE, {
    variables: { projectIdentifier },
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the commit queue: ${err.message}`,
      );
    },
  });

  const { commitQueue } = data || {};
  const { queue } = commitQueue || {};

  return (
    <PageWrapper>
      <PageHeader>
        <Column>
          <PageTitle
            pageTitle={`Commit Queue - ${projectIdentifier}`}
            title="Commit Queue"
            badge={
              <Badge variant="darkgray">
                {buildBadgeString(queue ? queue.length : 0)}
              </Badge>
            }
            loading={loading}
            size="large"
          />
        </Column>
        <ProjectSelectWrapper>
          <ProjectSelect
            selectedProjectIdentifier={projectIdentifier}
            data-cy="commit-queue-project-select"
            getRoute={getCommitQueueRoute}
          />
        </ProjectSelectWrapper>
      </PageHeader>
      {commitQueue?.message && (
        <Banner data-cy="commit-queue-message">{commitQueue.message}</Banner>
      )}

      <HR />
      {queue ? (
        queue.map(({ enqueueTime, issue, patch }, i) => (
          <CommitQueueCard
            key={issue}
            issue={issue}
            index={formatZeroIndexForDisplay(i)}
            title={patch?.description}
            author={patch?.author}
            patchId={patch?.id}
            versionId={patch?.versionFull?.id}
            repo={commitQueue?.repo}
            owner={commitQueue?.owner}
            commitTime={enqueueTime}
            moduleCodeChanges={patch?.moduleCodeChanges}
            commitQueueId={commitQueue.projectId}
            activated={patch?.activated}
          />
        ))
      ) : (
        <Body>There are no items in this queue. </Body>
      )}
    </PageWrapper>
  );
};

const HR = styled("hr")`
  background-color: ${gray.light2};
  border: 0;
  height: 3px;
`;

const buildBadgeString = (queueLength: number): string => {
  if (queueLength !== 1) {
    return `${queueLength} Items`;
  }
  return `${queueLength} Item`;
};

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProjectSelectWrapper = styled.div`
  width: 30%;
`;
