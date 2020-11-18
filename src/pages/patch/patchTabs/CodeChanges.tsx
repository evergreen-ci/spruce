import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { CodeChangesTable, FileDiffText } from "components/CodeChangesTable";
import { H2 } from "components/Typography";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
} from "gql/generated/types";
import { GET_CODE_CHANGES } from "gql/queries/get-code-changes";

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
          <div key={branchName}>
            <Title>Changes on {branchName}: </Title>
            <StyledButton
              className="cy-html-diff-btn"
              size="small"
              title="Open diff as html file"
              href={htmlLink}
              target="_blank"
            >
              HTML
            </StyledButton>
            <StyledButton
              className="cy-raw-diff-btn"
              size="small"
              title="Open diff as raw file"
              href={rawLink}
              target="_blank"
            >
              Raw
            </StyledButton>
            <StyledBadge>
              <FileDiffText type="+" value={additions} />
              <FileDiffText type="-" value={deletions} />
            </StyledBadge>
            <CodeChangesTable fileDiffs={sortedFileDiffs} />
          </div>
        );
      })}
    </div>
  );
};

const StyledButton = styled(Button)`
  margin-left: 16px;
`;

const Title = styled(H2)`
  font-weight: normal;
`;

const StyledBadge = styled(Badge)`
  margin-left: 16px;
`;
