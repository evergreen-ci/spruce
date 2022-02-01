import styled from "@emotion/styled";
import { Input } from "antd";
import { size } from "constants/tokens";

export const FiltersWrapper = styled.div`
  display: flex;
  margin-bottom: ${size.s};
  align-items: center;
`;

export const StyledInput = styled(Input)`
  max-width: 500px;
  margin-right: 40px;
`;
