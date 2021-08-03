import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { Accordion } from "components/Accordion";

const { gray } = uiColors;

interface Props {
  buildVariants: {
    displayName: string;
  }[];
}
export const BuildVariantAccordionContainer: React.FC<Props> = ({
  buildVariants,
}) => (
  <ColumnContainer>
    {buildVariants.map(({ displayName }) => (
      <div>
        <AccordionContainer key={displayName}>{displayName}</AccordionContainer>
        <Accordion contents={displayName} title="">
          AHHAHA
        </Accordion>
      </div>
    ))}
  </ColumnContainer>
);

const AccordionContainer = styled(Body)`
  margin-top: 20px;
  color: ${gray.dark2};
  font-size: 14px;
  width: 124px;
  word-break: break-word;
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
