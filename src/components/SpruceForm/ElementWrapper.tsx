import styled from "@emotion/styled";
import { STANDARD_FIELD_WIDTH } from "./utils";

type ElementWrapperProps = {
  limitMaxWidth?: boolean;
};

const ElementWrapper = styled.div<ElementWrapperProps>`
  margin-bottom: 20px;
  max-width: 800px;

  ${({ limitMaxWidth }) =>
    limitMaxWidth && `max-width: ${STANDARD_FIELD_WIDTH}px;`}
`;

export default ElementWrapper;
