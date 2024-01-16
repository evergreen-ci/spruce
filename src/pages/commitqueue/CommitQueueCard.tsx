import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Subtitle, Body, BodyProps } from "@leafygreen-ui/typography";
import reactStringReplace from "react-string-replace";
import { StyledLink, StyledRouterLink } from "components/styles";
import { getGithubPullRequestUrl } from "constants/externalResources";
import { getVersionRoute } from "constants/routes";
import { size, fontSize } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  ModuleCodeChangeFragment,
  RemoveItemFromCommitQueueMutation,
  RemoveItemFromCommitQueueMutationVariables,
} from "gql/generated/types";
import { REMOVE_ITEM_FROM_COMMIT_QUEUE } from "gql/mutations";
import { useDateFormat } from "hooks";
import { string } from "utils";
import { CodeChangeModule } from "./CodeChangesModule";
import { ConfirmPatchButton } from "./ConfirmPatchButton";

const { githubPRLinkify } = string;

interface Props {
  issue: string;
  index: number;
  title: string;
  author: string;
  commitTime: Date;
  patchId: string;
  versionId: string;
  owner: string;
  repo: string;
  moduleCodeChanges: ModuleCodeChangeFragment[];
  commitQueueId: string;
  activated: boolean;
}
const { gray } = palette;

export const CommitQueueCard: React.FC<Props> = ({
  activated,
  author,
  commitQueueId,
  commitTime,
  index,
  issue,
  moduleCodeChanges,
  owner,
  patchId,
  repo,
  title,
  versionId,
}) => {
  const dispatchToast = useToastContext();
  const getDateCopy = useDateFormat();
  const [removeItemFromCommitQueue, { loading }] = useMutation<
    RemoveItemFromCommitQueueMutation,
    RemoveItemFromCommitQueueMutationVariables
  >(REMOVE_ITEM_FROM_COMMIT_QUEUE, {
    onCompleted: () => {
      dispatchToast.success("Successfully removed item from commit queue");
    },
    onError: (err) => {
      dispatchToast.error(`Error removing item from commit queue ${err}`);
    },
  });

  const handleEnroll = () => {
    removeItemFromCommitQueue({
      variables: { issue, commitQueueId },
      refetchQueries: ["CommitQueue"],
    });
  };

  // Linkify any GitHub URLs that appear in the title text.
  // If no GitHub link was found, wrap all text in a link to the version.
  // If a GitHub link was identified, wrap all text that appears before the first : with the version link.
  const versionLinkify = () => {
    const githubTitle = githubPRLinkify(title);

    if (!activated) {
      return githubTitle;
    }

    if (githubTitle.length === 1 || typeof githubTitle[0] !== "string") {
      return (
        <StyledRouterLink to={getVersionRoute(patchId)}>
          {githubTitle}
        </StyledRouterLink>
      );
    }

    // Only replace the string that occurs before the link. We don't want to run this operation on the trailing parentheses.
    const [versionString, ...rest] = githubTitle;
    const versionLink = reactStringReplace(
      versionString,
      /(^[^:]*)/g,
      (match, i) => (
        <StyledRouterLink key={`${match}${i}`} to={getVersionRoute(patchId)}>
          {match}
        </StyledRouterLink>
      ),
    );

    return (
      <>
        {versionLink}
        {rest}
      </>
    );
  };

  const noVersionLinkify = () => {
    const githubTitle = githubPRLinkify(title);

    // If a URL wasn't found in the text, construct a link to wrap the entire title
    if (githubTitle.length === 1) {
      return (
        <StyledLink href={getGithubPullRequestUrl(owner, repo, issue)}>
          {title}
        </StyledLink>
      );
    }
    return githubTitle;
  };

  return (
    <Card data-cy="commit-queue-card">
      <Subtitle>{index}.</Subtitle>
      <CommitQueueCardGrid>
        {patchId ? (
          <CommitInfo>
            <CardTitle data-cy="commit-queue-card-title">
              {!!versionId || issue === "" || Number.isNaN(Number(issue)) ? (
                <>{versionLinkify()}</>
              ) : (
                <>{noVersionLinkify()}</>
              )}
            </CardTitle>
            <CardMetaData>
              By <b>{author}</b> on {getDateCopy(commitTime)}
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
          // should only get here for pull requests not processed yet (ie. added in the past minute)
          <CommitInfo>
            <CardTitle data-cy="commit-queue-card-title">
              <StyledLink href={getGithubPullRequestUrl(owner, repo, issue)}>
                Pull Request #{issue}
              </StyledLink>
            </CardTitle>
          </CommitInfo>
        )}
        <CommitQueueCardActions>
          <ConfirmPatchButton
            disabled={loading}
            onConfirm={handleEnroll}
            commitTitle={title}
          />
        </CommitQueueCardActions>
      </CommitQueueCardGrid>
    </Card>
  );
};

const Card = styled.div`
  display: flex;
  margin-top: ${size.s};
  width: 100%;
`;

const CardTitle = styled.span`
  margin-bottom: ${size.s};
  font-size: ${fontSize.l};
  font-weight: bold;
`;

const CommitInfo = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: 1 / 1 / 2 / 2;
  margin-left: ${size.s};
  margin-bottom: ${size.m};
  width: 100%;
`;
const CardMetaData = styled(Body)<BodyProps>`
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
  padding-top: ${size.m};
`;
