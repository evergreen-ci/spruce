import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import {
  Body,
  BodyProps,
  Description,
  Subtitle,
  SubtitleProps,
} from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { CodeChangesBadge } from "components/CodeChangesBadge";
import { CodeChangesTable } from "components/CodeChangesTable";
import { size } from "constants/tokens";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
  FileDiffsFragment,
} from "gql/generated/types";
import { CODE_CHANGES } from "gql/queries";
import { commits } from "utils";
import { formatZeroIndexForDisplay } from "utils/numbers";

const { bucketByCommit, shouldPreserveCommits } = commits;

interface CodeChangesProps {
  patchId: string;
}
export const CodeChanges: React.FC<CodeChangesProps> = ({ patchId }) => {
  const { data, error, loading } = useQuery<
    CodeChangesQuery,
    CodeChangesQueryVariables
  >(CODE_CHANGES, {
    variables: { id: patchId },
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
        const { branchName, fileDiffs, htmlLink, rawLink } = modCodeChange;

        const additions = fileDiffs.reduce(
          (total, diff) => total + diff.additions,
          0,
        );
        const deletions = fileDiffs.reduce(
          (total, diff) => total + diff.deletions,
          0,
        );

        let codeChanges;

        if (shouldPreserveCommits(fileDiffs)) {
          codeChanges = bucketByCommit(fileDiffs).map((commitDiffs, idx) => {
            const { description } = commitDiffs[0] ?? {};
            const sortedFileDiffs = sortFileDiffs(commitDiffs);
            return (
              <CodeChangeModuleContainer key={`code_change_${description}`}>
                <CommitContainer>
                  <CommitTitle>
                    Commit {formatZeroIndexForDisplay(idx)}
                  </CommitTitle>
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

const Title = styled(Subtitle)<SubtitleProps>`
  font-weight: normal;
  margin-right: ${size.s};
  margin-bottom: ${size.s};
`;

const TitleContainer = styled.div`
  align-items: baseline;
  display: flex;
`;

const CommitTitle = styled(Body)<BodyProps>`
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
