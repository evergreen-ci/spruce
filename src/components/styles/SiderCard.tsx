import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { size } from "constants/tokens";

export const SiderCard = styled(Card)`
  padding: ${size.s} ${size.s};

  :not(:last-of-type) {
    margin-bottom: ${size.m};
  }
`;
