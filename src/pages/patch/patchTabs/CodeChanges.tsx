import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import { H2 } from "components/Typography";
import { GET_CODE_CHANGES } from "gql/queries/get-code-changes";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
} from "gql/generated/types";
import Button from "@leafygreen-ui/button";
import { CodeChangesTable } from "components/CodeChangesTable";
import styled from "@emotion/styled";

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
