import React, { useState } from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import { ModuleCodeChanges } from "types/patch";
import {
  CodeChangeItem,
  FileDiffText,
} from "pages/commitqueue/codeChangesModule/CodeChangeItem";
import { CodeChangesTable } from "components/CodeChangesTable";

const totalFileDiffs = (fileDiffs) => {
  let additions = 0;
  let deletions = 0;
  for (let fileDiff of fileDiffs) {
    additions += fileDiff.additions;
    deletions += fileDiff.deletions;
  }
  return { additions, deletions };
};

export const CodeChangeModule: React.FC<{
  moduleCodeChange: ModuleCodeChanges;
}> = ({ moduleCodeChange }) => {
  const { fileDiffs } = moduleCodeChange;
  const { additions, deletions } = totalFileDiffs(fileDiffs);
  const [toggleAccordian, setToggleAccordian] = useState(false);
  return (
    <CodeChangeModuleContainer>
      <AccordianToggle onClick={() => setToggleAccordian(!toggleAccordian)}>
        <Icon glyph={toggleAccordian ? "CaretDown" : "CaretRight"} />
        <DropDownText>
          <DropDownTextStyle>Total Code changes</DropDownTextStyle>
          <span>
            <FileDiffText value={additions} type="+" />
            <FileDiffText value={deletions} type="-" />
          </span>
        </DropDownText>
      </AccordianToggle>
      <AnimatedAccordian hide={!toggleAccordian}>
        <CodeChangesTable fileDiffs={fileDiffs} showHeader={false} />
      </AnimatedAccordian>
    </CodeChangeModuleContainer>
  );
};

const CodeChangeModuleContainer = styled.div`
  margin-top: 16px;
`;
const AccordianToggle = styled("span")`
  :hover {
    cursor: pointer;
  }
`;
const AnimatedAccordian = styled.div`
  max-height: 0;
  /* This is used to calculate a fixed height for the accordian since height
     transitions require a fixed height for their end height */
  max-height: ${(props: { hide: boolean }) => !props.hide && "1500px"};
  overflow-y: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const DropDownTextStyle = styled("span")`
  margin-right: 24px;
`;

const DropDownText = styled(Body)`
  font-size: 16px;
`;
