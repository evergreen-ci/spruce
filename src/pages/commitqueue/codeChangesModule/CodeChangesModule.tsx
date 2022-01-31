import React from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { Accordion } from "components/Accordion";
import { CodeChangesBadge } from "components/CodeChangesBadge";
import { CodeChangesTable } from "components/CodeChangesTable";
import { size } from "constants/tokens";
import {
  FileDiffsFragment,
  ModuleCodeChangeFragment,
} from "gql/generated/types";
import { bucketByCommit } from "./bucketByCommit";

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
  moduleCodeChange: ModuleCodeChangeFragment;
}> = ({ moduleCodeChange }) => {
  const { fileDiffs } = moduleCodeChange;

  const modules = bucketByCommit(fileDiffs).map((commitDiffs) => {
    const { description } = commitDiffs[0] ?? {};
    return (
      <CodeChangeModuleContainer key={`code_change_${description}`}>
        {description && (
          <CommitName data-cy="commit-name">{description}</CommitName>
        )}
        <Accordion
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
  font-size: ${size.s}px;
`;

const CommitName = styled(Body)`
  font-size: 18px;
  padding-bottom: 10px;
`;
