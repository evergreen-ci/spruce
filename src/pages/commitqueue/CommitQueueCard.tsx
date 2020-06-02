import React from "react";
import styled from "@emotion/styled";
import { useMutation } from "@apollo/react-hooks";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { uiColors } from "@leafygreen-ui/palette";
import Button from "@leafygreen-ui/button";
import { CodeChangeModule } from "pages/commitqueue/codeChangesModule/CodeChangesModule";
import { StyledRouterLink } from "components/styles/StyledLink";
import {
  ModuleCodeChange,
  RemovePatchFromCommitQueueMutation,
  RemovePatchFromCommitQueueMutationVariables,
} from "gql/generated/types";
import { paths } from "constants/routes";
import { format } from "date-fns";
import { REMOVE_PATCH_FROM_COMMIT_QUEUE } from "gql/mutations/remove-patch-from-commit-queue";

const FORMAT_STR = "MM/dd/yy' at 'hh:mm:ss' 'aa";

interface Props {
  index: number;
  title: string;
  author: string;
  commitTime: Date;
  patchId: string;
  moduleCodeChanges: ModuleCodeChange[];
  commitQueueId: string;
}
const { blue, gray } = uiColors;

export const CommitQueueCard: React.FC<Props> = ({
  index,
  title,
  author,
  commitTime,
  patchId,
  moduleCodeChanges,
  commitQueueId,
}) => {
  const [removePatchFromCommitQueue, { loading, error }] = useMutation<
    RemovePatchFromCommitQueueMutation,
    RemovePatchFromCommitQueueMutationVariables
  >(REMOVE_PATCH_FROM_COMMIT_QUEUE);
  const handleEnroll = async (e): Promise<void> => {
    e.preventDefault();
    try {
      await removePatchFromCommitQueue({
        variables: { patchId, commitQueueId },
        refetchQueries: ["CommitQueue"],
      });
    } catch (err) {
      // console.log(err); // TODO: Replace this with better error handling
    }
  };
  return (
    <Card data-cy="commit-queue-card">
      <Subtitle>{index}.</Subtitle>
      <CommitQueueCardGrid>
        <CommitInfo>
          <CardTitle to={`${paths.version}/${patchId}`}>{title}</CardTitle>
          <CardMetaData>
            By <b>{author}</b> on {format(new Date(commitTime), FORMAT_STR)}
          </CardMetaData>
          <>
            {moduleCodeChanges.map((moduleCodeChange) => (
              <CodeChangeModule
                key={moduleCodeChange.rawLink}
                moduleCodeChange={moduleCodeChange}
              />
            ))}
          </>
        </CommitInfo>
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
