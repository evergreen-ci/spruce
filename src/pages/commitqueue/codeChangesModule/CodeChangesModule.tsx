import React from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { Accordian } from "components/Accordian";
import { CodeChangesTable, FileDiffText } from "components/CodeChangesTable";
import { ModuleCodeChange } from "gql/generated/types";

const totalFileDiffs = (
  fileDiffs
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
  const { additions, deletions } = totalFileDiffs(fileDiffs);
  const AccordianTitle = () => (
    <DropDownText>
      <DropDownTextStyle>Total Code changes</DropDownTextStyle>
      <span>
        <FileDiffText value={additions} type="+" />
        <FileDiffText value={deletions} type="-" />
      </span>
    </DropDownText>
  );
  return (
    <CodeChangeModuleContainer>
      <Accordian
        title={<AccordianTitle />}
        contents={<CodeChangesTable fileDiffs={fileDiffs} showHeader={false} />}
      />
    </CodeChangeModuleContainer>
  );
};

const CodeChangeModuleContainer = styled.div`
  margin-top: 16px;
  :last-child {
    margin-bottom: 32px;
  }
`;

const DropDownTextStyle = styled("span")`
  margin-right: 24px;
`;

const DropDownText = styled(Body)`
  font-size: 16px;
`;
