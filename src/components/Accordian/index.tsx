import React, { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";

interface AccordianProps {
  title: React.ReactNode;
  toggledTitle?: React.ReactNode;
  toggleFromBottom?: boolean;
  showCaret?: boolean;
  contents: React.ReactNode;
}
export const Accordian: React.FC<AccordianProps> = ({
  title,
  toggledTitle,
  contents,
  toggleFromBottom = false,
  showCaret = true,
}) => {
  const [isAccordianDisplayed, setIsAccordianDisplayed] = useState(false);
  const toggleAccordianHandler = (): void =>
    setIsAccordianDisplayed(!isAccordianDisplayed);

  const showToggledTitle = isAccordianDisplayed ? toggledTitle : title;
  return (
    <>
      {toggleFromBottom && (
        <AnimatedAccordian hide={!isAccordianDisplayed}>
          {contents}
        </AnimatedAccordian>
      )}
      <AccordianToggle
        data-cy="accordian-toggle"
        onClick={toggleAccordianHandler}
      >
        {showCaret && (
          <Icon glyph={isAccordianDisplayed ? "CaretDown" : "CaretRight"} />
        )}
        {toggledTitle ? showToggledTitle : title}
      </AccordianToggle>
      {!toggleFromBottom && (
        <AnimatedAccordian hide={!isAccordianDisplayed}>
          {contents}
        </AnimatedAccordian>
      )}
    </>
  );
};

const AccordianToggle = styled.span`
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;
const AnimatedAccordian = styled.div`
  max-height: 0;
  /* This is used to calculate a fixed height for the accordian since height
     transitions require a fixed height for their end height */
  max-height: ${(props: { hide: boolean }): string => !props.hide && "1500px"};
  overflow-y: hidden;
  transition: max-height 0.3s ease-in-out;
`;
