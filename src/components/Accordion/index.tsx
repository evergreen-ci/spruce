import React, { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { size } from "constants/tokens";

interface AccordionProps {
  title: React.ReactNode;
  toggledTitle?: React.ReactNode;
  toggleFromBottom?: boolean;
  showCaret?: boolean;
  contents: React.ReactNode;
  allowToggleFromTitle?: boolean;
  defaultOpen?: boolean;
  titleTag?: React.FC;
  onToggle?: (nextState?: boolean) => void;
  useIndent?: boolean;
}
export const Accordion: React.FC<AccordionProps> = ({
  title,
  toggledTitle,
  contents,
  toggleFromBottom = false,
  showCaret = true,
  allowToggleFromTitle = true,
  defaultOpen = false,
  titleTag,
  onToggle = () => {},
  useIndent = true,
}) => {
  const [isAccordionDisplayed, setIsAccordionDisplayed] = useState(defaultOpen);
  const toggleAccordionHandler = (): void => {
    const nextState = !isAccordionDisplayed;
    setIsAccordionDisplayed(nextState);
    onToggle(nextState);
  };

  const showToggledTitle = isAccordionDisplayed ? toggledTitle : title;
  const TitleTag = titleTag ?? "span";
  const titleComp = (
    <TitleTag>{toggledTitle ? showToggledTitle : title}</TitleTag>
  );
  return (
    <>
      {toggleFromBottom && (
        <AnimatedAccordion hide={!isAccordionDisplayed}>
          {contents}
        </AnimatedAccordion>
      )}
      <Row>
        <AccordionToggle
          data-cy="accordion-toggle"
          onClick={toggleAccordionHandler}
        >
          {showCaret && (
            <Icon glyph={isAccordionDisplayed ? "CaretDown" : "CaretRight"} />
          )}
          {allowToggleFromTitle && titleComp}
        </AccordionToggle>
        {!allowToggleFromTitle && titleComp}
      </Row>
      {!toggleFromBottom && (
        <AnimatedAccordion hide={!isAccordionDisplayed}>
          <ContentsContainer indent={showCaret && useIndent}>
            {contents}
          </ContentsContainer>
        </AnimatedAccordion>
      )}
    </>
  );
};

export const AccordionWrapper = styled.div`
  padding: 12px 0;
`;
const Row = styled.div`
  display: flex;
`;
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
    props.indent && size.s};
`;
