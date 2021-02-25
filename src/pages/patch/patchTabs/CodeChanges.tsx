import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { CodeChangesBadge } from "components/CodeChangesBadge";
import { CodeChangesTable } from "components/CodeChangesTable";
import { H2 } from "components/Typography";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
} from "gql/generated/types";
import { GET_CODE_CHANGES } from "gql/queries";

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

        const sortedFileDiffs = [...fileDiffs].sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        const additions = fileDiffs.reduce(
          (total, diff) => total + diff.additions,
          0
        );
        const deletions = fileDiffs.reduce(
          (total, diff) => total + diff.deletions,
          0
        );
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
            <CodeChangesTable fileDiffs={sortedFileDiffs} />
          </Container>
        );
      })}
    </div>
  );
};

// @ts-expect-error
const StyledButton = styled(Button)`
  margin-right: 16px;
`;

const Title = styled(H2)`
  font-weight: normal;
  margin-right: 16px;
`;

const Container = styled.div`
  padding-bottom: 48px;
`;
