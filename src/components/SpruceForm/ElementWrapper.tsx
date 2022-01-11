import styled from "@emotion/styled";

const ElementWrapper = styled.div`
  margin-bottom: ${({ marginBottom = 20 }: { marginBottom?: number }): string =>
    `${marginBottom}px`};
`;

export default ElementWrapper;
