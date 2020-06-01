import React from "react";
import { PageWrapper } from "components/styles";
import { H2 } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";

export const PageDoesNotExist: React.FC = () => (
  <StyledPageWrapper>
    <H2 data-cy="404">404 Page Does Not Exist</H2>
  </StyledPageWrapper>
);

const StyledPageWrapper = styled(PageWrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 35vh;
`;
