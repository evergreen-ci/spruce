import React from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { format } from "date-fns";
import { StyledLink, StyledRouterLink } from "components/styles/StyledLink";
import { getVersionRoute } from "constants/routes";
import {
  ModuleCodeChangeFragment,
  RemoveItemFromCommitQueueMutation,
  RemoveItemFromCommitQueueMutationVariables,
} from "gql/generated/types";
import { REMOVE_ITEM_FROM_COMMIT_QUEUE } from "gql/mutations";
import { CodeChangeModule } from "pages/commitqueue/codeChangesModule/CodeChangesModule";

const FORMAT_STR = "MM/dd/yy' at 'hh:mm:ss' 'aa";

interface Props {
  issue: string;
  index: number;
  title: string;
  author: string;
  commitTime: Date;
  patchId: string;
  owner: string;
  repo: string;
  moduleCodeChanges: ModuleCodeChangeFragment[];
  commitQueueId: string;
}
const { blue, gray } = uiColors;

export const CommitQueueCard: React.FC<Props> = ({
  issue,
  index,
  title,
  author,
  commitTime,
  patchId,
  owner,
  repo,
  moduleCodeChanges,
  commitQueueId,
}) => {
  const [removeItemFromCommitQueue, { loading, error }] = useMutation<
    RemoveItemFromCommitQueueMutation,
    RemoveItemFromCommitQueueMutationVariables
  >(REMOVE_ITEM_FROM_COMMIT_QUEUE);
  const handleEnroll = async (e): Promise<void> => {
    e.preventDefault();
    try {
      await removeItemFromCommitQueue({
        variables: { issue, commitQueueId },
        refetchQueries: ["CommitQueue"],
      });
    } catch (err) {
      // TODO show error banner
    }
  };
  return (
    <Card data-cy="commit-queue-card">
      <Subtitle>{index}.</Subtitle>
      <CommitQueueCardGrid>
        {patchId ? (
          <CommitInfo>
            <CardTitle to={getVersionRoute(patchId)}>{title}</CardTitle>
            <CardMetaData>
              By <b>{author}</b> on {format(new Date(commitTime), FORMAT_STR)}
            </CardMetaData>
            <Container>
              {moduleCodeChanges?.map((moduleCodeChange) => (
                <CodeChangeModule
                  key={moduleCodeChange.rawLink}
                  moduleCodeChange={moduleCodeChange}
                />
              ))}
            </Container>
          </CommitInfo>
        ) : (
          <CommitInfo>
            <PRCardTitle
              href={`https://github.com/${owner}/${repo}/pull/${issue}`}
            >
              Pull Request #{issue}
            </PRCardTitle>
          </CommitInfo>
        )}
        <CommitQueueCardActions>
          <Button
            data-cy="commit-queue-patch-button"
            disabled={loading}
            onClick={handleEnroll}
          >
            Remove Patch From Queue
          </Button>
          {error && <div data-cy="error-banner">{error.message}</div>}
        </CommitQueueCardActions>
      </CommitQueueCardGrid>
    </Card>
  );
};

const Card = styled.div`
  display: flex;
  margin-top: 16px;
  width: 100%;
`;
const CardTitle = styled(StyledRouterLink)`
  color: ${blue.base};
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
`;

const PRCardTitle = styled(StyledLink)`
  color: ${blue.base};
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
`;

const CommitInfo = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: 1 / 1 / 2 / 2;
  margin-left: 16px;
  margin-bottom: 24px;
  width: 100%;
`;
const CardMetaData = styled(Body)`
  color: ${gray.dark2};
`;

const CommitQueueCardGrid = styled.div`
  border-bottom: 1px solid ${gray.light2};
  display: grid;
  grid-template-columns: 4fr repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  width: 100%;
`;

const CommitQueueCardActions = styled.div`
  grid-area: 1 / 3 / 2 / 4;
`;

const Container = styled.div`
  padding-top: 24px;
`;
