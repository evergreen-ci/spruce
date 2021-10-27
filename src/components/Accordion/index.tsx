import React, { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";

interface AccordionProps {
  title: React.ReactNode;
  toggledTitle?: React.ReactNode;
  toggleFromBottom?: boolean;
  showCaret?: boolean;
  contents: React.ReactNode;
}
export const Accordion: React.FC<AccordionProps> = ({
  title,
  toggledTitle,
  contents,
  toggleFromBottom = false,
  showCaret = true,
}) => {
  const [isAccordionDisplayed, setIsAccordionDisplayed] = useState(false);
  const toggleAccordionHandler = (): void =>
    setIsAccordionDisplayed(!isAccordionDisplayed);

  const showToggledTitle = isAccordionDisplayed ? toggledTitle : title;
  return (
    <>
      {toggleFromBottom && (
        <AnimatedAccordion hide={!isAccordionDisplayed}>
          {contents}
        </AnimatedAccordion>
      )}
      <AccordionToggle
        data-cy="accordion-toggle"
        onClick={!showCaret ? toggleAccordionHandler : undefined}
      >
        {showCaret && (
          <Icon
            onClick={toggleAccordionHandler}
            glyph={isAccordionDisplayed ? "CaretDown" : "CaretRight"}
          />
        )}
        {toggledTitle ? showToggledTitle : title}
      </AccordionToggle>
      {!toggleFromBottom && (
        <AnimatedAccordion hide={!isAccordionDisplayed}>
          <ContentsContainer indent={showCaret}>{contents}</ContentsContainer>
        </AnimatedAccordion>
      )}
    </>
  );
};

const AccordionToggle = styled.span`
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;
const AnimatedAccordion = styled.div`
  max-height: 0;
  /* This is used to calculate a fixed height for the Accordion since height
     transitions require a fixed height for their end height */
  max-height: ${(props: { hide: boolean }): string => !props.hide && "6000px"};
  overflow-y: ${(props: { hide: boolean }): string =>
    props.hide ? "hidden" : "visible"};
  transition: max-height 0.3s ease-in-out;
`;
const ContentsContainer = styled.div`
  margin-left: ${(props: { indent: boolean }): string =>
    props.indent && "16px"};
`;
