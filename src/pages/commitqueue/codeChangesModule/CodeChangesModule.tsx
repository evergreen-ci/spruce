import React from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { Accordian } from "components/Accordian";
import { CodeChangesBadge } from "components/CodeChangesBadge";
import { CodeChangesTable } from "components/CodeChangesTable";
import { FileDiffsFragment, ModuleCodeChange } from "gql/generated/types";
import { bucketByCommit } from "utils/fileDiffs/bucketByCommit";

const totalFileDiffs = (
  fileDiffs: FileDiffsFragment[]
): { additions: number; deletions: number } => {
  let additions = 0;
  let deletions = 0;
  fileDiffs.forEach((fileDiff) => {
    additions += fileDiff.additions;
    deletions += fileDiff.deletions;
  });
  return { additions, deletions };
};

export const CodeChangeModule: React.FC<{
  moduleCodeChange: ModuleCodeChange;
}> = ({ moduleCodeChange }) => {
  const { fileDiffs } = moduleCodeChange;

  const modules = bucketByCommit(fileDiffs).map((commitDiffs) => {
    const { description } = commitDiffs[0] ?? {};
    return (
      <CodeChangeModuleContainer>
        {description && (
          // This spans purpose is to hold data-cy
          <span data-cy="commit-name">
            <CommitName>{description}</CommitName>
          </span>
        )}
        <Accordian
          title={
            <DropDownText>
              <DropDownTextStyle>Total Code changes</DropDownTextStyle>
              <CodeChangesBadge {...totalFileDiffs(commitDiffs)} />
            </DropDownText>
          }
          contents={
            <CodeChangesTable fileDiffs={commitDiffs} showHeader={false} />
          }
        />
      </CodeChangeModuleContainer>
    );
  });

  return <>{modules}</>;
};

const CodeChangeModuleContainer = styled.div`
  padding-bottom: 38px;
`;

const DropDownTextStyle = styled("span")`
  margin-right: 24px;
`;

const DropDownText = styled(Body)`
  font-size: 16px;
`;

const CommitName = styled(Body)`
  font-size: 18px;
  padding-bottom: 10px;
`;
