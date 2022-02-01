import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { size } from "constants/tokens";

/* @ts-expect-error */
export const SiderCard = styled(Card)`
  padding-top: 10px;
  padding-right: ${size.xs};
  padding-left: ${size.xs};
  margin-bottom: 12px;
`;
