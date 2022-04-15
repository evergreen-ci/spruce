import React, { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { size } from "constants/tokens";

interface AccordionProps {
  title: React.ReactNode;
  toggledTitle?: React.ReactNode;
  toggleFromBottom?: boolean;
  showCaret?: boolean;
  allowToggleFromTitle?: boolean;
  defaultOpen?: boolean;
  titleTag?: React.VFC;
  onToggle?: (s: { isVisible: boolean }) => void;
  useIndent?: boolean;
  children: React.ReactNode;
  isOpen?: boolean;
}
export const Accordion: React.VFC<AccordionProps> = ({
  title,
  toggledTitle,
  children,
  toggleFromBottom = false,
  showCaret = true,
  allowToggleFromTitle = true,
  defaultOpen = false,
  titleTag,
  onToggle = () => {},
  useIndent = true,
  isOpen,
}) => {
  const [isAccordionDisplayed, setIsAccordionDisplayed] = useState(defaultOpen);
  const toggleAccordionHandler = (): void => {
    if (isOpen === undefined) {
      setIsAccordionDisplayed(!isAccordionDisplayed);
      onToggle({ isVisible: !isAccordionDisplayed });
    } else {
      onToggle({ isVisible: !isOpen });
    }
  };
  const state = isOpen ?? isAccordionDisplayed;
  const showToggledTitle = state ? toggledTitle : title;
  const TitleTag = titleTag ?? "span";
  const titleComp = (
    <TitleTag>{toggledTitle ? showToggledTitle : title}</TitleTag>
  );
  return (
    <>
      {toggleFromBottom && (
        <AnimatedAccordion hide={!state}>{children}</AnimatedAccordion>
      )}
      <Row>
        <AccordionToggle
          data-cy="accordion-toggle"
          onClick={toggleAccordionHandler}
        >
          {showCaret && <Icon glyph={state ? "CaretDown" : "CaretRight"} />}
          {allowToggleFromTitle && titleComp}
        </AccordionToggle>
        {!allowToggleFromTitle && titleComp}
      </Row>
      {!toggleFromBottom && (
        <AnimatedAccordion hide={!state}>
          <ContentsContainer indent={showCaret && useIndent}>
            {children}
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
  /* This is used to calculate a fixed height for the Accordion since height
      transitions require a fixed height for their end height */
  max-height: ${(props: { hide: boolean }): string =>
    props.hide ? "0px" : "9999px"};
  overflow-y: ${(props: { hide: boolean }): string => props.hide && "hidden"};
  transition: ${(props: { hide: boolean }): string =>
    props.hide
      ? "max-height 0.3s cubic-bezier(0, 1, 0, 1)"
      : "max-height 0.6s ease-in-out"};
`;
const ContentsContainer = styled.div`
  margin-left: ${(props: { indent: boolean }): string =>
    props.indent && size.s};
`;
