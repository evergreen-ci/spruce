import React, { useState } from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import { ModuleCodeChanges } from "types/patch";
import { CodeChangeItem, FileDiffText } from "./CodeChangeItem";

const DropDownText = styled(Body)`
  font-size: 16px;
`;

const totalFileDiffs = fileDiffs => {
  let additions = 0;
  let deletions = 0;
  for (let i = 0; i < fileDiffs.length; i++) {
    additions += fileDiffs[i].additions;
    deletions += fileDiffs[i].deletions;
  }
  return { additions, deletions };
};

const CodeChangeModuleContainer = styled("div")`
  margin-top: 16px;
`;
const AccordianToggle = styled("span")`
  :hover {
    cursor: pointer;
  }
`;
const AnimatedAccordian = styled("div")`
  max-height: 0;
  /* This is used to calculate a fixed height for the accordian since height
     transitions require a fixed height for their end height */
  max-height: ${(props: { hide: boolean }) => !props.hide && `1500px`};
  overflow-y: hidden;
  transition: max-height 0.3s ease-in-out;
`;
const CodeChangeModule: React.FC<{ moduleCodeChange: ModuleCodeChanges }> = ({
  moduleCodeChange
}) => {
  const { fileDiffs } = moduleCodeChange;
  const { additions, deletions } = totalFileDiffs(fileDiffs);
  const [toggleAccordian, setToggleAccordian] = useState(false);
  return (
    <CodeChangeModuleContainer>
      <AccordianToggle onClick={() => setToggleAccordian(!toggleAccordian)}>
        <Icon glyph={toggleAccordian ? "CaretDown" : "CaretUp"} />
        <DropDownText>
          Total Code changes
          <FileDiffText value={additions} type="+" />
          <FileDiffText value={deletions} type="-" />
        </DropDownText>
      </AccordianToggle>
      <AnimatedAccordian hide={!toggleAccordian}>
        {fileDiffs.map((fileDiff, index) => (
          <CodeChangeItem
            {...fileDiff}
            isLastItem={fileDiffs.length - 1 === index}
          />
        ))}
      </AnimatedAccordian>
    </CodeChangeModuleContainer>
  );
};

export const CodeChangeModules: React.FC<{
  moduleCodeChanges: ModuleCodeChanges[];
}> = ({ moduleCodeChanges }) => {
  return (
    <div>
      {moduleCodeChanges.map(moduleCodeChange => (
        <CodeChangeModule moduleCodeChange={moduleCodeChange} />
      ))}
    </div>
  );
};
