import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Description } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { CodeChangesBadge } from "components/CodeChangesBadge";
import { CodeChangesTable } from "components/CodeChangesTable";
import { H2, H3 } from "components/Typography";
import { size } from "constants/tokens";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
  FileDiffsFragment,
} from "gql/generated/types";
import { GET_CODE_CHANGES } from "gql/queries";
import { bucketByCommit } from "pages/commitqueue/codeChangesModule/bucketByCommit";

export const CodeChanges: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    CodeChangesQuery,
    CodeChangesQueryVariables
  >(GET_CODE_CHANGES, {
    variables: { id },
  });

  if (loading) {
    return <Skeleton active title paragraph={{ rows: 8 }} />;
  }
  if (error) {
    return <div id="patch-error">{error.message}</div>;
  }

  const { moduleCodeChanges } = data.patch;
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

        let modules;

        if (shouldPreserveCommits(fileDiffs)) {
          modules = bucketByCommit(fileDiffs).map((commitDiffs, idx) => {
            const { description } = commitDiffs[0] ?? {};

            const sortedFileDiffs = [...commitDiffs].sort((a, b) =>
              a.fileName.localeCompare(b.fileName)
            );

            return (
              <CodeChangeModuleContainer key={`code_change_${description}`}>
                <CommitContainer>
                  <CommitTitle data-cy="commit-name">
                    Commit {idx + 1}
                  </CommitTitle>
                  {description && (
                    <CommitMessage data-cy="commit-name">
                      {description}
                    </CommitMessage>
                  )}
                </CommitContainer>
                <CodeChangesTable fileDiffs={sortedFileDiffs} showHeader />
              </CodeChangeModuleContainer>
            );
          });
        } else {
          const sortedFileDiffs = [...fileDiffs].sort((a, b) =>
            a.fileName.localeCompare(b.fileName)
          );

          modules = <CodeChangesTable fileDiffs={sortedFileDiffs} />;
        }

        return (
          <Container key={branchName}>
            <Title>Changes on {branchName}: </Title>
            <StyledButton
              data-cy="html-diff-btn"
              size="small" // @ts-expect-error
              title="Open diff as html file"
              href={htmlLink}
              target="_blank"
            >
              HTML
            </StyledButton>
            <StyledButton
              data-cy="raw-diff-btn"
              size="small" // @ts-expect-error
              title="Open diff as raw file"
              href={rawLink}
              target="_blank"
            >
              Raw
            </StyledButton>
            <CodeChangesBadge additions={additions} deletions={deletions} />
            {modules}
          </Container>
        );
      })}
    </div>
  );
};

const shouldPreserveCommits = (fileDiffs: FileDiffsFragment[]): boolean => {
  if (fileDiffs.length && fileDiffs[0].description !== "") {
    return true;
  }
  return false;
};

// @ts-expect-error
const StyledButton = styled(Button)`
  margin-right: ${size.s};
`;

const Title = styled(H2)`
  font-weight: normal;
  margin-right: ${size.s};
  margin-bottom: ${size.s};
`;

const CommitTitle = styled(H3)`
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
`;

const CommitMessage = styled(Description)`
  margin-left: ${size.s};
`;

const CommitContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: ${size.s};
  margin-bottom: ${size.xs};
`;

const Container = styled.div`
  padding-bottom: ${size.l};
`;

const CodeChangeModuleContainer = styled.div`
  padding-bottom: ${size.l};
`;
