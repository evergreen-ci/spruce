import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const { gray } = uiColors;

export const Square = styled.div`
  height: 12px;
  width: 12px;
  background-color: ${(props: { color: string }): string =>
    props.color ? props.color : gray.light1};
  margin-right: 1px;
  margin-bottom: 1px;
  color: white;
`;
