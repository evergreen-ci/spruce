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
  if (!data.patch.moduleCodeChanges.length) {
    return <Title className="cy-no-code-changes">No code changes</Title>;
  }
  return (
    <div data-cy="code-changes">
      {data.patch.moduleCodeChanges.map((modCodeChange) => {
        const sortedFileDiffs = [...modCodeChange.fileDiffs].sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        const { fileDiffs } = modCodeChange;
        const TotalFileDiff = {
          additions: 0,
          deletions: 0,
        };
        TotalFileDiff.additions = fileDiffs.reduce(
          (total, diff) => total + diff.additions,
          0
        );
        TotalFileDiff.deletions = fileDiffs.reduce(
          (total, diff) => total + diff.deletions,
          0
        );
        return (
          <div key={modCodeChange.branchName}>
            <Title>Changes on {modCodeChange.branchName}: </Title>
            <StyledButton
              className="cy-html-diff-btn"
              size="small"
              title="Open diff as html file"
              href={modCodeChange.htmlLink}
              target="_blank"
            >
              HTML
            </StyledButton>
            <StyledButton
              className="cy-raw-diff-btn"
              size="small"
              title="Open diff as raw file"
              href={modCodeChange.rawLink}
              target="_blank"
            >
              Raw
            </StyledButton>
            <StyledBadge>
              <FileDiffText type="+" value={TotalFileDiff.additions} />
              <FileDiffText type="-" value={TotalFileDiff.deletions} />
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
