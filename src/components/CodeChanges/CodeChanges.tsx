import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, Description, Subtitle } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { CodeChangesBadge } from "components/CodeChangesBadge";
import { CodeChangesTable } from "components/CodeChangesTable";
import { size } from "constants/tokens";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
  FileDiffsFragment,
} from "gql/generated/types";
import { GET_CODE_CHANGES } from "gql/queries";
import { SubtitleType } from "types/leafygreen";
import { commits } from "utils";
import { convertZeroToOneIndex } from "utils/numbers";

const { bucketByCommit, shouldPreserveCommits } = commits;

export const CodeChanges: React.VFC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    CodeChangesQuery,
    CodeChangesQueryVariables
  >(GET_CODE_CHANGES, {
    variables: { id },
  });
  const { moduleCodeChanges } = data?.patch ?? {};

  if (loading) {
    return <Skeleton active title paragraph={{ rows: 8 }} />;
  }
  if (error) {
    return <div id="patch-error">{error.message}</div>;
  }
  if (!moduleCodeChanges.length) {
    return <Title className="cy-no-code-changes">No code changes</Title>;
  }
  return (
    <div data-cy="code-changes">
      {moduleCodeChanges.map((modCodeChange) => {
        const { fileDiffs, branchName, htmlLink, rawLink } = modCodeChange;

        const additions = fileDiffs.reduce(
          (total, diff) => total + diff.additions,
          0
        );
        const deletions = fileDiffs.reduce(
          (total, diff) => total + diff.deletions,
          0
        );

        let codeChanges;

        if (shouldPreserveCommits(fileDiffs)) {
          codeChanges = bucketByCommit(fileDiffs).map((commitDiffs, idx) => {
            const { description } = commitDiffs[0] ?? {};
            const sortedFileDiffs = sortFileDiffs(commitDiffs);
            return (
              <CodeChangeModuleContainer key={`code_change_${description}`}>
                <CommitContainer>
                  <CommitTitle>Commit {convertZeroToOneIndex(idx)}</CommitTitle>
                  {description && <Description>{description}</Description>}
                </CommitContainer>
                <CodeChangesTable fileDiffs={sortedFileDiffs} />
              </CodeChangeModuleContainer>
            );
          });
        } else {
          const sortedFileDiffs = sortFileDiffs(fileDiffs);
          codeChanges = <CodeChangesTable fileDiffs={sortedFileDiffs} />;
        }

        return (
          <div key={branchName}>
            <TitleContainer>
              <Title>Changes on {branchName}: </Title>
              <StyledButton
                data-cy="html-diff-btn"
                size="small"
                title="Open diff as html file"
                href={htmlLink}
                target="_blank"
              >
                HTML
              </StyledButton>
              <StyledButton
                data-cy="raw-diff-btn"
                size="small"
                title="Open diff as raw file"
                href={rawLink}
                target="_blank"
              >
                Raw
              </StyledButton>
              <CodeChangesBadge additions={additions} deletions={deletions} />
            </TitleContainer>
            {codeChanges}
          </div>
        );
      })}
    </div>
  );
};

const sortFileDiffs = (fileDiffs: FileDiffsFragment[]): FileDiffsFragment[] =>
  [...fileDiffs].sort((a, b) => a.fileName.localeCompare(b.fileName));

const StyledButton = styled(Button)`
  margin-right: ${size.xs};
`;

// @ts-expect-error
const Title: SubtitleType = styled(Subtitle)`
  font-weight: normal;
  margin-right: ${size.s};
  margin-bottom: ${size.s};
`;

const TitleContainer = styled.div`
  align-items: baseline;
  display: flex;
`;

const CommitTitle = styled(Body)`
  flex-shrink: 0;
  font-size: 15px;
  font-weight: bold;
  margin-right: ${size.s};
`;

const CodeChangeModuleContainer = styled.div`
  padding-bottom: ${size.l};
`;

const CommitContainer = styled.div`
  display: flex;
  align-items: baseline;
  margin-top: ${size.s};
  margin-bottom: ${size.xs};
`;
