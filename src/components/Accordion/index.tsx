import { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { size } from "constants/tokens";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  "data-cy"?: string;
  defaultOpen?: boolean;
  disableAnimation?: boolean;
  onToggle?: (s: { isVisible: boolean }) => void;
  showCaret?: boolean;
  title: React.ReactNode;
  titleTag?: React.FC;
  toggledTitle?: React.ReactNode;
  toggleFromBottom?: boolean;
  useIndent?: boolean;
  subtitle?: React.ReactNode;
}
export const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
  "data-cy": dataCy,
  defaultOpen = false,
  disableAnimation = false,
  onToggle = () => {},
  showCaret = true,
  subtitle,
  title,
  titleTag,
  toggleFromBottom = false,
  toggledTitle,
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
        <AnimatedAccordion
          hide={!isAccordionDisplayed}
          disableAnimation={disableAnimation}
          aria-expanded={isAccordionDisplayed}
          data-cy="accordion-collapse-container"
        >
          {children}
        </AnimatedAccordion>
      )}
      <AccordionToggle
        data-cy="accordion-toggle"
        onClick={toggleAccordionHandler}
        role="button"
      >
        {showCaret && (
          <Icon glyph={isAccordionDisplayed ? "CaretDown" : "CaretRight"} />
        )}
        {titleComp}
      </AccordionToggle>
      {subtitle && (
        <SubtitleContainer showCaret={showCaret}>{subtitle}</SubtitleContainer>
      )}
      {!toggleFromBottom && (
        <AnimatedAccordion
          hide={!isAccordionDisplayed}
          disableAnimation={disableAnimation}
          aria-expanded={isAccordionDisplayed}
          data-cy="accordion-collapse-container"
        >
          <ContentsContainer indent={showCaret && useIndent}>
            {children}
          </ContentsContainer>
        </AnimatedAccordion>
      )}
    </div>
  );
};

const AccordionToggle = styled.div`
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;

const AnimatedAccordion = styled.div<{
  hide: boolean;
  disableAnimation: boolean;
}>`
  /* This is used to calculate a fixed height for the Accordion since height
      transitions require a fixed height for their end height */
  max-height: ${({ hide }): string => (hide ? "0px" : "9999px")};
  overflow-y: ${({ hide }): string => hide && "hidden"};
  ${({ disableAnimation, hide }): string =>
    !disableAnimation &&
    `transition: ${
      hide
        ? "max-height 0.3s cubic-bezier(0, 1, 0, 1)"
        : "max-height 0.6s ease-in-out"
    }`};
`;
const ContentsContainer = styled.div`
  margin-left: ${(props: { indent: boolean }): string =>
    props.indent && size.s};
`;

const SubtitleContainer = styled.div<{ showCaret: boolean }>`
  ${({ showCaret }): string => showCaret && `margin-left: ${size.s};`}
`;
