import React, { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";

interface AccordianProps {
  title: React.ReactNode;
  contents: React.ReactNode;
}
export const Accordian: React.FC<AccordianProps> = ({ title, contents }) => {
  const [toggleAccordian, setToggleAccordian] = useState(false);
  const toggleAccordianHandler = (): void =>
    setToggleAccordian(!toggleAccordian);
  return (
    <div>
      <AccordianToggle
        data-cy="accordian-toggle"
        onClick={toggleAccordianHandler}
      >
        <Icon glyph={toggleAccordian ? "CaretDown" : "CaretRight"} />
        {title}
      </AccordianToggle>
      <AnimatedAccordian hide={!toggleAccordian}>{contents}</AnimatedAccordian>
    </div>
  );
};

const AccordianToggle = styled.span`
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
