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
        onClick={toggleAccordionHandler}
      >
        {showCaret && (
          <Icon glyph={isAccordionDisplayed ? "CaretDown" : "CaretRight"} />
        )}
        {toggledTitle ? showToggledTitle : title}
      </AccordionToggle>
      {!toggleFromBottom && (
        <AnimatedAccordion hide={!isAccordionDisplayed}>
          {contents}
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
  max-height: ${(props: { hide: boolean }): string => !props.hide && "1500px"};
  overflow-y: hidden;
  transition: max-height 0.3s ease-in-out;
`;
