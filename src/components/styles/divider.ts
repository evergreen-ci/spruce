import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { gray } = palette;

const Divider = styled.hr`
  background-color: ${gray.light2};
  border: 0;
  height: 1px;
  margin: ${size.xs} 0;
`;

export { Divider };
