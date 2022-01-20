import { useRef, useEffect, useState } from "react";
import { SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";

interface StickyContainerProps {
  offset?: number;
  styles?: SerializedStyles;
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const StickyContainer: React.FC<StickyContainerProps> = ({
  children,
  styles,
  offset,
  containerRef,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);
  const scrollableRef = (containerRef && containerRef.current) || window;
  useEffect(() => {
    scrollableRef.addEventListener("scroll", () => {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect();
        console.log("Firing scroll event", top);
        if (top < offset) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      }
    });
    return () => {
      scrollableRef.removeEventListener("scroll", () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div ref={ref} />
      <StickyDiv sticky={sticky} css={sticky && styles} offset={offset}>
        {children}
      </StickyDiv>
    </>
  );
};

interface StickyDivProps {
  sticky: boolean;
  offset?: number;
  css?: SerializedStyles;
}
const StickyDiv = styled.div<StickyDivProps>`
  ${({ sticky, offset = 0, css }) =>
    sticky &&
    `
        position: fixed;
        top: ${offset}px;
        ${css}
  `}
`;

export default StickyContainer;
