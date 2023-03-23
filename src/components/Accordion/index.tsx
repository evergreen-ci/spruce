import { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { size } from "constants/tokens";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  "data-cy"?: string;
  defaultOpen?: boolean;
  onToggle?: (s: { isVisible: boolean }) => void;
  showCaret?: boolean;
  title: React.ReactNode;
  titleTag?: React.VFC;
  toggledTitle?: React.ReactNode;
  toggleFromBottom?: boolean;
  useIndent?: boolean;
}
export const Accordion: React.VFC<AccordionProps> = ({
  children,
  className,
  "data-cy": dataCy,
  defaultOpen = false,
  onToggle = () => {},
  showCaret = true,
  title,
  titleTag,
  toggledTitle,
  toggleFromBottom = false,
  useIndent = true,
}) => {
  const [isAccordionDisplayed, setIsAccordionDisplayed] = useState(defaultOpen);
  const toggleAccordionHandler = (): void => {
    setIsAccordionDisplayed(!isAccordionDisplayed);
    onToggle({ isVisible: !isAccordionDisplayed });
  };
  const showToggledTitle = isAccordionDisplayed ? toggledTitle : title;
  const TitleTag = titleTag ?? "span";
  const titleComp = (
    <TitleTag>{toggledTitle ? showToggledTitle : title}</TitleTag>
  );
  return (
    <div className={className} data-cy={dataCy}>
      {toggleFromBottom && (
        <AnimatedAccordion hide={!isAccordionDisplayed}>
          {children}
        </AnimatedAccordion>
      )}
      <AccordionToggle
        data-cy="accordion-toggle"
        onClick={toggleAccordionHandler}
      >
        {showCaret && (
          <Icon glyph={isAccordionDisplayed ? "CaretDown" : "CaretRight"} />
        )}
        {titleComp}
      </AccordionToggle>
      {!toggleFromBottom && (
        <AnimatedAccordion hide={!isAccordionDisplayed}>
          <ContentsContainer indent={showCaret && useIndent}>
            {children}
          </ContentsContainer>
        </AnimatedAccordion>
      )}
    </div>
  );
};

export const AccordionWrapper = styled.div`
  padding: 12px 0;
`;
const AccordionToggle = styled.div`
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
