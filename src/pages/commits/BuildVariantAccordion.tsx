import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";

const { gray } = uiColors;

interface Props {
  buildVariants: {
    displayName: string;
  }[];
}
export const BuildVariantAccordion: React.FC<Props> = ({ buildVariants }) => (
  <ColumnContainer>
    {buildVariants.map(({ displayName }) => (
      <AccordionContainer>{displayName}</AccordionContainer>
    ))}
  </ColumnContainer>
);

const AccordionContainer = styled(Disclaimer)`
  margin-top: 20px;
  color: ${gray.dark2};
  font-size: 14px;
  width: 123px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;
