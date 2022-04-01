import React from "react";
import styled from "@emotion/styled";
import Modal from "@leafygreen-ui/modal";
import { H3 } from "@leafygreen-ui/typography";
import { size as tokenSize, zIndex } from "constants/tokens";

interface DisplayModalProps extends React.ComponentProps<typeof Modal> {
  "data-cy"?: string;
  title?: string;
  darkMode?: boolean;
  wrapper?: (children: JSX.Element) => JSX.Element;
}

export const DisplayModal = ({
  children,
  "data-cy": dataCy,
  title,
  darkMode,
  wrapper = (c) => c,
  ...rest
}: DisplayModalProps) => (
  <StyledModal data-cy={dataCy} {...rest} darkMode={darkMode}>
    {wrapper(
      <>
        {title && (
          // @ts-expect-error
          <StyledHeader style={{ color: darkMode && "white" }}>
            {title}
          </StyledHeader>
        )}
        {children}
      </>
    )}
  </StyledModal>
);

// @ts-expect-error
const StyledModal = styled(Modal)`
  /* Ensure modal appears above feedback dialog */
  z-index: ${zIndex.modal};
`;

// @ts-expect-error
const StyledHeader = styled(H3)`
  margin-bottom: ${tokenSize.xs};
`;
